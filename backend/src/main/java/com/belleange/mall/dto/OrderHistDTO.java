package com.belleange.mall.dto;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.belleange.mall.domain.Order;
import com.belleange.mall.domain.OrderStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderHistDTO {
    
    public OrderHistDTO(Order order){
        this.orderId = order.getId();
        this.orderDate = order.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        this.orderStatus = order.getOrderStatus();
        this.dname = order.getDname();
        this.deliveryAddress = order.getDeliveryAddress();
        this.detailAddress = order.getDetailAddress();
        this.tel = order.getTel();
        this.dmemo = order.getDmemo();
        this.totalOrderPrice = order.getTotalOrderPrice();
        
    }

    private Long orderId; //주문 아이디
    private String orderDate; //주문 날짜
    private OrderStatus orderStatus; //주문 상태
    
    private String dname;
    private String deliveryAddress;
    private String detailAddress;
    private String tel;
    private String dmemo;
    private Long totalOrderPrice;


    private List<OrderItemDTO> orderItemDtoList = new ArrayList<>();

    //주문 상품리스트
    public void addOrderItemDto(OrderItemDTO orderItemDTO){
        orderItemDtoList.add(orderItemDTO);
    }
}
