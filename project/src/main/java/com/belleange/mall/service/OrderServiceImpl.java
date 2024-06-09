package com.belleange.mall.service;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.html.parser.Entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.jaxb.SpringDataJaxb.OrderDto;
import org.springframework.stereotype.Service;

import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.Order;
import com.belleange.mall.domain.OrderItem;
import com.belleange.mall.domain.Product;
import com.belleange.mall.domain.ProductImages;
import com.belleange.mall.dto.CartOrderDTO;
import com.belleange.mall.dto.OrderDTO;
import com.belleange.mall.dto.OrderHistDTO;
import com.belleange.mall.dto.OrderItemDTO;
import com.belleange.mall.repository.MemberRepository;
import com.belleange.mall.repository.OrderRepository;
import com.belleange.mall.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class OrderServiceImpl implements OrderService{
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private OrderRepository orderRepository;
    //우리 프로젝트에는 ProductImages 레포지토리가 없기때문에 ProductRepository를 사용

    @Override
    public Long order(OrderDTO orderDTO, String email) {
        
        Product product = productRepository.findById(orderDTO.getProductPno())
                    .orElseThrow(EntityNotFoundException::new);

        Member member = memberRepository.findByEmail(email);
        
        List<OrderItem> orderItemList = new ArrayList<>();
        log.info("여기까지도착00000");
        OrderItem orderItem = OrderItem.createOrderProduct(product, orderDTO.getCount());
        log.info("여기까지도착");
        orderItemList.add(orderItem);
        log.info("여기까지도착2");
        Order order = Order.createOrder(member, orderItemList, orderDTO);
        log.info("OrderService OrderValue : " + order.getDmemo());
        orderRepository.save(order);
        return order.getId();
    }
    @Override
    public Long orders(List<OrderDTO> orderDTOList, String email,CartOrderDTO cartOrderDTO) {
        
        log.info("====================================================");
        log.info("====================================================");
        log.info(cartOrderDTO.getDmemo());

        Member member = memberRepository.findByEmail(email);
        List<OrderItem> orderItemList = new ArrayList<>();

        for(OrderDTO orderDTO : orderDTOList){

            Product product = productRepository.findById(orderDTO.getProductPno())
                            .orElseThrow(EntityNotFoundException::new);
            OrderItem orderItem  = OrderItem.createOrderProduct(product, orderDTO.getCount());
            orderItemList.add(orderItem);
        }
        
        Order order = Order.createOrder(member, orderItemList, cartOrderDTO);
        orderRepository.save(order);

        return order.getId();
    }
    @Override
    public Page<OrderHistDTO> getOrderList(String email, Pageable pageable) {
        //파라미터로 email과 pageable를 받음
        List<Order> orders = orderRepository.findOrders(email, pageable); 
        Long totalCount = orderRepository.countOrder(email);

        List<OrderHistDTO> orderHistDTOs = new ArrayList<>();

        for(Order order : orders){
            OrderHistDTO orderHistDTO = new OrderHistDTO(order);
            List<OrderItem> orderItems = order.getOrderItems();
            for(OrderItem orderItem : orderItems){
                ProductImages productImages = productRepository.selectOrderImg(orderItem.getProduct().getPno());
                OrderItemDTO orderItemDTO = 
                                    new OrderItemDTO(orderItem, productImages.getFileName());
                orderHistDTO.addOrderItemDto(orderItemDTO);                
            }
            orderHistDTOs.add(orderHistDTO);
        }
        return new PageImpl<OrderHistDTO>(orderHistDTOs,pageable,totalCount);
    }
    @Override
    public boolean validateOrder(Long orderId, String email) {

        Member curMember = memberRepository.findByEmail(email);
        Order order = orderRepository.findById(orderId)
                        .orElseThrow(EntityNotFoundException::new);
        Member savedMember = order.getMember();

        if(!curMember.getEmail().equals(savedMember.getEmail())){
            return false;
        }
        // 주문이 유효한 경우 true를 반환합니다.
        return true;
    }
    @Override
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                    .orElseThrow(EntityNotFoundException::new);
        
        order.cancelOrder();
    }

    



}
