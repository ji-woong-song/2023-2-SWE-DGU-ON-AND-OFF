package backend.spectrum.dguonoff.domain.user.dto;

import backend.spectrum.dguonoff.DAO.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserInfoDTO {
    private final String sid;
    private final String id;
    private final String major;
    private final String email;
    private final Role role;
}
