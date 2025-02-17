package com.belleange.mall.domain;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeImage {
    private String noticeFileName;
    private int ord;

    public void setOrd(int ord){
        this.ord = ord;
    }
}
