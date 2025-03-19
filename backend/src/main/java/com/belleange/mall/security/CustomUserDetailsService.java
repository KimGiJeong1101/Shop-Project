package com.belleange.mall.security;

import java.util.stream.Collectors;

import com.belleange.mall.domain.Member;
import com.belleange.mall.dto.MemberDTO;
import com.belleange.mall.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * CustomUSerDetailsService
 */

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {


    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("🔹 이메일로 사용자 검색: {}", username);


        Member member = memberRepository.getWithRoles(username);

        log.info("🔹 검색된 사용자 정보: {}", member);


        if (member == null) {
            throw new UsernameNotFoundException("Not Found"); // member에서 넘어오는 값이 없으면 예외처리
        }


        MemberDTO memberDTO = new MemberDTO( // 값을 DTO로 변환
                member.getEmail(),
                member.getPw(),
                member.getNickname(),
                member.getPhone(),
                member.getBirth(),
                member.getUseraddress(),
                member.getDetailaddress(),
                member.isSocial(),
                member.getMemberRoleList()
                        .stream()
                        .map(memberRole -> memberRole.name()).collect(Collectors.toList()));

        return memberDTO; // DTO로 반환

    }

}