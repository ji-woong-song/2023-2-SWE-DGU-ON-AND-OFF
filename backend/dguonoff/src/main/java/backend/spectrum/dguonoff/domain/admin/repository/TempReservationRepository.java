package backend.spectrum.dguonoff.domain.admin.repository;

import backend.spectrum.dguonoff.DAO.Reservation;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempReservationRepository extends JpaRepository<Reservation, Long> {
    /**
     * 현재시간 기준 지난 event 예약들 조회하기 (이미 시작한 예약 포함)
     * @param date
     * @param time
     * @param eventId
     * @return
     */
    List<Reservation> findByDateLessThanEqualOrDateEqualAndStartTimeBeforeAndEvent_EventId(
            LocalDate date, LocalTime time, Long eventId);

    /**
     * 현재시간 기준 앞으로 올 예약 정보들 조회하기 (이미 시작한 예약 포함 X)
     * @param date
     * @param time
     * @param eventId
     * @return
     */
    List<Reservation> findByDateAfterThanEqualOrDateEqualAndStartTimeAfterAndEvent_EventId(
            LocalDate date, LocalTime time, Long eventId);
}
