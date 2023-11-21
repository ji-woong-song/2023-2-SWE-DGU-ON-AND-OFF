package backend.spectrum.dguonoff.security.auth;

import java.util.Map;
import org.springframework.security.core.Authentication;

public interface AuthTokenProvider <T>{
    T createAuthToken(String id, String role, Map<String, String> claims);
    T convertAuthToken(String token);
    Authentication getAuthentication(T authToken);
}
