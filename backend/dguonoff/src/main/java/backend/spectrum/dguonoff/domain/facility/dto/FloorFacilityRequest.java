package backend.spectrum.dguonoff.domain.facility.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FloorFacilityRequest {
    private Boolean bookable;
    private Integer floor;
}
