package backend.spectrum.dguonoff.domain.reservation.repository;

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

    @Query("select count(r) from Reservation r " +
            "where r.hotUserId.id = ?1 and r.date between ?2 and ?3 and r.facility.category.name = ?4")
    long countFacilityUsageForCategory(String id, LocalDate dateStart, LocalDate dateEnd, String category);

    List<Reservation> findByFacility_IdAndDate(String id, LocalDate date);

}
