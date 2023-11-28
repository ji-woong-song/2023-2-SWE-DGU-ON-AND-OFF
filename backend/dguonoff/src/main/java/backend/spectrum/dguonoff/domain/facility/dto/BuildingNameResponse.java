package backend.spectrum.dguonoff.domain.facility.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BuildingNameResponse {
    private List<String> buildingNames;
}
