package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.dto.LoginRequest;
import backend.spectrum.dguonoff.domain.user.dto.SignUpRequest;

public interface UserAuthService {
    String login(LoginRequest dto);
    void signUp(SignUpRequest dto);
}
