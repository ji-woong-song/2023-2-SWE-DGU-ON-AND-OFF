package backend.spectrum.dguonoff.domain.admin.api;

import backend.spectrum.dguonoff.domain.admin.service.ReservationHandlingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/test")
public class ReservationTestController {
    private final ReservationHandlingService service;
    /*
        이메일 전송 확인용 테스트 api
     */
    @PostMapping("/email")
    public ResponseEntity<String> postEmail(@RequestBody String email) {
        service.approveReservation(email);
        return ResponseEntity.ok("성공");
    }
}
