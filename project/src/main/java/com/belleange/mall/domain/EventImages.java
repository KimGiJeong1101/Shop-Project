package com.belleange.mall.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable //하나의 엔티티 클래스가 다른 엔티티 클래스 내에 포함될 때 Embeddable을 사용하여 두 엔티티 간의 관계를 설정
//Embeddable 클래스의 인스턴스는 해당하는 엔티티의 속성으로 사용
// (엔티티 클래스의 일부 속성을 다른 엔티티에 포함할 때 사용)
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventImages {
    private String fileName;

    private  int ord;

    public void setOrd(int ord){
        this.ord=ord;
    }
}
