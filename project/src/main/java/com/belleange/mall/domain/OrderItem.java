package com.belleange.mall.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
@Entity
@Getter
@Setter
@Log4j2
public class OrderItem extends BaseEntity{

    @Id
    @GeneratedValue
    @Column(name = "order_item_id")
    private Long id; // 주문 항목의 고유 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_pno")
    private Product product; // 주문 항목과 연결된 제품

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order; // 주문 항목과 연결된 주문

    private int orderPrice; // 주문 가격

    private int count; // 주문 수량

    public static OrderItem createOrderProduct(Product product, int count){
        log.info("OrderItem : " + product);
        log.info("OrderItem : " + count); 
    
        if (product.getStockNumber() < count) { // 재고가 주문 수량보다 작으면
            throw new IllegalStateException("재고가 부족합니다."); // 예외를 던져서 처리
        }
    
        OrderItem orderItem = new OrderItem(); // 새 OrderItem 객체 생성
        orderItem.setProduct(product); // 제품 설정
        orderItem.setCount(count); // 수량 설정
        orderItem.setOrderPrice(product.getPrice()); // 주문 가격을 계산하여 설정
        product.removeStock(count); // 주문 수량만큼 제품의 재고를 감소
        return orderItem; // 생성된 OrderItem 객체 반환
    }
    

    public int getTotalPrice(){
        return orderPrice * count; // 주문 총 가격을 계산하여 반환
    }

    public void cancel(){
        this.getProduct().addStock(count); // 주문 취소 시, 제품의 재고를 다시 증가시킴
    }

}
