package backend.spectrum.dguonoff.domain.board.api;

import backend.spectrum.dguonoff.domain.board.dto.PostBoardDTO;
import backend.spectrum.dguonoff.domain.board.dto.PostBoardResponse;
import backend.spectrum.dguonoff.domain.board.service.BoardService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/board")
public class BoardAdminController {
    private final BoardService boardService;

    @PostMapping("/")
    public ResponseEntity<PostBoardResponse> postBoard(Principal principal, @RequestBody PostBoardDTO dto) {
        Long board = this.boardService.createBoard(principal.getName(), dto);
        return ResponseEntity.ok(new PostBoardResponse(board));
    }
    @PatchMapping("/{boardId}")
    public ResponseEntity<PostBoardResponse> patchBoard(Principal principal,@PathVariable Long boardId,
                                                        @RequestBody PostBoardDTO dto) {
        Long board = this.boardService.updateBoard(principal.getName(), boardId, dto);
        return ResponseEntity.ok(new PostBoardResponse(board));
    }
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Long> deleteBoard(@PathVariable Long boardId) {
        Long deleteId = this.boardService.deleteBoard(boardId);
        return ResponseEntity.ok(deleteId);
    }
}
