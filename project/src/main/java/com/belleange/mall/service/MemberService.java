package com.belleange.mall.service;


import com.belleange.mall.domain.Member;
import org.springframework.transaction.annotation.Transactional;

import com.belleange.mall.dto.MemberDTO;
import com.belleange.mall.dto.MemberModifyDTO;

import java.util.stream.Collectors;

@Transactional

public interface MemberService {

    String join(MemberDTO memberDTO);

    MemberDTO getKakaoMember(String accessToken);

    void modifyMember(MemberModifyDTO memberModifyDTO);


    MemberDTO get(String email);


    default MemberDTO entityToDTO(Member member) {

        MemberDTO dto = new MemberDTO(
                member.getEmail(),
                member.getPw(),
                member.getNickname(),
                member.getPhone(),
                member.getBirth(),
                member.getUseraddress(),
                member.getDetailaddress(),
                member.isSocial(),
                member.getMemberRoleList().stream().map(memberRole -> memberRole.name()).collect(Collectors.toList())
        );

        return dto;
    }

}
