package backend.spectrum.dguonoff.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * 로그인 반환 dto
 */
@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
}
