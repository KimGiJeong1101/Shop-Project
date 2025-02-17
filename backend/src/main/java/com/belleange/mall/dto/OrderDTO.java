package com.belleange.mall.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;


@Getter
@Setter
public class OrderDTO {
    @NotNull(message = "상품 아이디는 필수 입력 값입니다.")
    private Long productPno;

    @Min(value = 1, message = "최소 주문 수량은 1개 입니다.")
    @Max(value = 999, message = "최대 주문 수량은 999개 입니다.")
    private int count;
    
    private String dname;
    private String deliveryAddress;
    private String detailAddress;
    private String tel;
    private String dmemo;
    private Long totalOrderPrice;

}
