package backend.spectrum.dguonoff.domain.user.service.impl;

import backend.spectrum.dguonoff.domain.user.dto.SignUpRequest;
import backend.spectrum.dguonoff.domain.user.entity.User;
import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.dto.LoginRequest;
import backend.spectrum.dguonoff.domain.user.entity.enumeration.UserRole;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.domain.user.service.UserAuthService;
import backend.spectrum.dguonoff.security.auth.jwt.CustomPasswordAuthenticationToken;
import backend.spectrum.dguonoff.security.auth.jwt.JwtAuthToken;
import backend.spectrum.dguonoff.security.auth.jwt.JwtAuthTokenProvider;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAuthAuthServiceImpl implements UserAuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtAuthTokenProvider tokenProvider;

    @Override
    public String login(LoginRequest dto) throws IllegalArgumentException{
        CustomPasswordAuthenticationToken token = new CustomPasswordAuthenticationToken(
                dto.getId(), dto.getPassword()
        );
        try {
            Authentication authentication = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return createToken((CustomPasswordAuthenticationToken) authentication);
        }catch (AuthenticationException e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @Override
    public void signUp(SignUpRequest dto) throws IllegalArgumentException {
        Optional<User> optionalUser = userRepository.findById(dto.getId());
        if (optionalUser.isPresent())
            throw new IllegalArgumentException("중복된 id를 가진 유저가 있습니다.");
        User newUser = User.builder()
                .id(dto.getId())
                .name(dto.getName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .role(UserRole.NORMAL)
                .build();
        userRepository.save(newUser);
    }

    private String createToken(CustomPasswordAuthenticationToken token) {
        Map<String, String> claims = Map.of(
                "id", token.getId(),
                "name", token.getName(),
                "role", token.getRole()
        );

        JwtAuthToken jwtAuthToken = tokenProvider.createAuthToken(
                token.getPrincipal().toString(),
                token.getAuthorities().iterator().next().getAuthority(),
                claims
        );
        return jwtAuthToken.getToken();
    }

    @Override
    public AllUserResponse getAllUser() {
        List<String> userNameList = userRepository.findAll().stream()
                .map(User::getName).collect(Collectors.toList());
        return new AllUserResponse(userNameList);
    }
}
