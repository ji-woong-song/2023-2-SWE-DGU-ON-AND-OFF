package backend.spectrum.dguonoff.domain.admin.service;

import backend.spectrum.dguonoff.DAO.Event;
import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.FixedSchedule;
import backend.spectrum.dguonoff.DAO.Reservation;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.domain.admin.converter.FixedScheduleConverter;
import backend.spectrum.dguonoff.domain.admin.dto.DailyScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.PostNewScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.UpdateScheduleRequest;
import backend.spectrum.dguonoff.domain.admin.dto.UpdateScheduleResponse;
import backend.spectrum.dguonoff.domain.admin.dto.common.EventInfoDTO;
import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;
import backend.spectrum.dguonoff.domain.admin.repository.FixedScheduleRepository;
import backend.spectrum.dguonoff.domain.admin.repository.TempReservationRepository;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.reservation.repository.EventRepository;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import backend.spectrum.dguonoff.global.util.IntervalUtil;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class FixedScheduleService {
    private final TempReservationRepository tempReservationRepository;
    private final UserRepository userRepository;
    private final FixedScheduleRepository fixedScheduleRepository;
    private final FacilityRepository facilityRepository;
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public List<DailyScheduleResponse> getFixedTimeTables(DayOfWeek day, LocalDate startDate, LocalDate endDate,
                                                          String code, String buildingName) {
        List<FixedSchedule> schedules = fixedScheduleRepository.findByDayAndStartDateBetweenAndFacility_Building_NameAndFacility_Code(
                day, startDate, endDate, buildingName, code);
        return schedules.stream()
                .map(FixedScheduleConverter::toFixedScheduleDTO)
                .collect(Collectors.toList());
    }
    @Transactional
    public PostNewScheduleResponse enrollFixedTimeTable(String adminId, PostNewScheduleRequest request) {
        // 시설물 id로 시설물을 찾는다.
        Facility facility = facilityRepository.findByBuilding_NameAndCode(
                request.getFacility().getBuildingName(),
                request.getFacility().getCode()
        ).orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_FACILITY));

        // 유저 id로 유저를 찾는다.
        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_USER));
        // 겹치는 고정 시간표가 있는지 확인
        List<Reservation> reservations = tempReservationRepository.findByDateAfterOrDateEqualsAndStartTimeAfter(
                LocalDate.now(), LocalDate.now(), LocalTime.now());
        FixedSchedule fixedSchedule = FixedScheduleConverter.toFixedScheduleEntity(request, facility, admin);
        // 겹치지 않았다면 해당 시간표 대로 주어진 기간에 주어진 시간대에 예약을 한다.
        checkOverlappedReservation(request, facility, fixedSchedule.getEvent(), reservations);
        // 주어진 파라미터로 부터 schedule 객체를 만든다.
        fixedSchedule.reserve();
        // 주어진 대로 저장한다.
        fixedScheduleRepository.save(fixedSchedule);
        return PostNewScheduleResponse.builder()
                .scheduleId(fixedSchedule.getId())
                .build();
    }
    @Transactional
    public UpdateScheduleResponse updateSchedule(UpdateScheduleRequest request) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        FixedSchedule persistentSchedule = fixedScheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_SCHEDULE));
        Event event = persistentSchedule.getEvent();
        // 바꾸려는 시설물 검색
        Facility newFacility = facilityRepository.findByBuilding_NameAndCode(
                request.getScheduleInfo().getFacility().getBuildingName(),
                request.getScheduleInfo().getFacility().getCode()
        ).orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_FACILITY));
        // 다음에 올 예약 정보들
        List<Reservation> futureReservations = tempReservationRepository.findByDateAfterOrDateEqualsAndStartTimeAfter(
                LocalDate.now(), LocalDate.now(), LocalTime.now());
        // 지난 예약이 있는지 확인
        List<Reservation> passedReservation = event.getPastReservation(today, now);
        // 이미 지난 예약 정보가 없다면 event를 새로 만들지 않고 업데이트 수행
        System.out.println("updateSchedule에서 " + event.getReservations().size());
        if (passedReservation.isEmpty())
            return updateWithoutEventChange(persistentSchedule, request.getScheduleInfo(), newFacility);
        
        // 이미 지난 예약 정보가 있을 경우
        
        // 이벤트 정보가 바뀌었다면
        if (isEventInfoChanged(persistentSchedule, request.getScheduleInfo().getEvent())) {
            Event newEvent = FixedScheduleConverter.toEventEntity(request.getScheduleInfo().getEvent());
            // 예약정보는 하나도 안바뀐 경우
            if (!isScheduleTimeChanged(persistentSchedule, request.getScheduleInfo(), newFacility)) {
                // 새 event에 아직 지나지 않은 reservation 정보들을 옮기기
                event.moveReservation(today, now, newEvent);
                eventRepository.save(event);
                persistentSchedule.setEvent(newEvent);
                return new UpdateScheduleResponse(fixedScheduleRepository.save(persistentSchedule).getId());
            }
            // 예약 정보가 바뀌었을 경우
            checkOverlappedReservation(request.getScheduleInfo(), newFacility, event, futureReservations);
            // 이후에 시작하는 예약 정보들 삭제
            event.cancelReservation(today, now);
            // 임시 스케쥴 객체로 newEvent에 예약하기
            FixedSchedule tempSchedule = FixedScheduleConverter.toFixedScheduleEntity(request.getScheduleInfo(),
                    newFacility, newEvent);
            List<Reservation> reserve = tempSchedule.reserve();
            for (Reservation reservation : reserve) {
                reservation.setEvent(event);
            }
            // 새롭게 예약한 정보들을 가진 event 랑 기존 스케쥴이랑 연결한다.
            persistentSchedule.setEvent(newEvent);
            return new UpdateScheduleResponse(fixedScheduleRepository.save(persistentSchedule).getId());
        }

        // 이벤트 정보 변경 없이 예약 시간대만 바뀐 경우
        // 시간표 겹치는 지 확인
        checkOverlappedReservation(request.getScheduleInfo(), newFacility, event, futureReservations);
        // 앞으로 오는 예약 다 취소
        event.cancelReservation(today, now);
        // 새 정보로 update 후 예약하기
        updateScheduleTime(persistentSchedule, newFacility, request.getScheduleInfo());
        persistentSchedule.reserve();
        // 지금까지 변동 사항 반영
        return new UpdateScheduleResponse(fixedScheduleRepository.save(persistentSchedule).getId());
    }

    /**
     * 아직 지난 예약이 없을 때,
     * 새 이벤트 객체 없이 업데이트 합니다.
     * @param schedule
     * @param request
     * @param facility
     */
    @Transactional
    public UpdateScheduleResponse updateWithoutEventChange(FixedSchedule schedule, PostNewScheduleRequest request, Facility facility)  {
        // 기존 event 객체에 요청으로 받은 이벤트 정보를 반영
        Event event = schedule.getEvent();
        // 기존 예약 객체 제거
        event.clearReservation();
        System.out.println("후" + event.getReservations().size());
        updateEventInfo(event, request.getEvent());
        schedule.setGuestNumber(request.getEvent().getGuestNumber());

        // 스케쥴이 달라졌다면 예약 정보들을 수정한다.
        if (isScheduleTimeChanged(schedule, request, facility)) {
            List<Reservation> reservations = tempReservationRepository.findByDateAfterOrDateEqualsAndStartTimeAfter(
                    LocalDate.now(), LocalDate.now(), LocalTime.now());
            checkOverlappedReservation(request, facility, event, reservations);
            // 달라진 스케쥴 정보로 수정후 예약하기.
            updateScheduleTime(schedule, facility, request);
            schedule.reserve();
        }
        FixedSchedule save = fixedScheduleRepository.save(schedule);
        return new UpdateScheduleResponse(save.getId());
    }

    /**
     * 인자로 들어온 reservation 리스트와 겹치는 시간대가 있는지 검증한다.
     * @param request
     * @param facility
     * @param reservations
     */
    public void checkOverlappedReservation(PostNewScheduleRequest request, Facility facility, Event event,
                                            List<Reservation> reservations) {
        for (Reservation reservation : reservations) {
            // 같은 요일이 아니거나 같은 건물이 아니면 체크하지 않는다.
            if (!reservation.getDate().getDayOfWeek().equals(request.getDay()) ||
                !reservation.getFacility().getId().equals(facility.getId()) ||
                reservation.getEvent().getId().equals(event.getId()))
                continue;
            // 같은 요일의 경우 겹치는 시간대를 확인한다.
            PeriodDTO<LocalTime> timeInterval = new PeriodDTO<>(reservation.getStartTime(), reservation.getEndTime());
            // 유효기간도 겹치고 시간대도 겹치면 에러 발생
            if (dateOverlapped(request, reservation) && IntervalUtil.isOverlapped(request.getTime(), timeInterval)){
                throw new BusinessException(ErrorCode.EXIST_OVERLAPPED_INTERVAL);
            }
        }
    }

    /**
     * 고정스케쥴 삭제
     * @param scheduleId
     * @return
     */
    public String removeSchedule(Long scheduleId) {
        FixedSchedule fixedSchedule = this.fixedScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_SCHEDULE));
        Event event = fixedSchedule.getEvent();
        event.cancelReservation(LocalDate.now(), LocalTime.now());
        this.eventRepository.save(event);
        fixedSchedule.setEvent(null);
        this.fixedScheduleRepository.delete(fixedSchedule);
        return "success";
    }

    /**
     *
     * @param schedule
     * @param newFacility
     * @param request
     */
    public void updateScheduleTime(FixedSchedule schedule,
                                  Facility newFacility,
                                  PostNewScheduleRequest request) {
        schedule.setDay(request.getDay());
        schedule.setFacility(newFacility);
        schedule.setStartDate(request.getEffectiveDate().getStart());
        schedule.setEndDate(request.getEffectiveDate().getEnd());
//            schedule.setReservationAdmin();
        schedule.setStartTime(request.getTime().getStart());
        schedule.setEndTime(request.getTime().getEnd());
    }

    /**
     * eventInfo 정보를 event entity 에 반영한다.
     * @param event
     * @param eventInfo
     */
    public void updateEventInfo(Event event, EventInfoDTO eventInfo) {
        event.setName(eventInfo.getName());
        event.setOutline(eventInfo.getOutline());
        event.setPurpose(eventInfo.getPurpose());
        event.setHostName(eventInfo.getHostName());
    }

    /**
     * 이벤트 자체 정보가 변경 되었는지 확인
     * (이벤트명, 이벤트 주선자 이름, 이벤트 목적, 이벤트 개요)
     * @param schedule
     * @param dto
     * @return
     */
    public boolean isEventInfoChanged(FixedSchedule schedule, EventInfoDTO dto) {
        Event event = schedule.getEvent();
        return (!event.getPurpose().equals(dto.getPurpose())) ||
                (!event.getOutline().equals(dto.getPurpose())) ||
                (!event.getName().equals(dto.getName())) ||
                (!event.getHostName().equals(dto.getHostName())) ||
                (!schedule.getGuestNumber().equals(dto.getGuestNumber()));
    }
    /**
     * 예약 정보가 변경되었는지 확인
     * @param schedule
     * @param request 업데이트 시도하는 값들
     * @param newFacility
     * @return
     */
    public boolean isScheduleTimeChanged(FixedSchedule schedule,
                                          PostNewScheduleRequest request,
                                          Facility newFacility) {
        return (!schedule.getEndTime().equals(request.getEffectiveDate().getEnd())) ||
                (!schedule.getStartTime().equals(request.getTime().getStart())) ||
                (!schedule.getEndDate().equals(request.getEffectiveDate().getEnd())) ||
                (!schedule.getStartTime().equals(request.getEffectiveDate().getStart())) ||
                (!schedule.getDay().equals(request.getDay())) ||
                (!schedule.getFacility().getId().equals(newFacility.getId()));
    }

    /**
     * reservation과 요청 받은 날짜가 겹치는지 확인
     * @param request
     * @param reservation
     * @return
     */
    public static boolean dateOverlapped(PostNewScheduleRequest request, Reservation reservation) {
        return reservation.getDate().getDayOfWeek().equals(request.getDay()) &&
                reservation.getDate().isAfter(request.getEffectiveDate().getStart()) &&
                reservation.getDate().equals(request.getEffectiveDate().getStart()) &&
                reservation.getDate().isBefore(request.getEffectiveDate().getEnd()) &&
                reservation.getDate().equals(request.getEffectiveDate().getEnd());
    }
}
