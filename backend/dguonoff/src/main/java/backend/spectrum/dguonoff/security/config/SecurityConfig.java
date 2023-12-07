package backend.spectrum.dguonoff.security.config;

import backend.spectrum.dguonoff.dao.model.Role;
import backend.spectrum.dguonoff.security.error.handler.JwtExceptionFilter;
import backend.spectrum.dguonoff.security.auth.jwt.JwtFilter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .httpBasic().disable()
                .csrf().disable() // csrf 비활성화
                .cors().and()
                .headers().frameOptions().disable().and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // jwt로 무상태 정책
                .and()
                .authorizeRequests()
                .antMatchers(
                        "/swagger-ui/index.html#",
                        "/v3/api-docs/**",
                        "/swagger*/**",
                        "/auth/**" // // auth로 시작하는 uri,
                ).permitAll()    // swagger는 인증 필요 없음
                .antMatchers("/master/**").hasAuthority(Role.MASTER.toString()) // master api는 role master인 사용자만 허용
                .antMatchers("/api/admin/fixedSchedules").hasAnyRole(Role.ADMIN.toString(), Role.MASTER.toString()) // ADMIN 또는 MASTER만
                .antMatchers("/api/admin/board").hasAnyRole(Role.ADMIN.toString(),Role.MASTER.toString())
                .antMatchers("/api/**").authenticated() // api로 시작하는 uri에 대해서 인증 필요
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // build 되기 전에 필터 적용
                .addFilterBefore(jwtExceptionFilter, JwtFilter.class)
                .build();
    }

    /*
        CORS 정책 설정 정의 메서드
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5500"));
        configuration.setAllowedMethods(List.of("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "TRACE"));
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
