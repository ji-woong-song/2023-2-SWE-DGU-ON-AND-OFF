package backend.spectrum.dguonoff.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserBookmarkDTO {
    private String facilityName;
    private String facilityCode;
    private String buildingName;
}
