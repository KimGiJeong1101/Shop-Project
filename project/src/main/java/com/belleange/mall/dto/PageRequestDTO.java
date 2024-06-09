package com.belleange.mall.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder //부모 클래스의 빌더를 자식 클래스에서 상속받아 사용할 수 있도록 도와주는 기능을 제공
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
    @Builder.Default //빌더를 사용하여 객체를 생성할 때 기본값을 설정할 수 있도록 도움
    private int page=1;

    @Builder.Default
    private int size=10;
}

