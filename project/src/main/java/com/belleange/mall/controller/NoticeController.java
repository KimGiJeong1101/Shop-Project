package com.belleange.mall.controller;
import com.belleange.mall.dto.NoticeDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.service.NoticeService;
import com.belleange.mall.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/notice")
public class NoticeController {

    private final NoticeService noticeService; //NoticeService 주입
    private final CustomFileUtil fileUtil;


    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PostMapping("/")
    public Map<String, Long> noticeRegister(NoticeDTO noticeDTO) {

        log.info("rgister: " + noticeDTO);

        List<MultipartFile> files = noticeDTO.getNoticeFiles();

        List<String> noticeUploadFileNames = fileUtil.saveFiles(files);

        noticeDTO.setNoticeUploadFileNames(noticeUploadFileNames);

        log.info(noticeUploadFileNames);

        //서비스 호출
        Long nno = noticeService.nRegister(noticeDTO); //여기 나중에 서비스 때 다시 신경써@@@@@@@@@
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return Map.of("result", nno);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {

        return fileUtil.getFile(fileName);

    }

    @GetMapping("/list")
    public PageResponseDTO<NoticeDTO> list(PageRequestDTO pageRequestDTO) {

        log.info("list............." + pageRequestDTO);

        return noticeService.nGetList(pageRequestDTO);

    }

    @GetMapping("/{nno}")
    public NoticeDTO read(@PathVariable(name = "nno") Long nno) {

        return noticeService.nGet(nno);
    }


    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PutMapping("/{nno}")
    public Map<String, String> modify(@PathVariable(name = "nno") Long nno, NoticeDTO noticeDTO) {

        noticeDTO.setNno(nno);

        NoticeDTO oldNoticeDTO = noticeService.nGet(nno);

        //기존의 파일들 (데이터베이스에 존재하는 파일들 - 수정 과정에서 삭제되었을 수 있음)
        List<String> oldFileNames = oldNoticeDTO.getNoticeUploadFileNames();

        //새로 업로드 해야 하는 파일들
        List<MultipartFile> files = noticeDTO.getNoticeFiles();

        //새로 업로드되어서 만들어진 파일 이름들
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);

        //화면에서 변화 없이 계속 유지된 파일들
        List<String> uploadedFileNames = noticeDTO.getNoticeUploadFileNames();

        //유지되는 파일들  + 새로 업로드된 파일 이름들이 저장해야 하는 파일 목록이 됨
        if (currentUploadFileNames != null && currentUploadFileNames.size() > 0) {

            uploadedFileNames.addAll(currentUploadFileNames);

        }
        //수정 작업
        noticeService.nModify(noticeDTO);

        if (oldFileNames != null && oldFileNames.size() > 0) {

            //지워야 하는 파일 목록 찾기
            //예전 파일들 중에서 지워져야 하는 파일이름들
            List<String> removeFiles = oldFileNames
                    .stream()
                    .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1).collect(Collectors.toList());

            //실제 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }
        return Map.of("RESULT", "SUCCESS");
    }


    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @DeleteMapping("/{nno}")
    public Map<String, String> remove(@PathVariable("nno") Long nno) {

        //삭제해야할 파일들 알아내기
        List<String> oldFileNames = noticeService.nGet(nno).getNoticeUploadFileNames();

        noticeService.nRemove(nno);

        fileUtil.deleteFiles(oldFileNames);

        return Map.of("RESULT", "SUCCESS");

    }
}