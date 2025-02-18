package com.belleange.mall.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import com.belleange.mall.dto.MemberDTO;
import com.belleange.mall.util.JWTUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;


import com.google.gson.Gson;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        // Preflight요청은 체크하지 않음
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String path = request.getRequestURI();

        log.info("check uri.............." + path);


        // member관련 토큰 검사 안할거다///////////////////////////////////////

        if (path.startsWith("/api/member")) {
            return true;
        }

        if (path.startsWith("/api/member/")) {
            return true;
        }

        // member관련 토큰 검사 안할거다.end///////////////////////////////////////


        // Ask관련 토큰 검사 안할거다///////////////////////////////////////


        if (path.startsWith("/api/ask/list/")) {
            return true;
        }

        if (path.startsWith("/api/ask/list")) {
            return true;
        }

        if (path.matches("/api/ask/\\d+/?") && request.getMethod().equals("GET")) {
            return true;
        }

        if (path.matches("/api/ask/\\d+/?/") && request.getMethod().equals("GET")) {
            return true;
        }


        // Ask관련 토큰 검사 안할거다.end///////////////////////////////////////


        // Event관련 토큰 검사 안할거다///////////////////////////////////////


        if (path.startsWith("/api/event/view/") && request.getMethod().equals("GET")) {
            return true;
        }


        if (path.startsWith("/api/event/view") && request.getMethod().equals("GET")) {
            return true;
        }

        if (path.startsWith("/api/event/list/")) {
            return true;
        }

        if (path.startsWith("/api/event/list")) {
            return true;
        }

        if (path.matches("/api/event/\\d+/?") && request.getMethod().equals("GET")) {  // 정규식으로 숫자 매칭
            return true;
        }

        if (path.matches("/api/event/\\d+/?/") && request.getMethod().equals("GET")) {  // 정규식으로 숫자 매칭
            return true;
        }

        // Event관련 토큰 검사 안할거다.end///////////////////////////////////////


        // Product관련 토큰 검사 안할거다///////////////////////////////////////


        if (path.startsWith("/api/products/list/set")) {
            return true;
        }

        if (path.startsWith("/api/products/list/set/")) {
            return true;
        }
        if (path.startsWith("/api/products/list/all")) {
            return true;
        }

        if (path.startsWith("/api/products/list/all/")) {
            return true;
        }


        if (path.startsWith("/api/products/list/one")) {
            return true;
        }

        if (path.startsWith("/api/products/list/one/")) {
            return true;
        }

        if (path.startsWith("/api/products/view/")) {
            return true;
        }

        if (path.startsWith("/api/products/view")) {
            return true;
        }

        if (path.matches("/api/products/\\d+/?/") && request.getMethod().equals("GET")) {
            return true;
        }

        if (path.matches("/api/products/\\d+/?") && request.getMethod().equals("GET")) {
            return true;
        }


        // Product관련 토큰 검사 안할거다.end///////////////////////////////////////


        // Notice관련 토큰 검사 안할거다///////////////////////////////////////


        if (path.matches("/api/notice/\\d+/?/") && request.getMethod().equals("GET")) {
            return true;
        }

        if (path.matches("/api/notice/\\d+/?") && request.getMethod().equals("GET")) {
            return true;
        }


        if (path.startsWith("/api/notice/list/")) {
            return true;
        }

        if (path.startsWith("/api/notice/list")) {
            return true;
        }


        if (path.startsWith("/api/notice/view/")) {
            return true;
        }

        if (path.startsWith("/api/notice/view")) {
            return true;
        }


        // Notice관련 토큰 검사 안할거다.end///////////////////////////////////////


        // 검색관련 토큰 검사 안할거다///////////////////////////////////////

        if (path.startsWith("/api/search/products/")) {
            return true;
        }

        if (path.startsWith("/api/search/products")) {
            return true;
        }

        // 검색관련 토큰 검사 안할거다.end///////////////////////////////////////


        return false;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("------------------------JWTCheckFilter.......................");

        // HTTP 요청 헤더에서 Authorization 헤더 값을 가져옴
        String authHeaderStr = request.getHeader("Authorization");

        try {
            // "Bearer " 다음의 문자열을 추출하여 access token을 얻음
            String accessToken = authHeaderStr.substring(7);

            // JWTUtil을 사용하여 access token의 유효성을 검사하고, 토큰에 포함된 클레임(claim)들을 가져옴
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);

            log.info("JWT claims: " + claims);

            // 클레임에서 사용자 정보 추출
            String email = (String) claims.get("email");
            String pw = (String) claims.get("pw");
            String nickname = (String) claims.get("nickname");
            String phone = (String) claims.get("phone");
            String birth = (String) claims.get("birth");
            String useraddress = (String) claims.get("useraddress");
            String detailaddress = (String) claims.get("detailaddress");
            Boolean social = (Boolean) claims.get("social");
            List<String> roleNames = (List<String>) claims.get("roleNames");

            // 사용자 정보를 MemberDTO 객체로 변환
            MemberDTO memberDTO = new MemberDTO(email, pw, nickname, phone, birth, useraddress, detailaddress, social.booleanValue(), roleNames);

            log.info("-----------------------------------");
            log.info(memberDTO);
            log.info(memberDTO.getAuthorities());

            // Spring Security를 사용하여 인증 토큰(UsernamePasswordAuthenticationToken) 생성
            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

            // SecurityContextHolder를 사용하여 현재 사용자의 인증 정보 설정
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // 다음 필터로 요청과 응답을 전달
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // 예외 발생 시 처리
            log.error("JWT Check Error..............");
            log.error(e.getMessage());

            // 에러 메시지를 JSON 형식으로 클라이언트에게 전송
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();

        }
    }


}