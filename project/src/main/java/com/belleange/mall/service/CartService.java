package com.belleange.mall.service;

import java.util.List;

import com.belleange.mall.dto.CartItemDTO;
import com.belleange.mall.dto.CartItemListDTO;
import com.belleange.mall.dto.CartOrderDTO;

import jakarta.transaction.Transactional;

@Transactional
public interface CartService {
    //장바구니 아이템 추가 혹은 변경
    public List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO);
    //모든 장바구니 아이템 목록
    public List<CartItemListDTO> getCartItems(String email);
    //아이템 삭제
    public List<CartItemListDTO> remove(Long cino);
    //이 장바구니의 진짜 주인이 맞는지 검증
    public boolean validateCartItem(Long cartItemCino, String email);
    // 장바구니 주문
    public Long orderCartItem(CartOrderDTO cartOrderDTO, String email);

    
}
