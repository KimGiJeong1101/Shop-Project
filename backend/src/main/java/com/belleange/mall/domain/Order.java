package com.belleange.mall.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.belleange.mall.dto.CartOrderDTO;
import com.belleange.mall.dto.OrderDTO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity // 이 클래스가 JPA 엔티티임을 나타냄
@Table(name="orders") // 데이터베이스의 'orders' 테이블과 매핑됨
@Getter // Lombok 라이브러리의 Getter 메소드 자동 생성
@Setter // Lombok 라이브러리의 Setter 메소드 자동 생성
public class Order extends BaseEntity{

    @Id @GeneratedValue // 기본 키로 사용되며, 자동으로 값이 생성됨
    @JoinColumn(name = "order_id") // 데이터베이스의 'order_id' 컬럼과 매핑됨
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email")
    private Member member;

    private String dname;
    private String deliveryAddress;
    private String detailAddress;
    private String tel;
    private String dmemo;
    private Long totalOrderPrice;


    private LocalDateTime orderDate; // 주문일, 주문이 이루어진 날짜와 시간 정보

    @Enumerated(EnumType.STRING) // Enum 타입을 문자열로 저장
    private OrderStatus orderStatus; // 주문상태, Enum으로 관리

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, // 일대다 관계, OrderItem 엔티티와의 연결
    orphanRemoval = true, fetch = FetchType.LAZY) // 고아 객체 자동 제거, 연결된 OrderItem의 리스트
    private List<OrderItem> orderItems = new ArrayList<>(); // 주문 아이템 목록

    public void addOrderItem(OrderItem orderItem){ 
        // 주문 아이템 추가 메소드
        orderItems.add(orderItem); // 주문 목록에 주문 아이템을 추가
        orderItem.setOrder(this); // 현재 주문을 주문 아이템의 주문으로 설정
    }
    
    public static Order createOrder(Member member, List<OrderItem> orderItemList, OrderDTO orderDTO){ 
        // 정적 메소드로, 주문 객체를 생성하고 초기화
        Order order = new Order(); // 새로운 Order 객체 생성
        order.setMember(member); // 주문 객체에 회원 설정
        order.setDname(orderDTO.getDname());
        order.setDeliveryAddress(orderDTO.getDeliveryAddress());
        order.setDetailAddress(orderDTO.getDetailAddress());
        order.setTel(orderDTO.getTel());
        order.setDmemo(orderDTO.getDmemo());
        order.setTotalOrderPrice(orderDTO.getTotalOrderPrice());


        for(OrderItem orderItem : orderItemList){ 
            // 주어진 주문 아이템 리스트를 순회
            order.addOrderItem(orderItem); // 각 주문 아이템을 주문에 추가
        }
        order.setOrderStatus(OrderStatus.ORDER); // 주문 상태를 ORDER(주문됨)로 설정
        order.setOrderDate(LocalDateTime.now()); // 주문 날짜를 현재 시간으로 설정
        return order; // 설정된 주문 객체 반환
    }
    public static Order createOrder(Member member, List<OrderItem> orderItemList,CartOrderDTO cartOrderDTO) {
        Order order = new Order();
        order.setMember(member);
        order.setDname(cartOrderDTO.getDname());
        order.setDeliveryAddress(cartOrderDTO.getDeliveryAddress());
        order.setDetailAddress(cartOrderDTO.getDetailAddress());
        order.setTel(cartOrderDTO.getTel());
        order.setDmemo(cartOrderDTO.getDmemo());
        order.setTotalOrderPrice(cartOrderDTO.getTotalOrderPrice());


        for(OrderItem orderItem : orderItemList){
            order.addOrderItem(orderItem);
        }
        order.setOrderStatus(OrderStatus.ORDER);
        order.setOrderDate(LocalDateTime.now());
        return order;
    }
    
    public int getTotalPrice(){ 
        // 주문에 포함된 모든 주문 아이템의 가격 합계를 계산
        int totalPrice = 0; // 총 가격 초기화
        for(OrderItem orderItem : orderItems){ 
            // 주문 아이템 목록을 순회
            totalPrice += orderItem.getTotalPrice(); // 각 주문 아이템의 가격을 총 가격에 더함
        }
        return totalPrice; // 계산된 총 가격 반환
    }
    
    public void cancelOrder(){ 
        // 주문 취소 메소드
        this.orderStatus = OrderStatus.CANCEL; // 주문 상태를 CANCEL(취소됨)로 변경
        for(OrderItem orderItem : orderItems){ 
            // 주문 아이템 목록을 순회
            orderItem.cancel(); // 각 주문 아이템을 취소
        }
    }




}
