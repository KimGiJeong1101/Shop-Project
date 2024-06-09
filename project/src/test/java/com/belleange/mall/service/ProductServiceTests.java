package com.belleange.mall.service;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.belleange.mall.dto.PageRequestDTO;
import com.belleange.mall.dto.PageResponseDTO;
import com.belleange.mall.dto.ProductDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class ProductServiceTests {
    @Autowired
    ProductService productService;
    @Test
    public void testList(){
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().build();
        PageResponseDTO<ProductDTO> result = productService.getListCnoOne(pageRequestDTO);
        result.getDtoList().forEach(dto -> log.info(dto));
    }
    @Test
    public void testList2(){
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().build();
        PageResponseDTO<ProductDTO> result = productService.getListCnoSet(pageRequestDTO);
        result.getDtoList().forEach(dto -> log.info(dto));
    }
    @Test
    public void testRegister(){
        ProductDTO productDTO = ProductDTO.builder()
        .pname("새로운상품")
        .pdesc("신규상품입니다.")
        .price(1000)
        .cno(4)
        .build();

        //uuid가 있어야함
        productDTO.setUploadFileNames(
            java.util.List.of(
                UUID.randomUUID() + "_" + "TEST1.jpg",
                UUID.randomUUID() + "_" + "TEST2.jpg"));


        productDTO.setUploadDfileNames(
            java.util.List.of(
                UUID.randomUUID()+ "_" + "DTEST1.jpg",
                UUID.randomUUID()+ "_" + "DTEST2.jpg"));

                productService.register(productDTO);
    }
    @Test
    public void testRead(){
        Long pno = 22L;
        ProductDTO productDTO = productService.get(pno);
        log.info(productDTO);
        log.info(productDTO.getUploadDfileNames());
        log.info(productDTO.getUploadFileNames());
    }

}
