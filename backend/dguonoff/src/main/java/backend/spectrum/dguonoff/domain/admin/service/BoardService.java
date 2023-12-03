package backend.spectrum.dguonoff.domain.admin.service;

import backend.spectrum.dguonoff.DAO.Board;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.DAO.model.Role;
import backend.spectrum.dguonoff.domain.admin.dto.BoardDetailDTO;
import backend.spectrum.dguonoff.domain.admin.dto.BoardOutlineDTO;
import backend.spectrum.dguonoff.domain.admin.dto.PostBoardDTO;
import backend.spectrum.dguonoff.domain.admin.repository.BoardRepository;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public Long createBoard(String userId, PostBoardDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));
        Board board = Board.builder()
                .author(user)
                .title(dto.getTitle())
                .body(dto.getBody())
                .build();
        Board save = boardRepository.save(board);
        return save.getId();
    }

    public void deleteBoard(String userId, Long boardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_BOARD));
        if (user.getRole() != Role.MASTER && user.getRole() != Role.ADMIN ||
                !board.getAuthor().getId().equals(user.getId()))
                throw new BusinessException(ErrorCode.NOT_ALLOW_AUTHOR);
        boardRepository.delete(board);
    }

    public Long updateBoard(String userId, Long boardId ,PostBoardDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_BOARD));
        if (user.getRole() != Role.MASTER && user.getRole() != Role.ADMIN ||
                !board.getAuthor().getId().equals(user.getId()))
                throw new BusinessException(ErrorCode.NOT_ALLOW_AUTHOR);
        board.setBody(dto.getBody());
        board.setTitle(dto.getTitle());
        Board save = boardRepository.save(board);
        return save.getId();
    }

    @Transactional(readOnly = true)
    public List<BoardOutlineDTO> getOutlines() {
        return boardRepository.findAll().stream().map(board -> BoardOutlineDTO.builder()
                .authorId(board.getAuthor().getId())
                .title(board.getTitle())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BoardDetailDTO getDetail(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_BOARD));
        return BoardDetailDTO.builder()
                .body(board.getBody())
                .title(board.getTitle())
                .authorId(board.getAuthor().getId())
                .build();
    }
}
