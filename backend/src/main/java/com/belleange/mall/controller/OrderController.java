package com.belleange.mall.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.belleange.mall.dto.OrderDTO;
import com.belleange.mall.dto.OrderHistDTO;
import com.belleange.mall.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
public class OrderController {
    private final OrderService orderService;

    @PostMapping(value = "/api/order")
    public @ResponseBody ResponseEntity order(@RequestBody @Valid OrderDTO orderDTO
            , BindingResult bindingResult, Principal principal){

       log.info("OrderDTO : " + orderDTO.getProductPno()+" and" + orderDTO.getCount()); 
       log.info("=======================================================================");
       log.info("Delivery Address: {}, Detail Address: {}, Memo: {}, Name: {}, Product PNO: {}, Tel: {}, Count: {}",
       orderDTO.getDeliveryAddress(), orderDTO.getDetailAddress(), orderDTO.getDmemo(),
       orderDTO.getDname(), orderDTO.getProductPno(), orderDTO.getTel(), orderDTO.getCount());
   



        if(bindingResult.hasErrors()){
            StringBuilder sb = new StringBuilder();
            List<FieldError> fieldErrors = bindingResult.getFieldErrors();

            for (FieldError fieldError : fieldErrors) {
                sb.append(fieldError.getDefaultMessage());
                log.info("바인딩 포문 통과");
            }
            return new ResponseEntity<String>(sb.toString(), HttpStatus.BAD_REQUEST);
        }

        String email = principal.getName();
        Long orderId;

        try {
            orderId = orderService.order(orderDTO, email);
        } catch(Exception e){
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<Long>(orderId, HttpStatus.OK);
    }

    @GetMapping(value = {"/api/orders","/orders/{page}"})
    @ResponseBody
    public ResponseEntity<Page<OrderHistDTO>> orderHist(@PathVariable("page") Optional<Integer> page, Principal principal){
    
        Pageable pageable = PageRequest.of(page.isPresent() ? page.get() : 0, 4);
        Page<OrderHistDTO> orderHistDTOList = orderService.getOrderList(principal.getName(), pageable);
    
        return ResponseEntity.ok().body(orderHistDTOList);
    }

    @PostMapping("/api/order/{orderId}/cancel")
    public @ResponseBody ResponseEntity cancelOrder(@PathVariable("orderId") Long orderId, Principal principal){

        if(!orderService.validateOrder(orderId, principal.getName())){
            return new ResponseEntity<String>("주문 취소를 하실수 없습니다. 관리자에게 문의해주세요",
            HttpStatus.FORBIDDEN);
        }

        orderService.cancelOrder(orderId);
        return new ResponseEntity<Long>(orderId,HttpStatus.OK);
    }
}
