package backend.spectrum.dguonoff.domain.facility.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FloorFacilityRequest {
    private String buildingName;
    private Integer floor;
}
