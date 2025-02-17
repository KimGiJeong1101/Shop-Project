package com.belleange.mall.service;

import com.belleange.mall.dto.AskDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;

public interface AskService {

    Long register(AskDTO askDTO);

    AskDTO get(Long ano);

    void modify(AskDTO askDTO);

    void remove(Long ano);

    PageResponseDTO<AskDTO> askList(PageRequestDTO pageRequestDTO);

//    String PasswordCheck(AskDTO askDTO);

}
