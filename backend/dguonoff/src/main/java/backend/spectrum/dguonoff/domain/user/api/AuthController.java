package backend.spectrum.dguonoff.domain.user.api;

import backend.spectrum.dguonoff.domain.user.dto.LoginRequest;
import backend.spectrum.dguonoff.domain.user.dto.LoginResponse;
import backend.spectrum.dguonoff.domain.user.dto.SignUpRequest;
import backend.spectrum.dguonoff.security.service.UserAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * 로그인, 회원가입등 인증관련 api
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final UserAuthService userAuthService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest) {
        String token = userAuthService.login(loginRequest);
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/signUp")
    public ResponseEntity signUp(@RequestBody SignUpRequest signUpRequest) {
        userAuthService.signUp(signUpRequest);
        return ResponseEntity.ok("SUCCESS");
    }
}
