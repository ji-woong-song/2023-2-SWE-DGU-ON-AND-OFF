package backend.spectrum.dguonoff.domain.facility.api;

import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityListResponse;
import backend.spectrum.dguonoff.domain.facility.service.FacilityService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static backend.spectrum.dguonoff.global.statusCode.CommonCode.SUCCESS_FACILITY_FINISH;
import static backend.spectrum.dguonoff.global.statusCode.CommonCode.SUCCESS_FACILITY_LOOKUP;

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

    //특정 시설물 이용상태 확인 기능
    @GetMapping("/status/{facilityId}")
    public ResponseEntity<String> getFacilityStatus(@PathVariable String facilityId){
        FacilityStatus facilityStatus = facilityService.getFacilityStatus(facilityId);

        HttpStatus successStatus = SUCCESS_FACILITY_LOOKUP.getStatus();

        return new ResponseEntity(facilityStatus, successStatus);
    }

    //시설물 이용 종료 기능
    @GetMapping("/finish/{facilityId}")
    public ResponseEntity<String> endFacility(@PathVariable String facilityId){
        facilityService.endFacility(facilityId);

        String successMessage = SUCCESS_FACILITY_FINISH.getMessage();
        HttpStatus successStatus = SUCCESS_FACILITY_FINISH.getStatus();

        return new ResponseEntity(successMessage, successStatus);
    }
}
