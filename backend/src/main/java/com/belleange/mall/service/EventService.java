package com.belleange.mall.service;

import com.belleange.mall.dto.EventDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ProductDTO;

public interface EventService {
    //목록 (paging 0)
    PageResponseDTO<EventDTO> getList(PageRequestDTO pageRequestDTO);

    //등록
    Long register(EventDTO eventDTO);

    //조회
    EventDTO get(Long eno);

    //수정
    void modify(EventDTO eventDTO);

    //삭제
    void remove (Long eno);
}
