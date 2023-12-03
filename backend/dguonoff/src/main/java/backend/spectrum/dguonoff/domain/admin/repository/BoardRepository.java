package backend.spectrum.dguonoff.domain.admin.repository;

import backend.spectrum.dguonoff.DAO.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
}
