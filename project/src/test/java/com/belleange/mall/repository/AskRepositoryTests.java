package com.belleange.mall.repository;

import com.belleange.mall.domain.Ask;
import com.belleange.mall.domain.Member;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class AskRepositoryTests {

    @Autowired
    private AskRepository askRepository;

    @Test
    public void testInsert() {
        for (int i = 1; i <= 10; i++) {

            Member member = Member.builder().email("user" + i + "@aaa.com").build();
            String password=null;
            Ask ask = Ask.builder()
                    .title("Title..." + i)
                    .text("Content...."+i)
                    .writer(member)
                    .password(password)
                    .build();

            askRepository.save(ask);
        }
    }

}
