package backend.spectrum.dguonoff.security.error.handler;

import backend.spectrum.dguonoff.security.error.exception.JwtTokenException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import java.util.HashMap;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// JwtTokenException 을 처리해 response 내용을 바꿔 주는 필터
@Component
@Slf4j
public class JwtExceptionFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        }catch (JwtTokenException jwtTokenException) {
            response.setContentType("application/json; charset=UTF-8");
            HashMap<String, Object> body = new HashMap<>();
            body.put("message", jwtTokenException.getMessage());
            body.put("code", jwtTokenException.getErrorCode().name());
            
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(response.getOutputStream(), body);
            response.setStatus(jwtTokenException.getErrorCode().getStatus().value());
        }catch (JwtException jwtException) {
            logger.error("[ERROR]:" + jwtException.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }
    }
}
