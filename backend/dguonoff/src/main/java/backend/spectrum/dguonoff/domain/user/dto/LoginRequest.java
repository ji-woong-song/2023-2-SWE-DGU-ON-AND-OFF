package backend.spectrum.dguonoff.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 로그인 요청 dto
 */
@AllArgsConstructor
@Getter
public class LoginRequest {
    private String id;
    private String password;
}
