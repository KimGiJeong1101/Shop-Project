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
public class EventDTO {
    private Long eno; //이벤트 게시글 번호
    private String title; //이벤트 제목
    private String content; //이벤트 내용

    private boolean delFlag; //상품이 삭제되었는지 확인하는 역할 (soft Delete)

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime regdate; //작성일

    @Builder.Default
    //빌더 패턴을 사용 할 때 기본값을 설정
    //(해당 필드가 설정 되지 않았을 때의 기본값을 지정 할 수 있음, 객체를 생성 할 때 일부 필드를 설정하지 않아도 되는 편리함을 제공)
    private List<MultipartFile> Files = new ArrayList<>();

    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>();
}