package backend.spectrum.dguonoff.domain.facility.dto;

import backend.spectrum.dguonoff.DAO.FacilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FacilityOutlineDTO {
    private String name;
    private String id;
    private Boolean bookmarked;
    private FacilityStatus status;
}
