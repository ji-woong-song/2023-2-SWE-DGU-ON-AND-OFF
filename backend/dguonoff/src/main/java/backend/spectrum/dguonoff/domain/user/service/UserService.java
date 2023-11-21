package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.dto.LoginRequest;

public interface UserService {
    String login(LoginRequest dto);
    AllUserResponse getAllUser();
}
