package backend.spectrum.dguonoff.domain.board.repository;

import backend.spectrum.dguonoff.dao.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
}
