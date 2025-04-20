package com.belleange.mall.security.handler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import com.belleange.mall.dto.MemberDTO;
import com.belleange.mall.util.JWTUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // 로그인 성공 후, "Authentication" 객체에서 사용자 정보인 MemberDTO를 가져와
        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();

        // MemberDTO에서 사용자에 대한 클레임(정보들)을 꺼내옴.
        Map<String, Object> claims = memberDTO.getClaims();

        // accessToken과 refreshToken을 생성
        // accessToken은 10분, refreshToken은 24시간 동안 유효함
        String accessToken = JWTUtil.generateToken(claims, 10);  // accessToken (10분 유효)
        String refreshToken = JWTUtil.generateToken(claims, 60 * 24);  // refreshToken (24시간 유효)

        // 클레임에 accessToken과 refreshToken을 추가해주기
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // Gson을 이용해서 클레임 맵을 JSON 문자열로 변환
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);

        // HTTP 응답의 Content-Type을 application/json으로 설정 (프론트에 JSON을 보낼 거니까)
        response.setContentType("application/json; charset=UTF-8");

        // PrintWriter로 HTTP 응답에 JSON 데이터를 쓴다
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);

        // 다 쓴 후 자원을 반환하기 위해 PrintWriter 닫아준다
        printWriter.close();
    }
}
