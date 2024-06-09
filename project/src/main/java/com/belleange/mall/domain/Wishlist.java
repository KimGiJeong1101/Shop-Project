package com.belleange.mall.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "member")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wno;

    @ManyToOne
    @JoinColumn(name = "member_mno")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "product_pno")
    private Product product;

}