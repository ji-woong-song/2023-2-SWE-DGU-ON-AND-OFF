package backend.spectrum.dguonoff.domain.facility.api;

import backend.spectrum.dguonoff.domain.facility.dto.BuildingNameResponse;
import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityListResponse;
import backend.spectrum.dguonoff.domain.facility.service.FacilityService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/{buildingName}")
    public ResponseEntity<FloorFacilityListResponse> getFloorFacilities(
        @PathVariable("buildingName") String buildingName,
        @RequestParam(name="floor") Integer floor, @RequestParam(name="bookable") Boolean bookable
    ) {
        FloorFacilityListResponse facilityList = facilityService.getFacilityList(buildingName, floor, bookable);
        return ResponseEntity.ok(facilityList);
    }
}
