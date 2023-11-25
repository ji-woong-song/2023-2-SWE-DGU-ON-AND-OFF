package backend.spectrum.dguonoff.security.auth.jwt;

import backend.spectrum.dguonoff.security.error.exception.JwtTokenException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import backend.spectrum.dguonoff.security.auth.AuthToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.impl.DefaultClaims;
import io.jsonwebtoken.security.SignatureException;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;

/**
 * 토큰을 만들기 위한 key 값과 만들어진 토큰을 가진 객체
 * getData로 토큰안의 데이터를 가져올 수 있다.
 */
@Slf4j
public class JwtAuthToken implements AuthToken<Claims> {
    private final String token;
    private final Key key;

    public JwtAuthToken(String token, Key key) {
        this.token = token;
        this.key = key;
    }

    public JwtAuthToken(String id, Key key, String role,
                        Map<String, String> claims, Date expiredDate) {
        this.key = key;
        this.token = createJwtToken(id, role, claims, expiredDate).get();
    }

    public String getToken() {
        return token;
    }

    @Override
    public boolean validate() throws JwtTokenException{
        return getData() != null;
    }

    @Override
    public Claims getData() {
        try{
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }catch (SignatureException e) {
            log.error("Invalid JWT signature.");
            throw new JwtTokenException(ErrorCode.JWT_INVALID_SIGNATURE);
        }catch (ExpiredJwtException e) {
            log.error("Expired JWT token.");
            throw new JwtTokenException(ErrorCode.JWT_EXPIRED);
        }catch (MalformedJwtException e) {
            log.error("Invalid JWT token.");
            throw new JwtTokenException(ErrorCode.JWT_MALFORMED);
        }catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token.");
            throw new JwtTokenException(ErrorCode.JWT_UNSUPPORTED);
        } catch (IllegalArgumentException e) {
            log.error("JWT token compact of handler are invalid.");
            throw new JwtException("JWT token compact of handler are invalid.");
        }
    }

    private Optional<String> createJwtToken(String id, String role,
                                            Map<String, String> claimsMap, Date expiredDate) {
        Claims claims = new DefaultClaims(claimsMap);
        claims.put(JwtAuthToken.AUTHORITIES_KEY, role);
        return Optional.ofNullable(Jwts.builder()
                .setSubject(id)
                .addClaims(claims)
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(expiredDate)
                .compact()
        );
    }
}
