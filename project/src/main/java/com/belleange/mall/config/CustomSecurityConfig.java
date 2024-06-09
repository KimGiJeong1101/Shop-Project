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

@Configuration // Bean 사용하려면 있어야함
@Log4j2
@RequiredArgsConstructor
@EnableMethodSecurity // 보안 설정 활성화를 위함이다

@EnableGlobalMethodSecurity(prePostEnabled = true)


public class CustomSecurityConfig {





    // 따로 보안 설정을 안해주면, 기본적으로는 전부 허용을 안해준다고 한다. 그니깐, 보안이 좋다는 얘기다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { // HTTP 보안 설정을 커스터마이징 위함. (체이닝)

        log.info("---------------------security config---------------------------");

        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        }); // 밑에 정의해놓은 정책대로 허용할거다. 지금 이 메서드에서 사용하지 없으면 밑에 있는 내용 쓸모가없다.

        http.sessionManagement(sessionConfig -> sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // 세션 허용 여부인데, .STATELESS 이건 세션 사용 안한다는 얘기다.

        http.csrf(config -> config.disable()); // csrf 토큰 사용?? 비활성화.

        http.formLogin(config -> { // 로그인 처리 POST 방식
            config.loginPage("/api/member/login"); // 로그인페이지 (기본페이지도 제공하지만, 지정해주면 그 페이지로 간다.)
            config.successHandler(new APILoginSuccessHandler());
            config.failureHandler(new APILoginFailHandler());
        });


        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class); //JWT체크

        http.exceptionHandling(config -> {
            config.accessDeniedHandler(new CustomAccessDeniedHandler());
        });


        return http.build();
    }


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