package backend.spectrum.dguonoff.domain.reservation.api;

import static backend.spectrum.dguonoff.global.statusCode.CommonCode.SUCCESS_APPROVAL;
import static backend.spectrum.dguonoff.global.statusCode.CommonCode.SUCCESS_REJECTION;

import backend.spectrum.dguonoff.domain.reservation.dto.ReservationInfoResponse;
import backend.spectrum.dguonoff.domain.reservation.service.ReservationService;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import java.security.Principal;
import java.util.List;
import javax.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/admin/reservation")
@RestController
@RequiredArgsConstructor
public class AdminReservationController {
    private final ReservationService reservationService;
    private final UserService userService;

    //전체 예약 목록 조회
    @GetMapping("/all")
    public ResponseEntity<List<ReservationInfoResponse>> getAllReservationInfo(Principal principal){
        String adminId = principal.getName();

        //관리자 권한 확인
        userService.checkAdmin(adminId);

        List<ReservationInfoResponse> reservationInfoList = reservationService.getAllReservationInfoList();

        return new ResponseEntity<>(reservationInfoList, HttpStatus.OK);
    }

    // 특정 유저의 예약 목록 조회 기능
    @GetMapping("/{userId}")
    public ResponseEntity<List<ReservationInfoResponse>> getUserReservationInfo(@PathVariable String userId, Principal principal){
        String adminId = principal.getName();

        //관리자 권한 확인
        userService.checkAdmin(adminId);

        List<ReservationInfoResponse> reservationInfoList = reservationService.getReservationInfoList(userId);

        return new ResponseEntity<>(reservationInfoList, HttpStatus.OK);
    }

    //관리자 예약 승인 기능
    @GetMapping("/approval/{reservationId}")
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
    @GetMapping("/reject/{reservationId}")
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
}
