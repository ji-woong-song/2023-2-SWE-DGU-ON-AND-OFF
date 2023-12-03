package backend.spectrum.dguonoff.domain.reservation.service;

import backend.spectrum.dguonoff.DAO.model.ReservationPeriod;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.MaxReservationConstraint;
import backend.spectrum.dguonoff.domain.reservation.exception.ExceedMaxReservation;
import backend.spectrum.dguonoff.domain.facility.exception.FacilityNotFoundException;
import backend.spectrum.dguonoff.domain.reservation.exception.InvalidPeriodException;
import backend.spectrum.dguonoff.domain.reservation.repository.ReservationRepository;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import com.sun.jdi.InvalidTypeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import static backend.spectrum.dguonoff.global.statusCode.ErrorCode.EXCEED_MAX_RESERVATION;
import static backend.spectrum.dguonoff.global.statusCode.ErrorCode.NOT_DEFINED_RESERVATION_PERIOD;

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

    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;



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
        if (!userRepository.findById(userId).get().getRole().equals("NORMAL")) {
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

}
