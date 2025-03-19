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

        // 인증된 MemberDTO 객체 가져오기
        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();


        // 닉네임이 비어 있지 않다면, 토큰 생성 절차 진행
        Map<String, Object> claims = memberDTO.getClaims();

        // 토큰 생성
        String accessToken = JWTUtil.generateToken(claims, 10);  // 10분 유효
        String refreshToken = JWTUtil.generateToken(claims, 60 * 24);  // 24시간 유효

        log.info("✔ 엑세스토큰 및 리프레시토큰 생성 완료");
        log.debug("엑세스토큰: " + accessToken);
        log.debug("리프레시토큰: " + refreshToken);

        // 생성된 토큰을 클레임에 추가
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // 토큰들을 응답으로 보내기 전에 로깅
        log.info("✔ 응답 준비 완료 - 클레임 데이터 전송");

        // 클레임을 JSON으로 변환하여 응답에 전달
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);
        response.setContentType("application/json; charset=UTF-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();
    }


}
