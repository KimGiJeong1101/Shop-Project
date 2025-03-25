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

        // Authentication 객체에서 Principal인 MemberDTO를 추출합니다.
        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();

        // MemberDTO에서 클레임(사용자 정보)을 가져옵니다.
        Map<String, Object> claims = memberDTO.getClaims();

        // accessToken과 refreshToken을 생성합니다. accessToken은 10분, refreshToken은 24시간 유효합니다.
        String accessToken = JWTUtil.generateToken(claims, 10);
        String refreshToken = JWTUtil.generateToken(claims, 60 * 24);

        // 클레임 맵에 accessToken과 refreshToken을 추가합니다.
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // Gson 객체를 생성하여 클레임 맵을 JSON 문자열로 변환합니다.
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);

        // HTTP 응답의 Content-Type을 application/json으로 설정합니다.
        response.setContentType("application/json; charset=UTF-8");

        // HTTP 응답으로 JSON 문자열을 보내기 위해 PrintWriter를 얻습니다.
        PrintWriter printWriter = response.getWriter();

        // PrintWriter를 사용하여 JSON 문자열을 HTTP 응답에 기록합니다.
        printWriter.println(jsonStr);

        // PrintWriter를 닫아서 자원을 반환합니다.
        printWriter.close();
    }


}
