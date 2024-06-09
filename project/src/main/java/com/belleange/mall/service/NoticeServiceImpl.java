package com.belleange.mall.service;
import com.belleange.mall.domain.Notice;
import com.belleange.mall.domain.NoticeImage;
import com.belleange.mall.dto.NoticeDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService{
    private final NoticeRepository noticeRepository;

    @Override
    public PageResponseDTO<NoticeDTO> nGetList(PageRequestDTO pageRequestDTO) {
        log.info("getNoticeList................");

        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("nno").descending());

        Page<Notice> noticePage = noticeRepository.findByNdelFlag(false, pageable); // ndelFlag가 false인 게시글만 가져옴

        List<NoticeDTO> dtoList = noticePage.getContent().stream().map(notice -> {
            NoticeDTO noticeDTO = new NoticeDTO();
            noticeDTO.setNno(notice.getNno());
            noticeDTO.setNtitle(notice.getNtitle());
            noticeDTO.setNwriter(notice.getNwriter());
            noticeDTO.setNcontent(notice.getNcontent());

            // 공지사항에 대응하는 이미지 가져오기
            List<NoticeImage> noticeImages = notice.getNoticeImageList();
            List<String> noticeImageFileNames = noticeImages.stream()
                    .map(NoticeImage::getNoticeFileName)
                    .collect(Collectors.toList());
            noticeDTO.setNoticeUploadFileNames(noticeImageFileNames);

            return noticeDTO;
        }).collect(Collectors.toList());

        long nTotalCount = noticePage.getTotalElements();

        return PageResponseDTO.<NoticeDTO>withAll()
                .dtoList(dtoList)
                .totalCount(nTotalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }




    @Override
    public Long nRegister(NoticeDTO noticeDTO){
        Notice notice = dtoToEntity(noticeDTO);
        log.info("======================"+notice+"=============================");
        Notice result = noticeRepository.save(notice);
        return result.getNno();
    }

    private  Notice dtoToEntity(NoticeDTO noticeDTO){
        Notice notice = Notice.builder()
                .nno(noticeDTO.getNno())
                .ntitle(noticeDTO.getNtitle())
                .nwriter(noticeDTO.getNwriter())
                .ncontent(noticeDTO.getNcontent())
                .build();
        List<String> noticeUploadFileNames = noticeDTO.getNoticeUploadFileNames();

        if(noticeUploadFileNames == null){
            return notice;
        }

        noticeUploadFileNames.stream().forEach(noticeLoadName -> {
            notice.addNoticeImageString(noticeLoadName);
        });

        return notice;
    }

    @Override
    public NoticeDTO nGet(Long nno){
        java.util.Optional<Notice> result = noticeRepository.selectOne(nno);

        Notice notice = result.orElseThrow();

        NoticeDTO noticeDTO = entityToDTO(notice);

        return noticeDTO;
    }

    private NoticeDTO entityToDTO(Notice notice){
        NoticeDTO noticeDTO = NoticeDTO.builder()
                .nno(notice.getNno())
                .ntitle(notice.getNtitle())
                .nwriter(notice.getNwriter())
                .ncontent(notice.getNcontent())
                .build();

        List<NoticeImage> noticeImageList = notice.getNoticeImageList();

        if(noticeImageList == null || noticeImageList.size() == 0 ){
            return noticeDTO;
        }

        List<String> noticeFileNameList = noticeImageList.stream().map(noticeImage ->
                noticeImage.getNoticeFileName()).toList();

        noticeDTO.setNoticeUploadFileNames(noticeFileNameList);

        return noticeDTO;
    }

    @Override
    public void nModify(NoticeDTO noticeDTO){

        //step1 read
        Optional<Notice> result = noticeRepository.findById(noticeDTO.getNno());

        Notice notice = result.orElseThrow();

        //change pname, pdesc, price
        notice.changentitle(noticeDTO.getNtitle());
        notice.changencontent(noticeDTO.getNcontent());
        notice.changenwriter(noticeDTO.getNwriter());
        //upload File -- clear first
        notice.nClearList();

        List<String> uploadFileNames = noticeDTO.getNoticeUploadFileNames();

        if(uploadFileNames != null && uploadFileNames.size() > 0 ){
            uploadFileNames.stream().forEach(uploadName -> {
                notice.addNoticeImageString(uploadName);
            });
        }
        noticeRepository.save(notice);

    }
    @Override
    public void nRemove(Long nno){
        noticeRepository.updateToDelete(nno, true);
    }


}