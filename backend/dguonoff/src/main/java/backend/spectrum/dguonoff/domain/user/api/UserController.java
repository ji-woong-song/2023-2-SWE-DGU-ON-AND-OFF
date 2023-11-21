package backend.spectrum.dguonoff.domain.user.api;

import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.service.UserAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * User 정보를 찾거나 수정하는 api
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserAuthService userAuthService;

    /**
     * login 인증 여부를 Test하기 위한 메서드
     * authentication.getName()으로 유저의 id를 가져올 수 있음.
     * @param authentication
     * @return
     */
    @GetMapping("/all")
    public ResponseEntity<AllUserResponse> findAllUsers(Authentication authentication) {
        AllUserResponse allUser = userAuthService.getAllUser();
        return ResponseEntity.ok(allUser);
    }
}
