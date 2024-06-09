package com.belleange.mall.service;

import com.belleange.mall.dto.EventDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

@SpringBootTest
@Log4j2
public class EventServiceTests {

    @Autowired
    EventService eventService;

    @Test
    public void testList() {

        //1 page, 10 size
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().build();

        PageResponseDTO<EventDTO> result = eventService.getList(pageRequestDTO);

        result.getDtoList().forEach(dto -> log.info(dto));

    }

    @Test
    public void testRegister() {

        EventDTO eventDTO = EventDTO.builder()
                .title("새로운 이벤트")
                .content("신규 추가 이벤트입니다.")
                .build();

        //uuid가 있어야 함
        eventDTO.setUploadFileNames(
                java.util.List.of(
                        UUID.randomUUID()+"_" +"Test1.jpg",
                        UUID.randomUUID()+"_" +"Test2.jpg"));

        eventService.register(eventDTO);

    }

    @Test
    public void testRead() {

        //실제 존재하는 번호로 테스트
        Long eno = 10L;

        EventDTO eventDTO = eventService.get(eno);

        log.info(eventDTO);
        log.info(eventDTO.getUploadFileNames());

    }


}