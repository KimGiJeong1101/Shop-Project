package com.belleange.mall.dto;

import com.belleange.mall.domain.OrderItem;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDTO {
    
    public OrderItemDTO(OrderItem orderItem, String uploadFileNames){
        this.pname = orderItem.getProduct().getPname();
        this.count = orderItem.getCount();
        this.orderPrice = orderItem.getOrderPrice();
        this.uploadFileNames = uploadFileNames;
    }
    private String pname; //상품명
    private int count; //주문 수량
    private int orderPrice; //주문 금액
    private String uploadFileNames; //상품 이미지 경로
}
