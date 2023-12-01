package backend.spectrum.dguonoff.domain.user.dto;

import backend.spectrum.dguonoff.domain.admin.dto.common.FacilityKeyDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookmarkRequest {
    private final FacilityKeyDTO facility;
}
