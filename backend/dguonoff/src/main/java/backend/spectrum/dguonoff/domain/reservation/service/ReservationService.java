package backend.spectrum.dguonoff.domain.reservation.service;

import backend.spectrum.dguonoff.DAO.*;
import backend.spectrum.dguonoff.DAO.idClass.ParticipationReservationId;
import backend.spectrum.dguonoff.DAO.model.ReservationPeriod;
import backend.spectrum.dguonoff.DAO.model.ReservationStatus;
import backend.spectrum.dguonoff.DAO.model.Role;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.facility.service.FacilityService;
import backend.spectrum.dguonoff.domain.reservation.dto.GuestInfo;
import backend.spectrum.dguonoff.domain.reservation.dto.ReservationInfoResponse;
import backend.spectrum.dguonoff.domain.reservation.dto.ReservationModificationRequest;
import backend.spectrum.dguonoff.domain.reservation.dto.ReservationRequest;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.MaxReservationConstraint;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.UsageConstraint;
import backend.spectrum.dguonoff.domain.reservation.exception.*;
import backend.spectrum.dguonoff.domain.facility.exception.FacilityNotFoundException;
import backend.spectrum.dguonoff.domain.reservation.repository.EventRepository;
import backend.spectrum.dguonoff.domain.reservation.repository.ParticipationReservationRepository;
import backend.spectrum.dguonoff.domain.reservation.repository.ReservationRepository;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static backend.spectrum.dguonoff.DAO.model.ReservationStatus.*;
import static backend.spectrum.dguonoff.DAO.model.Role.*;
import static backend.spectrum.dguonoff.global.statusCode.ErrorCode.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReservationService {
    //상수 정의
    private static final int MARCH = 3;
    private static final int AUGUST = 8;
    private static final int SEPTEMBER = 9;
    private static final int FIRST_DAY_OF_MONTH = 1;
    private static final int ONE_DAY = 1;
    private static final int NEXT_SEMESTER_MONTH = 5;
    private static final int NO_MAX_TIME = 0;

    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final ParticipationReservationRepository participationReservationRepository;
    private final FacilityService facilityService;



    //예약할 수 있는 날짜 기준일을 반환해주는 함수
    public DateConstraint getAvailableDate(String facilityCode) {
        DateConstraint constraint = facilityRepository
                .findDateConstraint(facilityCode)
                .orElseThrow(
                        () -> new FacilityNotFoundException(ErrorCode.NOT_EXIST_FACILITY));
        return constraint;
    }

    //시설물 이용 횟수 초과를 확인하는 함수
    public void validateMaxReservation(String facilityCode, LocalDate date, String userId) {

        //관리자인 경우 이용 횟수 초과를 확인하지 않음
        if (!userRepository.findById(userId).get().getRole().equals(NORMAL)) {
            return;
        }

        //시설물의 예약 제한 정보를 가져옴
        MaxReservationConstraint constraint = facilityRepository
                .findReservationConstraint(facilityCode)
                .orElseThrow(
                        () -> new FacilityNotFoundException(ErrorCode.NOT_EXIST_FACILITY));

        //예약 제한 정보에서 카테고리명, 최대 예약 횟수, 기준 기간을 가져옴
        String category = constraint.getCategory();
        int maxReservation = constraint.getMax_reservation();
        ReservationPeriod maxReservationPeriod = constraint.getMax_reservation_period();

        //최대 예약 기간에 따라 시작 날짜와 끝 날짜를 계산
        LocalDate startDate;
        LocalDate endDate;

        switch (maxReservationPeriod) {
            case MONTH:
                startDate = date.withDayOfMonth(FIRST_DAY_OF_MONTH);
                endDate = date.withDayOfMonth(date.lengthOfMonth());
                break;

            case SEMESTER:
                int semesterStartMonth;
                semesterStartMonth = date.getMonthValue() >= MARCH && date.getMonthValue() <= AUGUST ? MARCH : SEPTEMBER; //학기 시작 월 계산
                LocalDate semesterStartDate = LocalDate.of(date.getYear(), semesterStartMonth, FIRST_DAY_OF_MONTH);
                startDate = semesterStartDate;
                endDate = semesterStartDate.plusMonths(NEXT_SEMESTER_MONTH).withDayOfMonth(FIRST_DAY_OF_MONTH).minusDays(ONE_DAY);
                break;

            default:
                throw new InvalidPeriodException(NOT_DEFINED_RESERVATION_PERIOD); //예약 기간이 정의되지 않은 경우
        }

        //시설물 이용 횟수 계산
        long usageCount = reservationRepository.countFacilityUsageForCategory(userId, startDate, endDate, category);

        if (usageCount >= maxReservation) { //최대 예약 횟수를 초과한 경우
            throw new ExceedMaxReservation(EXCEED_MAX_RESERVATION, maxReservation);
        }
    }

    //예약을 등록하는 함수
    public void registerReservation(ReservationRequest reservationRequest, String userId) {

        String title = reservationRequest.getTitle();
        LocalDate reservationDate = LocalDate.parse(reservationRequest.getDate());
        LocalTime startTime = LocalTime.parse(reservationRequest.getStartTime());
        LocalTime endTime = LocalTime.parse(reservationRequest.getEndTime());
        String facilityCode = reservationRequest.getFacilityCode();
        String outline = reservationRequest.getOutline();
        String purpose = reservationRequest.getPurpose();
        List<String> guestList = reservationRequest.getGuestIds();
        ReservationStatus status;

        User user = userRepository.findById(userId) //유저가 존재하지 않는 경우
                .orElseThrow(
                        () -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));

        Facility facility = facilityRepository.findByCode(facilityCode) //시설물이 존재하지 않는 경우
                .orElseThrow(
                        () -> new FacilityNotFoundException(ErrorCode.NOT_EXIST_FACILITY));


        //예약 유효성 검사
        validateMaxReservation(facilityCode, reservationDate, userId); // 최대 예약 횟수를 초과한 경우 예외 발생
        validateAvailableDate(reservationDate, facilityCode); //예약 가능 날짜인지 검사
        validateTime(startTime, endTime); //예약 시간이 유효한지 검사
        validateTimeConflict(startTime, endTime, facilityCode, reservationDate); //다른 예약과 시간이 곂치는지 검사
        validateUsageConstraint(startTime, endTime, facilityCode, guestList); //시설물 이용 제한을 위반한 경우 예외 발생

        //예약자의 권한에 따라 예약 상태 설정
        if(user.getRole().equals(NORMAL)) {
            status = PENDING;
        } else {
            status = APPROVED;
        }

        //이벤트 등록하기
        Event event = Event.builder()
                .hostName(title)
                .name(user.getName())
                .outline(outline)
                .purpose(purpose)
                .build();
        eventRepository.saveAndFlush(event);

        //예약 등록하기
        Reservation reservation = Reservation.builder()
                .status(status)
                .date(reservationDate)
                .startTime(startTime)
                .endTime(endTime)
                .facility(facility)
                .hotUserId(user)
                .build();
        reservation.setEvent(event);
        reservationRepository.saveAndFlush(reservation);


        //게스트 유저 참여 예약 등록
        guestList.forEach(guestId -> {
            User guest = userRepository.findById(guestId)
                    .orElseThrow(
                            () -> new UserNotFoundException(NOT_EXIST_USER));

            Participation_Reservation participation_reservation = Participation_Reservation.builder()
                    .bookmarkId(ParticipationReservationId.builder()
                            .reservationId(reservation.getReservationId())
                            .userId(guest.getId())
                            .build())
                    .reservationId(reservation)
                    .guestId(guest)
                    .build();
            participationReservationRepository.save(participation_reservation);
        });

    }

    //예약을 수정하는 함수
    public void modifyReservation(ReservationModificationRequest modificationRequest, String userId) {

        Long reservationId = modificationRequest.getReservationId();

        ReservationStatus status = reservationRepository.findStatusById(reservationId)
                .orElseThrow( //예약이 존재하지 않는 경우
                        () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));

        //예약 변경 가능 상태 확인
        if(status != PENDING && status != APPROVED){
            throw new InvalidReservationException(ErrorCode.NOT_MODIFIABLE_RESERVATION);
        }

        //예약자와 수정자가 일치하는지 확인
        String hostUserId = reservationRepository.findHostUserById(reservationId)
                .orElseThrow(
                        () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));

        if(!hostUserId.equals(userId)){
            throw new InvalidReservationException(ErrorCode.NOT_MODIFIABLE_RESERVATION);
        }

        String outline = modificationRequest.getOutline();
        List<String> guestList = modificationRequest.getGuestIds();


        //예약 수정하기
        Event event = reservationRepository.findEventById(reservationId)
                .orElseThrow(
                        () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));
        eventRepository.updateOutline(outline, event.getId());

        //게스트 유저 참여 예약 수정
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(
                        () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));

        //참여자들의 참여 에약 리스트 수정
        List<Participation_Reservation> participation_reservations = new ArrayList<>();
        guestList.forEach(
                guestId -> {
                    User guest = userRepository.findById(guestId)
                            .orElseThrow(
                                    () -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));

                    Participation_Reservation participation_reservation = Participation_Reservation.builder()
                            .bookmarkId(ParticipationReservationId.builder()
                                    .reservationId(reservation.getReservationId())
                                    .userId(guest.getId())
                                    .build())
                            .reservationId(reservation)
                            .guestId(guest)
                            .build();
                    participation_reservations.add(participation_reservation);
                }
        );

        participationReservationRepository.deleteAllByReservation(reservation);
        participationReservationRepository.saveAll(participation_reservations);
    }

    //예약을 삭제하는 함수
    public void deleteReservation(Long reservationId, String userId) {

        //존재하는 예약인지 확인
        Reservation targetReservation = reservationRepository.findById(reservationId)
                .orElseThrow(
                        () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));

        //삭제 요청자의 권한 조회
        Role role = userRepository.findRoleById(userId).orElseThrow(
                () -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));


        if(role.equals(ADMIN) || role.equals(MASTER)){  //삭제 요청자가 관리자인 경우 예약 삭제
            log.info("관리자 삭제 요청" + userId + " " + userRepository.findRoleById(userId));
            //참여자들의 참여 에약 리스트 삭제
            participationReservationRepository.deleteAllByReservation(targetReservation);
            reservationRepository.deleteById(reservationId);
        }
        else if(role.equals(NORMAL)) { //삭제 요청자가 일반 사용자인 경우
            String hostUserId = reservationRepository.findHostUserById(reservationId)
                    .orElseThrow(
                            () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));
            if(hostUserId.equals(userId)){ //예약자와 삭제 요청자가 일치하는 경우 예약 삭제
                log.info("hostUserId: " + hostUserId + " userId: " + userId);
                //참여자들의 참여 에약 리스트 삭제
                participationReservationRepository.deleteAllByReservation(targetReservation);
                reservationRepository.deleteById(reservationId);

            }
            else { //예약자와 삭제 요청자가 일치하지 않는 경우 예외 발생
                throw new InvalidReservationException(ErrorCode.NOT_DELETABLE_RESERVATION);
            }
        }
    }

    //예약 승인 함수
    public void approveReservation(Long reservationId) {
        //존재하는 예약인지 확인
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(
                        () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));
        //예약 상태 승인으로 변경
        reservationRepository.updateStatus(APPROVED, reservationId);
    }

    //예약 거절 함수
    public void rejectReservation(Long reservationId) {
        //존재하는 예약인지 확인
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(
                        () -> new ReservationNotFoundException(ErrorCode.NOT_EXIST_RESERVATION));
        //예약 상태 거절로 변경
        reservationRepository.updateStatus(REJECTED, reservationId);
    }



    //유저의 예약 목록을 조회하는 함수
    public List<ReservationInfoResponse> getReservationInfoList(String userId) {
        //유저의 예약 목록 조회
        List<Reservation> reservationList = reservationRepository.findReservationList(userId);

        return convertToInfoResponse(reservationList);
    }

    //모든 예약 목록을 조회하는 함수
    public List<ReservationInfoResponse> getAllReservationInfoList() {

        List<Reservation> reservationList = reservationRepository.findAll();
        return convertToInfoResponse(reservationList);
    }

    //승인된 모든 예약 목록을 조회하는 함수
    public List<ReservationInfoResponse> getAllApprovedReservationInfoList() {

        List<Reservation> reservationList = reservationRepository.findAllApproved();
        return convertToInfoResponse(reservationList);
    }




    //예약 정보 응답 DTO로 변환하는 함수
    private List<ReservationInfoResponse> convertToInfoResponse(List<Reservation> reservationList) {
        List<ReservationInfoResponse> reservationInfoResponseList = new ArrayList<>();
        reservationList.forEach(
                reservation -> {
                    //이벤트 조회
                    Event event = reservation.getEvent();

                    //예약에 참여한 유저 목록 조회
                    List<GuestInfo> guestInfoList = participationReservationRepository.findGuestInfoByReservation(reservation.getReservationId());

                    reservationInfoResponseList.add(ReservationInfoResponse.builder()
                            .reservationId(reservation.getReservationId())
                            .title(event.getName())
                            .status(reservation.getStatus())
                            .date(reservation.getDate())
                            .startTime(reservation.getStartTime())
                            .endTime(reservation.getEndTime())
                            .facilityCode(reservation.getFacility().getCode())
                            .outline(event.getOutline())
                            .purpose(event.getPurpose())
                            .guests(guestInfoList)
                            .build());
                }
        );
        return reservationInfoResponseList;
    }

    //예약 시간이 유효한지 검사하는 함수
    private void validateTime(LocalTime startTime, LocalTime endTime) {
        if(startTime.isAfter(endTime)) { //시작 시간이 종료 시간보다 늦은 경우 예외 발생
            throw new InvalidTimeException(INVALID_ORDER_TIME);
        } else if (startTime.equals(endTime)) { //시작 시간과 종료 시간이 같은 경우 예외 발생
            throw new InvalidTimeException(INVALID_SAME_TIME);
        }
    }

    //예약 가능 날짜인지 검사하는 함수
    private void validateAvailableDate(LocalDate reservationDate, String facilityCode) {
        DateConstraint availableDate = getAvailableDate(facilityCode);
        LocalDate currentDate = LocalDate.now();

        LocalDate maxDate = reservationDate.minusDays(availableDate.getMaxDate());
        LocalDate minDate = reservationDate.minusDays(availableDate.getMinDate());

        if(currentDate.isAfter(minDate) || currentDate.isBefore(maxDate)) { //예약 가능 날짜가 아닌 경우 예외 발생
            throw new InvalidDateException(INVALID_RESERVATION_DATE);
        }
    }

    //기존 예약과 시간이 곂치는지 검증하는 함수
    private void validateTimeConflict(LocalTime startTime, LocalTime endTime, String facilityCode, LocalDate reservationDate) {
        List<Reservation> reservationList = reservationRepository.findByFacilityCodeAndDate(facilityCode, reservationDate);
        for (Reservation reservation : reservationList) {
            if (startTime.isBefore(reservation.getEndTime()) && endTime.isAfter(reservation.getStartTime())) {
                throw new InvalidReservationException(ErrorCode.TIME_CONFLICT); //다른 예약과 시간이 곂치는 경우 예외 발생
            }
        }
    }

    //시설물 이용 제한을 위반했는지 검증하는 함수
    private void validateUsageConstraint(LocalTime startTime, LocalTime endTime, String facilityCode, List<String> guestList) {
        UsageConstraint usageConstraint = facilityService.getUsageConstraint(facilityCode);
        long usageTime = Duration.between(startTime, endTime).toHours();

        //예약 유효성 검사: 최대 이용 시간, 최대 이용 인원, 최소 이용 인원을 초과한 경우 예외 발생
        if(usageTime > usageConstraint.getMax_time() && usageConstraint.getMax_time() != NO_MAX_TIME){ //최대 이용 시간을 초과한 경우
            throw new InvalidReservationException(ErrorCode.EXCEED_MAX_USAGE_TIME);
        } else if(guestList.size() > usageConstraint.getMax_personnel()){ //최대 이용 인원을 초과한 경우
            throw new InvalidReservationException(ErrorCode.EXCEED_MAX_PERSONNEL);
        } else if(guestList.size() < usageConstraint.getMin_personnel()){ //최소 이용 인원을 초과한 경우
            throw new InvalidReservationException(ErrorCode.UNDER_MIN_PERSONNEL);
        }
    }


}
