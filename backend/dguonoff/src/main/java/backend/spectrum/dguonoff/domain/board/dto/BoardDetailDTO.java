package backend.spectrum.dguonoff.domain.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BoardDetailDTO {
    private String title;
    private String body;
    private String authorId;
}
