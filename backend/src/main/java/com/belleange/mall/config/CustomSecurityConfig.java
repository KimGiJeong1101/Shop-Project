package com.belleange.mall.config;


import java.util.Arrays;

import com.belleange.mall.security.filter.JWTCheckFilter;
import com.belleange.mall.security.handler.APILoginFailHandler;
import com.belleange.mall.security.handler.APILoginSuccessHandler;
import com.belleange.mall.security.handler.CustomAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
// Bean 사용하려면 있어야함 (사실 @EnableMethodSecurity 이것만 있어도 시큐리티 설정이 가능하지만, Bean을 사용해야 하기 때문에 @EnableMethodSecurity 이것만 쓰는 경우는 드물다.)
@Log4j2
@RequiredArgsConstructor
@EnableMethodSecurity // 보안 설정 활성화를 위함이다 (시큐리티에서 실질적으로 중요함.)


@EnableGlobalMethodSecurity(prePostEnabled = true) // 권한별 보안을 설정해줄수 있게 해주는 어노테이션이다.
// @EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true) 이러한 문법들이 있다.
// 우리 프로젝트에선 prePostEnabled = true 이걸 사용해서, @PreAuthorize("hasAnyRole('MANAGER','ADMIN')") 이런식으로 사용한다.


public class CustomSecurityConfig {


    // 따로 보안 설정을 안해주면, 기본적으로는 전부 허용을 안해준다고 한다. 그니깐, 보안이 좋다는 얘기다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        log.info("---------------------security config---------------------------");

        // 1. CORS 설정 (가장 먼저, 외부 요청 허용할지 정함)
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // 2. 세션 설정 - 우리는 JWT 방식이라 세션 안씀!
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 3. CSRF 보안은 비활성화 (JWT 사용 시 일반적으로 disable)
        http.csrf(csrf -> csrf.disable());

        // 4. JWT 토큰 검사 필터 - 로그인 이후 요청부터 검사
        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class);

        // 5. 로그인 설정 (아이디/비번 인증용)
        http.formLogin(form -> {
            form.loginPage("/api/member/login"); // 프론트에서 보내는 로그인 요청 URL
            form.successHandler(new APILoginSuccessHandler()); // 로그인 성공 시 로직
            form.failureHandler(new APILoginFailHandler());     // 로그인 실패 시 로직
        });

        // 6. 권한/인가 실패 처리 핸들러
        http.exceptionHandling(exception -> {
            exception.accessDeniedHandler(new CustomAccessDeniedHandler());
        });

        return http.build();
    }


//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { // HTTP 보안 설정을 커스터마이징 위함. (체이닝)
//
//        log.info("---------------------security config---------------------------");
//
//        http.cors(httpSecurityCorsConfigurer -> {
//            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
//        }); // 밑에 정의해놓은 정책대로 허용할거다. 지금 이 메서드에서 사용하지 않으면 밑에 있는 내용 쓸모가없다.
//
//        http.sessionManagement(sessionConfig -> sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // 세션 허용 여부인데, .STATELESS 이건 세션 사용 안한다는 얘기다.
//
//        http.csrf(config -> config.disable()); // csrf 토큰 사용?? 비활성화.
//
//        http.formLogin(config -> { // 로그인 처리 기본적으로 POST 방식
//            // 로그인 페이지 URL을 설정 (GET 요청과 POST 요청 모두 이 URL로 전송됨)
//            // GET 요청 시 로그인 페이지를 보여주고, POST 요청 시 로그인 정보를 처리함
//            // 즉, GET은 페이지를 보여주기 위한 요청, POST는 로그인 시도를 처리하는 요청임.
//            config.loginPage("/api/member/login"); // GET 요청 시 로그인 페이지를 보여주고, POST 요청 시 로그인 로직을 처리함.
//
//            // GET 요청 시 이 설정까지 진행되고, 로그인 페이지가 브라우저에 표시됨.
//
//            // POST 요청 시 로그인 로직이 진행되고, 그 후 성공/실패 핸들러로 넘어감.
//            // 로그인 성공 시 실행될 핸들러 설정
//            config.successHandler(new APILoginSuccessHandler()); // 로그인 성공 시 APILoginSuccessHandler 실행
//
//            // 로그인 실패 시 실행될 핸들러 설정
//            config.failureHandler(new APILoginFailHandler()); // 로그인 실패 시 APILoginFailHandler 실행
//        });
//
//
//
//
//        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class); //JWT체크
//
//        http.exceptionHandling(config -> {
//            config.accessDeniedHandler(new CustomAccessDeniedHandler());
//        });
//
//
//        return http.build();
//    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() { // CORS 정책 정의.

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // 모든 경로에 대해 정책 적용
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE")); // 허용해줄 메서드
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type")); // 괄호 안에 값들 허용해줘라.
        configuration.setAllowCredentials(true); // 쿠키와 같은 인증정보들이 포함되어 전송될 수 있도록 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 프로젝트내에 CORS설정에 대한 적용인데, 이 경우엔 모든 경로에 적용이다.

        return source;
    }

    @Bean // 스프링부트에서 제공하는 암호화 메서드
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}