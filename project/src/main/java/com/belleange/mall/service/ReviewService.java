package com.belleange.mall.service;

import com.belleange.mall.domain.Product;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ReviewDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface ReviewService {
    
    // 리뷰 목록
    List<ReviewDTO> getReviewList(Long pno,PageRequestDTO pageRequestDTO);
    // 리뷰 작성
    Long addReview(ReviewDTO reviewDTO);
    // 리뷰 상세
    ReviewDTO getReview(Long rno);
    // 리뷰 수정
    void modifyReview(ReviewDTO reviewDTO);
    // 리뷰 삭제
    void deleteReview(Long rno);


}
