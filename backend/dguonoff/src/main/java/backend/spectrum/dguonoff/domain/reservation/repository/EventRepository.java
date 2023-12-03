package backend.spectrum.dguonoff.domain.reservation.repository;

import backend.spectrum.dguonoff.DAO.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

}
