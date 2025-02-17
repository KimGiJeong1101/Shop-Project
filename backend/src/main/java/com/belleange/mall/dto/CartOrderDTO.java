package com.belleange.mall.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartOrderDTO {
    private Long cino;
    private List<CartOrderDTO> cartOrderDTOList;

    
    private String dname;
    private String deliveryAddress;
    private String detailAddress;
    private String tel;
    private String dmemo;
    private Long totalOrderPrice;
    private String paymentKey;
}
