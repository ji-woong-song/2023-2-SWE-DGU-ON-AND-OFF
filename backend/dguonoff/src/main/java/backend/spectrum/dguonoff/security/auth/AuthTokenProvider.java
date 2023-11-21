package backend.spectrum.dguonoff.security.auth;

import java.util.Map;
import org.springframework.security.core.Authentication;

/**
 * 인증 토큰을 발행하고
 * 인증 토큰을 받아서 authentication 객체로 변환해 주는 interface
 */
public interface AuthTokenProvider <T>{
    T createAuthToken(String id, String role, Map<String, String> claims);
    T convertAuthToken(String token);
    Authentication getAuthentication(T authToken);
}
