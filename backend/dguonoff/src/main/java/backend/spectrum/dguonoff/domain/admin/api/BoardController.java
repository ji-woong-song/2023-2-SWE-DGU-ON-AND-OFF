package backend.spectrum.dguonoff.domain.admin.api;

import backend.spectrum.dguonoff.domain.admin.dto.BoardDetailDTO;
import backend.spectrum.dguonoff.domain.admin.dto.BoardTotalDTO;
import backend.spectrum.dguonoff.domain.admin.service.BoardService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {
    private final BoardService boardService;

    @GetMapping("/")
    public ResponseEntity<List<BoardTotalDTO>> getOutlines() {
        return ResponseEntity.ok(boardService.getOutlines());
    }
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardDetailDTO> getDetail(@PathVariable Long boardId) {
        return ResponseEntity.ok(boardService.getDetail(boardId));
    }

}
