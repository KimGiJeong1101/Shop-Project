package com.belleange.mall.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "tbl_review")
@Getter
@Builder
@ToString(exclude = {"product", "member"})
@AllArgsConstructor
@NoArgsConstructor
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rno;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    private int grade;

    private String reviewContent;


    public void changeGrade(int grade) {
        this.grade = grade;
    }

    public void changeReviewContent(String reviewContent) {
        this.reviewContent = reviewContent;
    }

}