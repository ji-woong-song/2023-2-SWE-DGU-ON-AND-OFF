package backend.spectrum.dguonoff.domain.user.service.impl;

import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.entity.User;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Override
    public AllUserResponse getAllUser() {
        List<String> userNameList = userRepository.findAll().stream()
                .map(User::getName).collect(Collectors.toList());
        return new AllUserResponse(userNameList);
    }
}
