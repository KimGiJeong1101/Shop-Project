package com.belleange.mall.controller;

import com.belleange.mall.dto.EventDTO;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.service.EventService;
import com.belleange.mall.util.CustomProductFileUtil;
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
@RequiredArgsConstructor //final필드나 @NoNull으로 표시된 필드를 매개변수로 한 생성자 자동 생성
@Log4j2
@RequestMapping("/api/event") //특정 URL 경로에 대한 요청을 처리하는 메서드에 적용 (래스 수준이나 메서드 수준에서 사용)
public class EventController {
    private final EventService eventService;
    private final CustomProductFileUtil fileUtil;

    //등록
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PostMapping("/")
    public Map<String, Long> register(EventDTO eventDTO) {
        log.info("register:" + eventDTO);

        List<MultipartFile> files = eventDTO.getFiles();

        if (files != null && !files.isEmpty()) {
            List<String> uploadFileNames = fileUtil.saveFiles(files);
            eventDTO.setUploadFileNames(uploadFileNames);
        }

        // 서비스 호출
        Long eno = eventService.register(eventDTO);

        return Map.of("result", eno);
    }


    //업로드 파일 보여주기
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){ // HTTP 요청 URL의 일부를 매개변수로 바인딩할 때 사용 (fileName)
        return fileUtil.getFile(fileName); //
    }


    //페이징 목록
    @GetMapping("/list")
    public PageResponseDTO<EventDTO>list(PageRequestDTO pageRequestDTO){
        log.info("list.........................................."+pageRequestDTO);
        return  eventService.getList(pageRequestDTO);
    }

    //조회 (상세보기)
    @GetMapping("/{eno}")
    public EventDTO read(@PathVariable(name="eno") Long eno){
        return eventService.get(eno);
    }

    //수정
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PutMapping("/{eno}")
    public Map<String, String>modify(@PathVariable(name = "eno") Long eno, EventDTO eventDTO) {
        eventDTO.setEno(eno);
        EventDTO oldEventDTO = eventService.get(eno);

        List<String> oldFileNames = oldEventDTO.getUploadFileNames();
        List<MultipartFile> files = eventDTO.getFiles();
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);
        List<String> uploadFileNames = eventDTO.getUploadFileNames();

        if (currentUploadFileNames != null && currentUploadFileNames.size() > 0) {
            uploadFileNames.addAll(currentUploadFileNames);
        }

        eventService.modify(eventDTO);

        if (oldFileNames != null && oldFileNames.size() > 0) {
            List<String> removeFiles = oldFileNames
                    .stream()
                    .filter(fileName -> uploadFileNames.indexOf(fileName) == -1).collect(Collectors.toList());

            fileUtil.deleteFiles(removeFiles);
        }
        return Map.of("RESULT", "SUCCESS");
    }

    //삭제
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @DeleteMapping("/{eno}")
    public Map<String, String> remove (@PathVariable ("eno") Long eno){
        List <String> oldFileNames = eventService.get(eno).getUploadFileNames();
        eventService.remove(eno);
        fileUtil.deleteFiles(oldFileNames);
        return Map.of("RESULT","SUCCESS");
    }
}
