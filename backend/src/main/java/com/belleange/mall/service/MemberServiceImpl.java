package com.belleange.mall.service;


import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.MemberRole;
import com.belleange.mall.dto.MemberDTO;
import com.belleange.mall.dto.MemberModifyDTO;
import com.belleange.mall.repository.MemberRepository;
import jakarta.servlet.http.HttpServletResponse;
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


import java.io.PrintWriter;
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

        // 우리가 지금까지 들고 다니던 DTO를 엔티티로 바꿔줄 거야!
        // dtoToEntity() 메서드를 호출하면 Member 타입으로 바뀐 값이 리턴되니까,
        // 그걸 member라는 변수에 담아놓은 거야!
        Member member = dtoToEntity(memberDTO);

        // result에 무조건 저장안하고, memberRepository.save(member); 이렇게만 선언해주어도 됨.
        // 하지만 그랬을때, 그에 맞게 return을 해줘야함. 없애던가 변경하던가
        Member result = memberRepository.save(member);
        log.info("==============서비스임플입니다 지나가는지 테스트중 22222222222222222==========");
        return result.getEmail();
    }

    @Override
    public MemberDTO getKakaoMember(String accessToken) {
        // 카카오 액세스 토큰으로 이메일을 가져옴
        String email = getEmailFromKakaoAccessToken(accessToken);

        // 해당 이메일로 기존 회원을 찾아봄
        Optional<Member> result = memberRepository.findById(email);


        if (result.isPresent()) {
            // 이미 회원이 있으면 해당 정보를 반환
            return entityToDTO(result.get());
        }

        // 기존 회원이 없으면 새로운 회원을 만들어서 저장
        Member socialMember = makeSocialMember(email);
        memberRepository.save(socialMember);


        // 새로 생성된 회원의 정보를 반환
        return entityToDTO(socialMember);
    }


    @Override
    public void modifyMember(MemberModifyDTO memberModifyDTO) {

        Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());

        Member member = result.orElseThrow();

        member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
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
        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toString(), HttpMethod.GET, entity, LinkedHashMap.class);
        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
        LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");

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


        Member member = Member.builder()
                .email(email)
                .pw(passwordEncoder.encode(tempPassword))
                .social(true)
                .build();

        member.addRole(MemberRole.USER);

        return member;
    }


    // 필수 정보가 누락된 경우 체크
    private boolean isRequiredFieldsMissing(MemberDTO memberDTO) {
        return memberDTO.getEmail() == null || memberDTO.getEmail().isEmpty() ||
                memberDTO.getRoleNames() == null || memberDTO.getRoleNames().isEmpty() ||
                memberDTO.getNickname() == null || memberDTO.getNickname().isEmpty();
    }


    private Member dtoToEntity(MemberDTO memberDTO) {
        // DTO를 Entity로 변환하는 과정
        // → Entity는 JPA가 인식할 수 있는 형태이며, DB 테이블과 직접 매핑됨
        // → 즉, DB에 저장하려면 DTO → Entity 변환이 반드시 필요함
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
