package backend.spectrum.dguonoff.domain.reservation.repository;

import backend.spectrum.dguonoff.DAO.Event;
import backend.spectrum.dguonoff.DAO.Reservation;
import backend.spectrum.dguonoff.DAO.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("select r.event from Reservation r where r.reservationId = ?1")
    Optional<Event> findEventById(Long reservationId);
    @Query("select r from Reservation r where r.facility.code = ?1 and r.date = ?2")
    List<Reservation> findByFacilityCodeAndDate(String code, LocalDate date);

    @Query("select count(r) from Reservation r " +
            "where r.hotUserId.id = ?1 and r.date between ?2 and ?3 and r.facility.category.name = ?4")
    long countFacilityUsageForCategory(String id, LocalDate dateStart, LocalDate dateEnd, String category);

    @Query("select r from Reservation r where r.hotUserId.id = ?1")
    List<Reservation> findReservationList(String id);

    @Query("select r from Reservation r where r.status = backend.spectrum.dguonoff.DAO.model.ReservationStatus.APPROVED")
    List<Reservation> findAllApproved();

    @Query("select r.hotUserId.id from Reservation r where r.reservationId = ?1")
    Optional<String> findHostUserById(Long reservationId);

    @Query("select r.status from Reservation r where r.reservationId = ?1")
    Optional<ReservationStatus> findStatusById(Long reservationId);

    @Transactional
    @Modifying
    @Query("update Reservation r set r.status = ?1 where r.reservationId = ?2")
    int updateStatus(ReservationStatus status, Long reservationId);
}
