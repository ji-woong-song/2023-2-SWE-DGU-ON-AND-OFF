package backend.spectrum.dguonoff.security.auth.jwt;

import backend.spectrum.dguonoff.global.error.Exception.JwtTokenException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// JwtTokenException 을 처리해 response 내용을 바꿔 주는 필터
@Component
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
        }
    }
}
