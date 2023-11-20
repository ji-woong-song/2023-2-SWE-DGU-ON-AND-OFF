package backend.spectrum.dguonoff.security.auth;

import java.util.Date;
import java.util.Map;
import org.springframework.security.core.Authentication;

public interface AuthTokenProvider <T>{
    T createAuthToken(String id, String role, Map<String, String> claims, Date expiredDate);
    T convertAuthToken(String token);
    Authentication getAuthentication(T authToken);
}
