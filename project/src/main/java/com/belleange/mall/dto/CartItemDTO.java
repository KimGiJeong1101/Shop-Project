package com.belleange.mall.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    
    private String email;
    private Long pno;
    private int count;
    private Long cino;
}
