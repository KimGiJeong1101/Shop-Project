package com.belleange.mall.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.belleange.mall.domain.Member;
import com.belleange.mall.domain.Order;
import com.belleange.mall.domain.OrderItem;
import com.belleange.mall.domain.OrderStatus;
import com.belleange.mall.domain.Product;
import com.belleange.mall.domain.ProductSellStatus;
import com.belleange.mall.dto.OrderDTO;
import com.belleange.mall.repository.MemberRepository;
import com.belleange.mall.repository.OrderRepository;
import com.belleange.mall.repository.ProductRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Transactional
@Log4j2
public class OrderServiceTests {
    
        @Autowired
        private OrderService orderService;

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        ProductRepository productRepository;

        @Autowired
        MemberRepository memberRepository;

        public Product saveProduct(){
            Product product = new Product();
            product.setPname("테스트상품");
            product.setPrice(10000);
            product.setPdesc("테스트 상품 상세 설명");
            product.setProductSellStatus(ProductSellStatus.SELL);
            product.setStockNumber(100);
            return productRepository.save(product);
        }


        public Member saveMember(){
            Member member = new Member();
            member.setEmail("user9@aaa.com");
            member.setBirth("19880729");
            member.setNickname("orderMaster");
            member.setPhone("010999911111");
            return memberRepository.save(member);
        }
        @Test
        public void findByEmail_ExistingEmail_ReturnsMember() {
        // given
        String email = "user9@aaa.com";
        Member member = new Member();
        member.setEmail(email);
        memberRepository.save(member);

        // when
        Member foundMember = memberRepository.findByEmail(email);

        // then
        assertNotNull(foundMember); // 조회된 회원이 null이 아닌지 확인
        assertEquals(email, foundMember.getEmail()); // 이메일이 일치하는지 확인
    }



        @Test
        @DisplayName("주문테스트")
        public void order(){
            Product product = saveProduct();
            Member member = saveMember();
            log.info("======================================"+member);
            log.info("==================================="+ product);

            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setCount(10);
            orderDTO.setProductPno(product.getPno());
            log.info("orderDTO================================== : " + orderDTO.getCount());
            log.info("orderDTO================================== : " + orderDTO.getProductPno());

            Long orderEmail = orderService.order(orderDTO, member.getEmail());
            Order order = orderRepository.findById(orderEmail)
            .orElseThrow(EntityNotFoundException::new);

            List<OrderItem> orderItems = order.getOrderItems();

            int totalPrice = orderDTO.getCount()*product.getPrice();

            assertEquals(totalPrice, order.getTotalPrice());
    }

    @Test
    @DisplayName("주문 취소 테스트")
    public void cancelOrder(){
        Product product = saveProduct();
        Member member = saveMember();

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setCount(10);
        orderDTO.setProductPno(product.getPno());
        Long orderId = orderService.order(orderDTO, member.getEmail());

        Order order = orderRepository.findById(orderId)
                    .orElseThrow(EntityNotFoundException::new);
        orderService.cancelOrder(orderId);

        assertEquals(OrderStatus.CANCEL, order.getOrderStatus());
        assertEquals(100, product.getStockNumber());
    }
}
