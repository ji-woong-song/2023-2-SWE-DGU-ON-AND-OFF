package backend.spectrum.dguonoff.domain.admin.repository;

import backend.spectrum.dguonoff.DAO.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
