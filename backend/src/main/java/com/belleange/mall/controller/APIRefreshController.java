package com.belleange.mall.controller;

import java.util.Map;

import com.belleange.mall.util.CustomJWTException;
import com.belleange.mall.util.JWTUtil;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController // 이 클래스가 RESTful 웹 서비스를 제공하는 컨트롤러임을 나타냅니다.
@RequiredArgsConstructor // Lombok을 사용하여 final 필드와 @NonNull 필드에 대한 생성자를 자동으로 생성합니다.
@Log4j2 // Lombok을 사용하여 로그 기능을 추가합니다.
public class APIRefreshController {

    @RequestMapping("/api/member/refresh") // "/api/member/refresh" 경로로 요청을 처리하는 메서드입니다.
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, String refreshToken) {

        if (refreshToken == null) { // refreshToken이 null이면 예외를 던집니다.
            throw new CustomJWTException("NULL_REFRASH");
        }

        if (authHeader == null || authHeader.length() < 7) { // authHeader가 null이거나 길이가 7보다 작으면 예외를 던집니다.
            throw new CustomJWTException("INVALID_STRING");
        }

        String accessToken = authHeader.substring(7); // "Bearer " 이후의 부분을 accessToken으로 추출합니다.

        // Access 토큰이 만료되지 않았다면
        if (!checkExpiredToken(accessToken)) { // checkExpiredToken 메서드를 호출하여 accessToken이 만료되지 않았는지 확인합니다.
            return Map.of("accessToken", accessToken, "refreshToken", refreshToken); // 만료되지 않았다면 그대로 반환합니다.
        }

        // Refresh토큰 검증
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken); // JWTUtil을 사용하여 refreshToken을 검증하고 클레임을 가져옵니다.

        log.info("refresh ... claims: " + claims); // 검증된 클레임(권한)을 로그로 출력합니다.

        String newAccessToken = JWTUtil.generateToken(claims, 10); // 새 Access 토큰을 생성합니다. 유효기간은 10분으로 설정합니다.

        String newRefreshToken = checkTime((Integer) claims.get("exp")) ? JWTUtil.generateToken(claims, 60 * 24) : refreshToken;
        // 만약 refreshToken의 유효기간이 1시간 미만으로 남았다면 새로운 refreshToken을 생성하고, 그렇지 않으면 기존 refreshToken을 그대로 사용합니다.

        return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken); // 새로 생성된 Access 토큰과 refreshToken을 반환합니다.
    }

    // 시간이 1시간 미만으로 남았다면 true를 반환합니다.
    private boolean checkTime(Integer exp) {

        // JWT exp를 날짜로 변환
        java.util.Date expDate = new java.util.Date((long) exp * (1000)); // exp 값을 밀리세컨드로 변환하여 날짜 객체를 생성합니다.

        // 현재 시간과의 차이 계산 - 밀리세컨즈
        long gap = expDate.getTime() - System.currentTimeMillis(); // expDate와 현재 시간 사이의 차이를 계산합니다.

        // 분단위 계산
        long leftMin = gap / (1000 * 60); // 차이를 분 단위로 계산합니다.

        // 1시간도 안남았는지..
        return leftMin < 60; // 남은 시간이 60분 미만이면 true를 반환합니다.
    }

    // 토큰이 만료되었는지 확인하는 메서드입니다.
    private boolean checkExpiredToken(String token) {

        try {
            JWTUtil.validateToken(token); // JWTUtil을 사용하여 토큰을 검증합니다.
        } catch (CustomJWTException ex) { // 예외가 발생하면
            if (ex.getMessage().equals("Expired")) { // 예외 메시지가 "Expired"인 경우
                return true; // 토큰이 만료된 것으로 간주하고 true를 반환합니다.
            }
        }
        return false; // 예외가 발생하지 않으면 토큰이 만료되지 않은 것으로 간주하고 false를 반환합니다.
    }

}
