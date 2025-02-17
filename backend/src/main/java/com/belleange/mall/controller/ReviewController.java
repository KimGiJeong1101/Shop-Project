package com.belleange.mall.controller;

import com.belleange.mall.domain.Product;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ProductDTO;
import com.belleange.mall.dto.ReviewDTO;
import com.belleange.mall.service.ProductService;
import com.belleange.mall.service.ReviewService;
import com.belleange.mall.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 리스트
    @GetMapping("/list/{pno}")
    public ResponseEntity<List<ReviewDTO>> getReviewList(@PathVariable("pno") Long pno, PageRequestDTO pageRequestDTO) {
        log.info("------------------------ getReviewList ----------------------");
        List<ReviewDTO> reviewDTOList = reviewService.getReviewList(pno, pageRequestDTO);
        log.info("------------------------ 리스트 확인 ----------------------"+ reviewDTOList.toString());
        return ResponseEntity.ok(reviewDTOList);
    }

    // 리뷰 작성
    @PostMapping(value = "/add/{pno}", consumes = "application/json")
    public Map<String, Long> addReview(@RequestBody ReviewDTO reviewDTO) {
        log.info("------------------------ addReview ----------------------");
        log.info("---------------- 회원 이메일, 상품번호 확인 ------------------");
        Long rno = reviewService.addReview(reviewDTO);

        return Map.of("rno", rno);
    }

    // 리뷰 상세
    @GetMapping("/read/{rno}")
    public ReviewDTO readReview(@PathVariable("rno") Long rno) {
        log.info("---------------------- reviewRead ----------------------");
        return reviewService.getReview(rno);
    }

    // 리뷰 수정
    @PutMapping("/modify/{pno}/{rno}")
    public Map<String, String> modifyReview(@PathVariable("pno") Long pno,
                                            @RequestBody ReviewDTO reviewDTO) {
        log.info("----------------------- modifyReview ----------------------");
        reviewService.modifyReview(reviewDTO);
        log.info("---------------- 수정된 정보 ------------------" +reviewDTO.toString());
        return Map.of("result", "success");
    }
    
    // 리뷰 삭제
    @DeleteMapping("/remove/{rno}")
    public Map<String, String> deleteReview(@PathVariable(name = "rno") Long rno) {
        log.info("----------------------- reviewDelete --------------------");
        reviewService.deleteReview(rno);
        return Map.of("result", "success");
    }

}
