package backend.spectrum.dguonoff.domain.admin.repository;

import backend.spectrum.dguonoff.DAO.Reservation;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByDateAfterOrDateEqualsAndStartTimeAfter(LocalDate date, LocalDate eqDate, LocalTime time);
}
