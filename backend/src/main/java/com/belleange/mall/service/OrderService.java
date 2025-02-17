package com.belleange.mall.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.jaxb.SpringDataJaxb.OrderDto;

import com.belleange.mall.dto.CartOrderDTO;
import com.belleange.mall.dto.OrderDTO;
import com.belleange.mall.dto.OrderHistDTO;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Transactional
public interface OrderService {
    public Long order(OrderDTO orderDTO, String email);

    public Page<OrderHistDTO> getOrderList(String email, Pageable pageable);

    public boolean validateOrder(Long orderId, String email);

    public void cancelOrder(Long orderId);

    public Long orders(List<OrderDTO> orderDTOList, String email, CartOrderDTO cartOrderDTO);

    
}
