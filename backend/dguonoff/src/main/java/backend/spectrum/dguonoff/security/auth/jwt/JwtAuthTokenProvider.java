package backend.spectrum.dguonoff.security.auth.jwt;

import backend.spectrum.dguonoff.security.auth.AuthTokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

/**
 * JWT 방식의 토큰 발행과 변환을 구현한 객체
 * JwtFilter에서 요청의 JWT_TOKEN_HEADER 헤더 값을 읽어와 authentication으로 변환
 */
@Component
public class JwtAuthTokenProvider implements AuthTokenProvider<JwtAuthToken> {
    @Value("${jwt.base64.secret}")
    private String base64Secret;
    @Value("${jwt.expiration}")
    private Long expiration;
    private Key key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * @param id 사용자 id (db에서도 PK임)
     * @param role 사용자 역할 (normal, admin, master)
     * @param claims 기타 정보들
     */
    @Override
    public JwtAuthToken createAuthToken(String id, String role, Map<String, String> claims) {
        Date expiredDate = Date.from(
                LocalDateTime.now()
                        .plusSeconds(expiration)
                        .atZone(ZoneId.systemDefault())
                        .toInstant()
        );
        return new JwtAuthToken(id, key, role, claims, expiredDate);
    }

    /**
     * @param token 토큰 문자열 그 자체
     * @return 이 토큰을 원하는 데이터로 바꿀 수 있는 객체를 반환
     */
    @Override
    public JwtAuthToken convertAuthToken(String token) {
        return new JwtAuthToken(token, key);
    }

    /**
     * @param authToken convertAuthToken으로 문자열에서 변환된 객체
     * @return Spring Security의 인증 객체...
     */
    @Override
    public Authentication getAuthentication(JwtAuthToken authToken) {
        if (authToken.validate()) {
            Claims claims = authToken.getData();
            Collection<? extends GrantedAuthority> authorities = Collections.singleton(
                    new SimpleGrantedAuthority(claims.get(JwtAuthToken.AUTHORITIES_KEY, String.class))
            );
            User principal = new User(claims.getSubject(), "", authorities);
            return new UsernamePasswordAuthenticationToken(principal, authToken, authorities);
        }else
            throw new JwtException("JWT 토큰이 적절하지 않습니다.");
    }
}
