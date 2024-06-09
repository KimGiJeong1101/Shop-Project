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

  // JWT 서명에 사용되는 키
  private static String key = "1234567890123456789012345678901234567890";

  // JWT 토큰 생성 메서드
  public static String generateToken(Map<String, Object> valueMap, int min) {

    SecretKey key = null;

    try{
      // 서명 키 생성
      key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
    
    }catch(Exception e){
        // 예외 발생 시 런타임 예외로 처리
        throw new RuntimeException(e.getMessage());
    }

    // JWT 토큰 생성
    String jwtStr = Jwts.builder()
            .setHeader(Map.of("typ","JWT")) // 헤더 설정
            .setClaims(valueMap) // 클레임 설정
            .setIssuedAt(Date.from(ZonedDateTime.now().toInstant())) // 토큰 발행 시간 설정
            .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant())) // 토큰 만료 시간 설정
            .signWith(key) // 서명 키 설정
            .compact(); // 최종적으로 JWT 문자열 생성

    return jwtStr;
  }

  // JWT 토큰 유효성 검사 메서드
  public static Map<String, Object> validateToken(String token) {

    Map<String, Object> claim = null;
    
    try{

      // 서명 키 생성
      SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

      // JWT 토큰 파싱 및 검증
      claim = Jwts.parserBuilder()
              .setSigningKey(key) // 서명 키 설정
              .build()
              .parseClaimsJws(token) // 파싱 및 검증, 실패 시 에러
              .getBody();
              
    }catch(MalformedJwtException malformedJwtException){
        // JWT가 유효하지 않은 경우 발생하는 예외 처리
        throw new CustomJWTException("MalFormed");
    }catch(ExpiredJwtException expiredJwtException){
        // JWT가 만료된 경우 발생하는 예외 처리
        throw new CustomJWTException("Expired");
    }catch(InvalidClaimException invalidClaimException){
        // 클레임이 유효하지 않은 경우 발생하는 예외 처리
        throw new CustomJWTException("Invalid");
    }catch(JwtException jwtException){
        // JWT 처리 과정에서 발생하는 일반적인 예외 처리
        throw new CustomJWTException("JWTError");
    }catch(Exception e){
        // 그 외의 예외 처리
        throw new CustomJWTException("Error");
    }
    return claim;
  }

}
