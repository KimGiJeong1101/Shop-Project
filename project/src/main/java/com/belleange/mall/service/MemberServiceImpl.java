package com.belleange.mall.service;


import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.MemberRole;
import com.belleange.mall.dto.MemberDTO;
import com.belleange.mall.dto.MemberModifyDTO;
import com.belleange.mall.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;


import java.util.LinkedHashMap;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Log4j2

public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public String join(MemberDTO memberDTO) {
        Member member = dtoToEntity(memberDTO);
        log.info("==============서비스임플입니다 지나가는지 테스트중 11111111111111111111111111==========");
        Member result = memberRepository.save(member);
        log.info("==============서비스임플입니다 지나가는지 테스트중 22222222222222222==========");
        return result.getEmail();
    }

    @Override
    public MemberDTO getKakaoMember(String accessToken) {

        log.info("==================ddd===============");
        String email = getEmailFromKakaoAccessToken(accessToken);
        log.info("-------------gggggggg----------------------");
        log.info("email: " + email);

        Optional<Member> result = memberRepository.findById(email);

        if (result.isPresent()) {
            MemberDTO memberDTO = entityToDTO(result.get());
        }
        Member socialMember = makeSocialMember(email);
        memberRepository.save(socialMember);

        MemberDTO memberDTO = entityToDTO(socialMember);

        return memberDTO;
    }

    @Override
    public void modifyMember(MemberModifyDTO memberModifyDTO) {

        Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());

        Member member = result.orElseThrow();


        member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
        member.changeSocial(false);
        member.changeNickname(memberModifyDTO.getNickname());
        member.changePhone(memberModifyDTO.getPhone());
        member.changeBirth(memberModifyDTO.getBirth());
        member.changeUseraddress(memberModifyDTO.getUseraddress());
        member.changeDetailaddress(memberModifyDTO.getDetailaddress());

        memberRepository.save(member);

    }

    @Override
    public MemberDTO get(String email) {
        Member result = memberRepository.getWithRoles(email);

        MemberDTO memberDTO = entityToDTO(result);

        return memberDTO;
    }


    private String getEmailFromKakaoAccessToken(String accessToken) {

        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if (accessToken == null) {
            throw new RuntimeException("Access Token is null");
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();

        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();
        log.info("=========4444444444=======================");
        log.info("--------------uri----------------" + uriBuilder);
        log.info("-------------entity--------------" + entity);

        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toString(), HttpMethod.GET, entity, LinkedHashMap.class);

        log.info("-------------response-----------" + response);
        log.info("=========55555555555555555=======================");
        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();

        log.info("=================================");
        log.info(bodyMap);

        LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");

        log.info("kakaoAccount:" + kakaoAccount);

        return kakaoAccount.get("email");
    }


    private String makeTempPassword() {

        StringBuffer buffer = new StringBuffer();

        for (int i = 0; i < 10; i++) {
            buffer.append((char) ((int) (Math.random() * 55) + 65));
        }

        return buffer.toString();
    }

    private Member makeSocialMember(String email) {

        String tempPassword = makeTempPassword();

        log.info("=====tempPassword========" + tempPassword);

        String nickname = "소셜회원";

        Member member = Member.builder()
                .email(email)
                .pw(passwordEncoder.encode(tempPassword))
                .nickname(nickname)
                .social(true)
                .build();

        member.addRole(MemberRole.USER);

        return member;
    }

    private Member dtoToEntity(MemberDTO memberDTO) {
        Member member = Member.builder()
                .email(memberDTO.getEmail())
                .pw(passwordEncoder.encode(memberDTO.getPw()))
                .nickname(memberDTO.getNickname())
                .phone(memberDTO.getPhone())
                .birth(memberDTO.getBirth())
                .useraddress(memberDTO.getUseraddress())
                .detailaddress(memberDTO.getDetailaddress())
                .build();

        member.addRole(MemberRole.USER);

        return member;
    }


}
