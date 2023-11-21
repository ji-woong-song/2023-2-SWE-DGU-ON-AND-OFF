package backend.spectrum.dguonoff.domain.user.service.impl;

import backend.spectrum.dguonoff.domain.user.entity.User;
import backend.spectrum.dguonoff.domain.user.dto.AllUserResponse;
import backend.spectrum.dguonoff.domain.user.dto.LoginRequest;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.domain.user.service.UserService;
import backend.spectrum.dguonoff.security.auth.jwt.CustomPasswordAuthenticationToken;
import backend.spectrum.dguonoff.security.auth.jwt.JwtAuthToken;
import backend.spectrum.dguonoff.security.auth.jwt.JwtAuthTokenProvider;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtAuthTokenProvider tokenProvider;

    @Override
    public String login(LoginRequest dto) throws IllegalArgumentException{
        System.out.println("service login");
        CustomPasswordAuthenticationToken token = new CustomPasswordAuthenticationToken(
                dto.getId(), dto.getPassword()
        );
        System.out.println("서비스 토큰 new");
        try {
            Authentication authentication = authenticationManager.authenticate(token);
            System.out.println("매니저가 token을 authenticate");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return createToken((CustomPasswordAuthenticationToken) authentication);
        }catch (AuthenticationException e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public String createToken(CustomPasswordAuthenticationToken token) {
        Date expiredDate = Date.from(LocalDateTime.now().plusSeconds(180).atZone(ZoneId.systemDefault()).toInstant());
        Map<String, String> claims = Map.of(
                "id", token.getId().toString(),
                "name", token.getName(),
                "role", token.getRole()
        );

        JwtAuthToken jwtAuthToken = tokenProvider.createAuthToken(
                token.getPrincipal().toString(),
                token.getAuthorities().iterator().next().getAuthority(),
                claims,
                expiredDate
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
