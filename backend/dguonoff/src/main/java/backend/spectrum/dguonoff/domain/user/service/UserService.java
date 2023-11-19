package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.dto.LoginRequest;
import backend.spectrum.dguonoff.domain.user.dto.LoginResponse;

public interface UserService {
    LoginResponse login(LoginRequest dto);
    AllUserResponse getAllUser();
}
