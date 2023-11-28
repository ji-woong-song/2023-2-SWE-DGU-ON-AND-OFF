package backend.spectrum.dguonoff.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 회원 가입 요청 dto
 */
@Getter
@AllArgsConstructor
public class SignUpRequest {
    private String id;
    private String sid;
    private String name;
    private String major;
    private String password;
    private String email;
}
