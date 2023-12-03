package backend.spectrum.dguonoff.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class BoardOutlineDTO {
    private Long id;
    private String title;
    private String authorId;
}
