package backend.spectrum.dguonoff.domain.reservation.repository;

import backend.spectrum.dguonoff.DAO.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("select r from Reservation r where r.facility.code = ?1 and r.date = ?2")
    List<Reservation> findByFacilityCodeAndDate(String code, LocalDate date);

    @Query("select count(r) from Reservation r " +
            "where r.hotUserId.id = ?1 and r.date between ?2 and ?3 and r.facility.category.name = ?4")
    long countFacilityUsageForCategory(String id, LocalDate dateStart, LocalDate dateEnd, String category);

    @Query("select r from Reservation r where r.hotUserId.id = ?1")
    List<Reservation> findReservationList(String id);

    @Query("select r from Reservation r where r.status = backend.spectrum.dguonoff.DAO.model.ReservationStatus.APPROVED")
    List<Reservation> findAllApproved();

}
