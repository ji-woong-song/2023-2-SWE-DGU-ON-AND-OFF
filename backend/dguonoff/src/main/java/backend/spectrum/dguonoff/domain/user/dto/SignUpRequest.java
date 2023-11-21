package backend.spectrum.dguonoff.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignUpRequest {
    private String id;
    private String sid;
    private String name;
    private String password;
    private String email;
}
