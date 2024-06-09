package com.belleange.mall.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImages {
    private String fileName; //제품사진
    private String dfileName;// 상세제품사진
    private int ord;
    public void setOrd(int ord){
        this.ord = ord;
    }
}


