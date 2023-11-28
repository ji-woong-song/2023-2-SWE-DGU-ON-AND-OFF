package backend.spectrum.dguonoff.domain.facility.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FloorFacilityListResponse {
    private Integer floor;
    private List<FacilityOutlineDTO> facility;
}
