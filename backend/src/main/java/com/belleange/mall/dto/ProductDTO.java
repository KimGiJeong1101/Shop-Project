package com.belleange.mall.dto;


import lombok.*;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long pno;//상품번호
    private String pname; //상품이름
    private int price; //가격
    private String pdesc; //상품설명
    private boolean delFlag; //상품삭제했는지 삭제깃발
    private int cno; //카테고리
    private int stockNumber;    //재고수량
    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>();
    @Builder.Default
    private List<MultipartFile> dfiles = new ArrayList<>();
    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>();
    @Builder.Default
    private List<String> uploadDfileNames = new ArrayList<>();

}