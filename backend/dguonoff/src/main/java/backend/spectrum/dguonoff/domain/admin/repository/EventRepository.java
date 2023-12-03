package backend.spectrum.dguonoff.domain.admin.repository;

import backend.spectrum.dguonoff.DAO.Event;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @EntityGraph(value = "Event.withReservations", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Event> findById(Long id);
}
