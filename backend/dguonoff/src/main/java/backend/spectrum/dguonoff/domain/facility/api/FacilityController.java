package backend.spectrum.dguonoff.domain.facility.api;

import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import backend.spectrum.dguonoff.domain.facility.dto.FloorFacilityListResponse;
import backend.spectrum.dguonoff.domain.facility.dto.NextReservationResponse;
import backend.spectrum.dguonoff.domain.facility.service.FacilityService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static backend.spectrum.dguonoff.global.statusCode.CommonCode.*;

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

    //특정 시설물 다음 예약 조회 기능
    @GetMapping("/next/{facilityCode}")
    public ResponseEntity<NextReservationResponse> getNextReservation(@PathVariable String facilityCode){
        NextReservationResponse nextReservation = facilityService.getNextReservation(facilityCode);

        HttpStatus successStatus = SUCCESS_FACILITY_NEXT_RESERVATION_LOOKUP.getStatus();

        return new ResponseEntity(nextReservation, successStatus);
    }

    //특정 시설물 이용상태 확인 기능
    @GetMapping("/status/{facilityCode}")
    public ResponseEntity<String> getFacilityStatus(@PathVariable String facilityCode){
        FacilityStatus facilityStatus = facilityService.getFacilityStatus(facilityCode);

        HttpStatus successStatus = SUCCESS_FACILITY_LOOKUP.getStatus();

        return new ResponseEntity(facilityStatus, successStatus);
    }

    //시설물 이용 종료 기능
    @GetMapping("/finish/{facilityCode}")
    public ResponseEntity<String> endFacility(@PathVariable String facilityCode){
        facilityService.endFacility(facilityCode);

        String successMessage = SUCCESS_FACILITY_FINISH.getMessage();
        HttpStatus successStatus = SUCCESS_FACILITY_FINISH.getStatus();

        return new ResponseEntity(successMessage, successStatus);
    }
}
