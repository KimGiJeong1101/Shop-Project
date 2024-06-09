package com.belleange.mall.dto;

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
public class ReviewDTO {

    private Long rno; // 리뷰 엔티티의 pk
    private String reviewContent; // 댓글
    private int grade; // 별점
    private LocalDateTime regdate,modDate; // 댓글 단 날짜와 수정날짜
    private Long pno;// 상품 pk
    private String email; // 멤버의 pk
    private String nickname; // 닉네임 보이게 할거

}
