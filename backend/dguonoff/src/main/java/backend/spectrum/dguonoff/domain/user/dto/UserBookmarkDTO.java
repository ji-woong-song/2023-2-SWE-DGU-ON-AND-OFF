package backend.spectrum.dguonoff.domain.user.dto;

import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserBookmarkDTO {
    private String facilityName;
    private String facilityCode;
    private FacilityStatus facilityState;
    private String buildingName;
}
