package com.belleange.mall.repository;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;

import com.belleange.mall.domain.Product;
import com.belleange.mall.domain.ProductSellStatus;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class ProductRepositoryTests {
    @Autowired
    ProductRepository productRepository;

    @Test
    public void testInsert(){

        for(int i = 0;i<20;i++){
            Product product = Product.builder()
            .pname("상품" + i)
            .price(100*i)
            .pdesc("상품설명" + i)
            .cno(1)
            .stockNumber(10000)
            .productSellStatus(ProductSellStatus.SELL)
            .build();

            product.addImageString("IMAGE1.jpg");
            product.addImageString("IMAGE2.jpg");
            product.addDetailImageString("IMAGEDETAIL1.jpg");
            
            productRepository.save(product);
            log.info("----------------------------------------------");

        }
    }
    @Transactional
    @Test
    public void testRead(){
        Long pno = 1L;
        Optional<Product> result = productRepository.findById(pno);
        Product product = result.orElseThrow();

        log.info(product);
        log.info(product.getImageList());
    }
    @Test
    public void testRead2(){
        Long pno = 1L;
        Optional<Product> result = productRepository.selectOne(pno);
        Product product = result.orElseThrow();
        log.info(product);
    }
    @Commit
    @Transactional
    @Test
    public void testDelete(){
        Long pno = 9L;
        productRepository.updateToDelete(pno, true);
    }
    @Test
    public void testUpdate(){
        Long pno = 10L;
        Product product = productRepository.selectOne(pno).get();
        product.changePname("10번상품이에요");
        product.changePdesc("10번상품의 설명입니다. ㅎㅎ");
        product.changePrice(10000);
        product.changeCno(3);

        product.clearList();
        product.addImageString(UUID.randomUUID().toString()+"_"+"NEWIMAGE1.jpg");
        product.addImageString(UUID.randomUUID().toString()+"_"+"NEWIMAGE2.jpg");
        product.addImageString(UUID.randomUUID().toString()+"_"+"NEWIMAGE3.jpg");
        product.addDetailImageString(UUID.randomUUID().toString()+"_"+"DETAILIMAGE1.jpg");
        product.addDetailImageString(UUID.randomUUID().toString()+"_"+"DETAILIMAGE2.jpg");
        product.addDetailImageString(UUID.randomUUID().toString()+"_"+"DETAILIMAGE3.jpg");
        productRepository.save(product);
    }
      @Test
        public void testList() {

            //org.springframework.data.domain 패키지
            Pageable pageable = PageRequest.of(0, 10, Sort.by("pno").descending());
            Page<Object[]> result = productRepository.selectListcno1(pageable);
            //java.util
            result.getContent().forEach(arr -> log.info(Arrays.toString(arr)));
  }
  @Test
  public void testList2() {

      //org.springframework.data.domain 패키지
      Pageable pageable = PageRequest.of(0, 10, Sort.by("pno").descending());
      Page<Object[]> result = productRepository.selectListcno2(pageable);
      //java.util
      result.getContent().forEach(arr -> log.info(Arrays.toString(arr)));
}

  @Transactional
  @Test
  public void testListWithAll() {

    //org.springframework.data.domain 패키지
    Pageable pageable = PageRequest.of(0, 10, Sort.by("pno").descending());

    Page<Product> result = productRepository.selectListWitAll(pageable);

    //java.util
    result.getContent().forEach(product ->{

      log.info(product);
      log.info(product.getImageList());

    });

  }
}

