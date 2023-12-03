package backend.spectrum.dguonoff.domain.reservation.api;

import backend.spectrum.dguonoff.domain.reservation.dto.AvailabilityResponse;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint;
import backend.spectrum.dguonoff.domain.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;

import static backend.spectrum.dguonoff.global.statusCode.CommonCode.AVAILABLE_FACILITY;

@RestController
@Slf4j
@RequestMapping("api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    //예약 가능 확인하기 기능
    @GetMapping("/available/{facilityCode}/{date}")
    public ResponseEntity<AvailabilityResponse> checkReservationAvailability(@PathVariable String facilityCode, @PathVariable String date, Principal principal){
        String userId = principal.getName();
        LocalDate parsedDate = LocalDate.parse(date);

        //예약 신청 가능 기간 검증
        DateConstraint constraint = reservationService.getAvailableDate(facilityCode);

        //최대 예약 횟수 초과 검증
        reservationService.validateMaxReservation(facilityCode, parsedDate, userId);

        HttpStatus successStatus = AVAILABLE_FACILITY.getStatus();
        String successMessage = AVAILABLE_FACILITY.getMessage();
        AvailabilityResponse response = new AvailabilityResponse(constraint, successMessage);

        return new ResponseEntity<>(response, successStatus);
    }

}
