package com.belleange.mall.repository;

import com.belleange.mall.domain.Event;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;


import lombok.extern.log4j.Log4j2;

import java.util.Arrays;

@SpringBootTest
@Log4j2
public class EventRepositoryTests {

    @Autowired
    EventRepository eventRepository;

    @Test
    public void testInsert() {

        for (int i = 0; i < 10; i++) {

            Event event = Event.builder()
                    .title("이벤트 " + i)
                    .content("이벤트 내용 " + i)
                    .build();

            // 이미지 파일 추가
            event.addImageString("IMAGE1.jpg");
            event.addImageString("IMAGE2.jpg");

            eventRepository.save(event);

            log.info("-------------------");
        }
    }

    @Transactional
    @Test
    public void testRead() {

        Long eno = 1L;

        Event event = eventRepository.findById(eno).orElseThrow();

        log.info("====================================================================================");
        log.info("====================================================================================");
        log.info(event); // 이벤트 출력
        log.info(event.getImageList()); // 이미지 리스트 출력
        log.info("====================================================================================");
        log.info("====================================================================================");
    }

    @Test
    public void testRead2() {

        Long eno = 1L;

        Event event = eventRepository.selectOne(eno).orElseThrow();

        log.info("====================================================================================");
        log.info("====================================================================================");
        log.info(event);
        log.info(event.getImageList());
        log.info("====================================================================================");
        log.info("====================================================================================");

    }

    @Commit
    @Transactional
    @Test
    public void testDelete() {

        Long eno = 2L;

        eventRepository.updateToDelete(eno, true);

    }

    @Test
    public void testUpdate(){

        Long eno = 10L;

        Event event = eventRepository.selectOne(eno).orElseThrow();

        event.changeTitle("수정된 이벤트 제목");
        event.changeContent("수정된 이벤트 내용");

        // 첨부파일 수정
        event.clearList();

        event.addImageString("NEWIMAGE1.jpg");
        event.addImageString("NEWIMAGE2.jpg");
        event.addImageString("NEWIMAGE3.jpg");

        eventRepository.save(event);

    }

    @Test
    @Transactional
    public void testList() {

        Pageable pageable = PageRequest.of(0, 10, Sort.by("eno").descending());

        Page<Object[]> result = eventRepository.selectList(pageable);

        log.info("====================================================================================");
        log.info("====================================================================================");
        result.getContent().forEach(arr -> log.info(Arrays.toString(arr)));
        log.info("====================================================================================");
        log.info("====================================================================================");

    }
}

