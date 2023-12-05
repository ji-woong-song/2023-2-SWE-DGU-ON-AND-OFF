package backend.spectrum.dguonoff.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BoardTotalDTO {
    private Long boardId;
    private String title;
    private String authorId;
    private String body;
}
