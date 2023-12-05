package backend.spectrum.dguonoff.domain.reservation.api;

import backend.spectrum.dguonoff.domain.reservation.dto.AvailabilityResponse;
import backend.spectrum.dguonoff.domain.reservation.dto.ReservationInfoResponse;
import backend.spectrum.dguonoff.domain.reservation.dto.ReservationModificationRequest;
import backend.spectrum.dguonoff.domain.reservation.dto.ReservationRequest;
import backend.spectrum.dguonoff.domain.reservation.dto.constraint.DateConstraint;
import backend.spectrum.dguonoff.domain.reservation.service.ReservationService;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import static backend.spectrum.dguonoff.global.statusCode.CommonCode.*;
import static backend.spectrum.dguonoff.global.statusCode.CommonCode.SUCCESS_REJECTION;

@RestController
@Slf4j
@RequestMapping("api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final UserService userService;

    //유저 자신의 예약 목록 조회 기능
    @GetMapping
    public ResponseEntity<String> getReservationInfo(Principal principal){
        String userId = principal.getName();
        List<ReservationInfoResponse> reservationInfoList = reservationService.getReservationInfoList(userId);

        HttpStatus successStatus = SUCCESS_FACILITY_LOOKUP.getStatus();

        return new ResponseEntity(reservationInfoList, successStatus);
    }

    //전체 예약 목록 조회
    @GetMapping("/admin/all")
    public ResponseEntity<String> getAllReservationInfo(Principal principal){
        String adminId = principal.getName();

        //관리자 권한 확인
        userService.checkAdmin(adminId);

        List<ReservationInfoResponse> reservationInfoList = reservationService.getAllReservationInfoList();

        return new ResponseEntity(reservationInfoList, HttpStatus.OK);
    }

    // 특정 유저의 예약 목록 조회 기능
    @GetMapping("admin/{userId}")
    public ResponseEntity<String> getUserReservationInfo(@PathVariable String userId, Principal principal){
        String adminId = principal.getName();

        //관리자 권한 확인
        userService.checkAdmin(adminId);

        List<ReservationInfoResponse> reservationInfoList = reservationService.getReservationInfoList(userId);

        return new ResponseEntity(reservationInfoList, HttpStatus.OK);
    }

    //예약 수정 기능
    @PostMapping("/modification")
    public ResponseEntity<String> modifyReservation(@RequestBody ReservationModificationRequest modificationRequest, Principal principal){
        String userId = principal.getName();

        //예약 신청
        reservationService.modifyReservation(modificationRequest, userId);

        String successMessage = String.format(SUCCESS_MODIFICATION.getMessage(), userId);
        HttpStatus successStatus = SUCCESS_MODIFICATION.getStatus();

        return new ResponseEntity(successMessage, successStatus);
    }

    //예약 삭제 기능
    @DeleteMapping("/deletion/{reservationId}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long reservationId, Principal principal){
        String userId = principal.getName();

        //예약 삭제
        reservationService.deleteReservation(reservationId, userId);


        String successMessage = String.format(SUCCESS_DELETION.getMessage(), userId);
        HttpStatus successStatus = SUCCESS_DELETION.getStatus();

        return new ResponseEntity<>(successMessage, successStatus);
    }


    //관리자 예약 승인 기능
    @GetMapping("/admin/approval/{reservationId}")
    public ResponseEntity<String> approveReservation(@PathVariable Long reservationId, Principal principal) throws MessagingException {
        String adminId = principal.getName();

        //관리자 권한 확인
        userService.checkAdmin(adminId);

        //예약 승인
        reservationService.approveReservation(reservationId);

        String successMessage = String.format(SUCCESS_APPROVAL.getMessage(), adminId);
        HttpStatus successStatus = SUCCESS_APPROVAL.getStatus();

        return new ResponseEntity<>(successMessage, successStatus);
    }

    //관리자 예약 거절 기능
    @GetMapping("/admin/reject/{reservationId}")
    public ResponseEntity<String> rejectReservation(@PathVariable Long reservationId, Principal principal) throws MessagingException {
        String adminId = principal.getName();

        //관리자 권한 확인
        userService.checkAdmin(adminId);

        //예약 거절
        reservationService.rejectReservation(reservationId);

        String successMessage = String.format(SUCCESS_REJECTION.getMessage(), adminId);
        HttpStatus successStatus = SUCCESS_REJECTION.getStatus();

        return new ResponseEntity<>(successMessage, successStatus);
    }


    //예약 가능 확인하기 기능
    @GetMapping("/available/{buildingName}/{facilityCode}/{date}")
    public ResponseEntity<AvailabilityResponse> checkReservationAvailability(@PathVariable String buildingName, @PathVariable String facilityCode, @PathVariable String date, Principal principal){
        String userId = principal.getName();
        LocalDate parsedDate = LocalDate.parse(date);

        //예약 신청 가능 기간 검증
        DateConstraint constraint = reservationService.getAvailableDate(facilityCode, buildingName);

        //최대 예약 횟수 초과 검증
        reservationService.validateMaxReservation(facilityCode, buildingName, parsedDate, userId);

        HttpStatus successStatus = AVAILABLE_FACILITY.getStatus();
        String successMessage = AVAILABLE_FACILITY.getMessage();
        AvailabilityResponse response = new AvailabilityResponse(constraint, successMessage);

        return new ResponseEntity<>(response, successStatus);
    }

    //예약 신청 기능
    @PostMapping("/registration")
    public ResponseEntity<String> registerReservation(@RequestBody ReservationRequest reservationRequest, Principal principal){
        String userId = principal.getName();

        //예약 신청
        reservationService.registerReservation(reservationRequest, userId);

        String successMessage = String.format(SUCCESS_RESERVATION.getMessage(), userId);
        HttpStatus successStatus = SUCCESS_RESERVATION.getStatus();

        return new ResponseEntity(successMessage, successStatus);
    }

}
