package backend.spectrum.dguonoff.domain.facility.api;

import backend.spectrum.dguonoff.domain.facility.dto.BuildingNameResponse;
import backend.spectrum.dguonoff.domain.facility.service.FacilityService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(("/api/building"))
@RequiredArgsConstructor
public class BuildingController {
    private final FacilityService facilityService;
    @GetMapping("/names")
    public ResponseEntity<BuildingNameResponse> getBuildingNames() {
        List<String> allBuildingNames = facilityService.getAllBuildingNames();
        return ResponseEntity.ok(new BuildingNameResponse(allBuildingNames));
    }

}
