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

            // JWTUtil을 사용하여 access token의 유효성을 검사하고, 토큰에 포함된 클레임(claim)들을 가져옴 (JSON 형식으로)
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);

            log.info("JWT claims: " + claims);

            // 클레임에서 사용자 정보 추출 (JSON 형식을 DTO 타입으로 변환하기 위함. 아직은 변환되지 않은 상태)
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

            // 인증된 사용자 정보를 담은 토큰 만들기 (스프링 시큐리티가 이해할 수 있는 형식으로!)
            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

            // "이 사람 로그인 됐어!" 라고 시큐리티 컨텍스트에 등록해주기
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // 이제 우리 할 일 끝! 다음 필터로 넘겨주기
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