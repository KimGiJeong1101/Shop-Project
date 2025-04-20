package com.belleange.mall.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Log4j2
public class JWTUtil {

  // JWT 서명에 사용되는 키 (이 키는 토큰의 서명을 검증하는 데 사용됩니다.)
  private static String key = "1234567890123456789012345678901234567890"; // 해더, 페이로드, 시그니처 중에 시그니처에 해당하는 부분

  // JWT 토큰 생성 메서드
  public static String generateToken(Map<String, Object> valueMap, int min) {

    SecretKey key = null;

    try {
      // JWT 서명에 사용할 비밀 키 생성
      key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
    } catch (Exception e) {
      // 키 생성 중 예외 발생 시 런타임 예외 처리
      throw new RuntimeException(e.getMessage());
    }

    // JWT 토큰 생성 시작
    String jwtStr = Jwts.builder()
            .setHeader(Map.of("typ","JWT")) // 헤더 설정: 토큰 타입을 JWT로 설정
            .setClaims(valueMap) // 페이로드 설정: JWT에 포함될 클레임 정보 설정
            .setIssuedAt(Date.from(ZonedDateTime.now().toInstant())) // 발행 시간 설정: 현재 시간으로 설정
            .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant())) // 만료 시간 설정: 토큰 발행 후 min분 동안 유효
            .signWith(key) // 서명 설정: 비밀 키로 토큰을 서명
            .compact(); // 최종적으로 JWT 문자열 생성

    return jwtStr; // 생성된 JWT 문자열 반환
  }

  // JWT 토큰 유효성 검사 메서드
  public static Map<String, Object> validateToken(String token) {

    Map<String, Object> claim = null;

    try {
      // JWT 서명에 사용할 비밀 키 생성
      SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

      // JWT 토큰 파싱 및 유효성 검사
      claim = Jwts.parserBuilder()
              .setSigningKey(key) // 서명 키 설정
              .build()
              .parseClaimsJws(token) // 토큰 파싱 및 유효성 검증 (예외 발생 시 에러 처리)
              .getBody(); // 파싱된 토큰에서 클레임 정보 추출

    } catch (MalformedJwtException malformedJwtException) {
      // JWT 형식이 잘못된 경우 발생하는 예외 처리
      throw new CustomJWTException("MalFormed");
    } catch (ExpiredJwtException expiredJwtException) {
      // JWT 만료된 경우 발생하는 예외 처리
      throw new CustomJWTException("Expired");
    } catch (InvalidClaimException invalidClaimException) {
      // 클레임이 유효하지 않은 경우 발생하는 예외 처리
      throw new CustomJWTException("Invalid");
    } catch (JwtException jwtException) {
      // JWT 처리 중 발생하는 일반적인 예외 처리
      throw new CustomJWTException("JWTError");
    } catch (Exception e) {
      // 그 외의 예외 처리
      throw new CustomJWTException("Error");
    }

    return claim; // 유효성 검사 후 클레임 반환
  }

}
