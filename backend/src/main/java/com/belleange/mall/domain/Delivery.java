package com.belleange.mall.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "order")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long delId;

    private String delAddress; 

    private String delStatus; // 배송 상태

    // 주문과의 연관 관계
    @OneToOne
    @JoinColumn(name = "orders_id") // orders 테이블의 id와 매핑
    private Order order; // orders가 아니라 order로 수정


}