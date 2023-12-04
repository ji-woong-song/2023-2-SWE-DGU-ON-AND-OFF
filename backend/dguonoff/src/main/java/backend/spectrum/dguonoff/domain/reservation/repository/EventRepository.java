package backend.spectrum.dguonoff.domain.reservation.repository;

import backend.spectrum.dguonoff.DAO.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface EventRepository extends JpaRepository<Event, Long> {
    @Transactional
    @Modifying
    @Query("update Event e set e.outline = ?1 where e.id = ?2")
    int updateOutline(String outline, Long id);

}
