package com.belleange.mall.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO {
    private Long nno; // 공지사항 번호
    private String ntitle; // 제목
    private String nwriter; // 작성자
    private String ncontent; // 내용
    private boolean ndelFlag;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime regDate;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime modDate;


    @Builder.Default
    private List<MultipartFile> NoticeFiles = new ArrayList<>();


    @Builder.Default
    private List<String> noticeUploadFileNames = new ArrayList<>();

}