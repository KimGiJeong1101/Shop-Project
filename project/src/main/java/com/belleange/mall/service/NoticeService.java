package com.belleange.mall.service;
import com.belleange.mall.dto.NoticeDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;

public interface NoticeService {
    PageResponseDTO<NoticeDTO> nGetList(PageRequestDTO pageRequestDTO);

    Long nRegister(NoticeDTO noticeDTO);

    NoticeDTO nGet(Long nno);

    void nModify(NoticeDTO noticeDTO);

    void nRemove(Long nno);

}