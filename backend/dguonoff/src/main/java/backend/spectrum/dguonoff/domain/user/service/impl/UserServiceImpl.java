package backend.spectrum.dguonoff.domain.user.service.impl;

import backend.spectrum.dguonoff.domain.user.entity.User;
import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.dto.LoginRequest;
import backend.spectrum.dguonoff.domain.user.dto.LoginResponse;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest dto) throws IllegalArgumentException{
        Optional<User> optionalUser = userRepository.findById(dto.getId());
        if (optionalUser.isEmpty())
            throw new IllegalArgumentException("없는 아이디입니다.");
        User user = optionalUser.get();
        if (!user.getPassword().equals(dto.getPassword()))
            throw new IllegalArgumentException("비밀번호 불일치");
        return new LoginResponse(user.getName());
    }

    @Override
    public AllUserResponse getAllUser() {
        List<String> userNameList = userRepository.findAll().stream()
                .map(User::getName).collect(Collectors.toList());
        return new AllUserResponse(userNameList);
    }
}
