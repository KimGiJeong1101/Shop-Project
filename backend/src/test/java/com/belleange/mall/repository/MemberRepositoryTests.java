package com.belleange.mall.repository;

import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.MemberRole;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;



@SpringBootTest
@Log4j2

public class MemberRepositoryTests {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testInsertMember() {

        for (int i = 0; i < 10; i++) {
            Member member = Member.builder()
                    .email("user" + i + "@aaa.com")
                    .pw(passwordEncoder.encode("1111")) // 패스워드 암호화 할거고, 1111 이게 진짜 비밀번호다.
                    .nickname("USER" + i)
                    .phone("0101234123" + i)
                    .birth("2000010" + i)
                    .useraddress("서울대입구역")
                    .detailaddress(i + "번 출구")
                    .build();

            member.addRole(MemberRole.USER);

            if (i >= 5) {
                member.addRole(MemberRole.MANAGER);
            }

            if (i >= 8) {
                member.addRole(MemberRole.ADMIN);
            }
            memberRepository.save(member);
        }
    }

    @Test
    public void testRead() {
        String email = "user9@aaa.com";

        Member member = memberRepository.getWithRoles(email);

        log.info("============" + member + "===========");
        log.info("====================================");
        log.info(member.getEmail());
        log.info("====================================");
        log.info(member.isSocial());
        log.info("====================================");
        log.info(member.getMemberRoleList());
        log.info("====================================");

        log.info("====================================");
    }
}
