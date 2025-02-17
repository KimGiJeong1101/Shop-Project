package com.belleange.mall.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class CartItemListDTO {
    private Long cino;
    private int count;
    private Long pno;
    private String pname;
    private int price;
    private String imageFile;

    public CartItemListDTO(Long cino, int count, Long pno, String pname, int price, String imageFile){
        this.cino = cino;
        this.count = count;
        this.pno = pno;
        this.pname = pname;
        this.price = price;
        this.imageFile = imageFile;
    }
}
