package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import org.springframework.security.core.Authentication;

public interface UserService {
    AllUserResponse getAllUser();

}
