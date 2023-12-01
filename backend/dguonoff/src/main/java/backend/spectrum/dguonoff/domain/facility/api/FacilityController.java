package backend.spectrum.dguonoff.domain.facility.api;

import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityListResponse;
import backend.spectrum.dguonoff.domain.facility.service.FacilityService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/facility")
@RequiredArgsConstructor
public class FacilityController {
    private final FacilityService facilityService;
    @GetMapping("/bookable")
    public ResponseEntity<FloorFacilityListResponse> getFloorFacilities(
            Principal principal, @RequestParam Integer floor, @RequestParam String buildingName
    ) {
        FloorFacilityListResponse facilityList = facilityService.getFacilityList(
                principal.getName(), floor, buildingName);
        return ResponseEntity.ok(facilityList);
    }

    @GetMapping("/")
    public ResponseEntity<FloorFacilityListResponse> getAllFloorFacilities(
            Principal principal, @RequestParam Integer floor, @RequestParam String buildingName
    ) {
        FloorFacilityListResponse facilityList = facilityService.getAllFacilityList(
                principal.getName(), floor, buildingName);
        return ResponseEntity.ok(facilityList);
    }
}
