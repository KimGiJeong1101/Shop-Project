package com.belleange.mall.domain;


import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable // Entity가 있어야 테이블이 만들어지는데, 얘는 테이블은 만들어지고 싶은데, 난 독립적인 테이블은 싫고, 다른 테이블에 참조가 되어서 만들어 질거야 ! 느낌이다
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ReviewImage {


    private String rfileName;

    private int rord;

    public void rSetOrd(int rord) {
        this.rord = rord;
    }


}