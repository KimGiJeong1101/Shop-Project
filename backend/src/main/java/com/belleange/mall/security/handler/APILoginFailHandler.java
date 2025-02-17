package com.belleange.mall.security.handler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class APILoginFailHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        // 로그에 로그인 실패 메시지와 예외 정보를 출력합니다.
        log.info("Login fail....." + exception);

        // Gson 객체를 생성하여 JSON 문자열로 변환할 준비를 합니다.
        Gson gson = new Gson();

        // JSON 문자열을 생성합니다. 로그인 오류 메시지를 포함합니다.
        String jsonStr = gson.toJson(Map.of("error", "ERROR_LOGIN"));

        // HTTP 응답의 Content-Type을 application/json으로 설정합니다.
        response.setContentType("application/json");

        // HTTP 응답으로 JSON 문자열을 보내기 위해 PrintWriter를 얻습니다.
        PrintWriter printWriter = response.getWriter();

        // PrintWriter를 사용하여 JSON 문자열을 HTTP 응답에 기록합니다.
        printWriter.println(jsonStr);

        // PrintWriter를 닫아서 자원을 반환합니다.
        printWriter.close();
    }

}
