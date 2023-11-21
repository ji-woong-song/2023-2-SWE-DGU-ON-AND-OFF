package backend.spectrum.dguonoff.security.auth.jwt;

import java.io.IOException;
import java.util.Optional;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Value("${jwt.header}")
    private String authHeaderName;
    @Value("${jwt.prefix}")
    private String prefix;
    private final JwtAuthTokenProvider tokenProvider;

    public JwtFilter(JwtAuthTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Optional<String> token = resolveToken(request);
        if (token.isPresent()) {
            JwtAuthToken jwtAuthToken = tokenProvider.convertAuthToken(token.get());
            if (jwtAuthToken.validate()) {
                Authentication authentication = tokenProvider.getAuthentication(jwtAuthToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }

    private Optional<String> resolveToken(HttpServletRequest request) {
        String authHeader = request.getHeader(authHeaderName);
        if (!StringUtils.hasText(authHeader))
            return Optional.empty();
        String[] str = authHeader.split(" ");
        if (str.length != 2 || !str[0].equals(prefix) || str[1].length() == 0)
            return Optional.empty();
        return Optional.of(str[1]);
    }
}
