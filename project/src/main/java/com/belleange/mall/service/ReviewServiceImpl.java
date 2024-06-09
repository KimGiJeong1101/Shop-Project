package com.belleange.mall.service;

import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.Product;
import com.belleange.mall.domain.Review;
import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ReviewDTO;
import com.belleange.mall.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public List<ReviewDTO> getReviewList(Long pno, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("rno").descending()
        );

        Page<Review> reviewList = reviewRepository.findByProduct(pno, pageable);
        List<ReviewDTO> reviewDTOList = reviewList.stream().map(r -> {
            Review review = r; // 리뷰
            ReviewDTO reviewDTO = entityToDto(review);

            return reviewDTO;
        }).collect(Collectors.toList());

        return reviewDTOList;

    }

    @Override
    public Long addReview(ReviewDTO reviewDTO) {
        Review review = dtoToEntity(reviewDTO);
        Review result = reviewRepository.save(review);
        log.info("3333333333333333333333333333333333" + result);

        return result.getRno();
    }

    @Override
    public ReviewDTO getReview(Long rno) {
        Optional<Review> result = reviewRepository.findById(rno);
        Review review = result.orElseThrow();
        log.info("4444444444444444444444444444444444" + result);
        ReviewDTO reviewDTO = entityToDto(review);
        log.info("5555555555555555555555555555555555" + reviewDTO.toString());
        return reviewDTO;
    }


    @Override
    public void modifyReview(ReviewDTO reviewDTO) {
        Optional<Review> result = reviewRepository.findById(reviewDTO.getRno());
        log.info("6666666666666666666666666666666666" + result);
        if (result.isPresent()) {
            Review review = result.get();
            review.changeReviewContent(reviewDTO.getReviewContent());
            review.changeGrade(reviewDTO.getGrade());
            log.info("7777777777777777777777777777777777" + review);
            reviewRepository.save(review);

//        Review review=result.orElseThrow();
//        review.changeReviewContent(review.getReviewContent());
//        review.changeGrade(review.getGrade());
//        log.info("7777777777777777777777777777777777" + review);
//        reviewRepository.save(review);
        }
    }

    @Override
    public void deleteReview(Long rno) {
        reviewRepository.deleteById(rno);
    }

    private Review dtoToEntity(ReviewDTO reviewDTO) {
        Review review = Review.builder()
                .rno(reviewDTO.getRno())
                .reviewContent(reviewDTO.getReviewContent())
                .grade(reviewDTO.getGrade())
                .member(Member.builder().email(reviewDTO.getEmail()).build())
                .product(Product.builder().pno(reviewDTO.getPno()).build())
                .build();

        return review;
    }

    private ReviewDTO entityToDto(Review review) {
        ReviewDTO reviewDTO = ReviewDTO.builder()
                .rno(review.getRno())
                .reviewContent(review.getReviewContent())
                .grade(review.getGrade())
                .email(review.getMember().getEmail())
                .nickname(review.getMember().getNickname())
                .pno(review.getProduct().getPno())
                .regdate(review.getRegDate())
                .modDate(review.getModDate())
                .build();

        return reviewDTO;
    }
}
