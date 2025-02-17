package com.belleange.mall.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.belleange.mall.exception.OutOfStockException;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Getter
@Setter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno;          //제품번호
    private String pname;     //제품이름
    private int price;        //제품가격
    private String pdesc;    //제품설명
    private boolean delFlag; //삭제여부
    private int stockNumber;    //재고수량
    private int cno;    //카테고리 넘버


    @Enumerated(EnumType.STRING)
    private ProductSellStatus productSellStatus;
    
    @ElementCollection
    @Builder.Default
    private List<ProductImages> imageList = new ArrayList<>(); //제품이미지

    public void changePrice(int price){
        this.price = price;
    }
    public void changePname(String pname){
        this.pname = pname;
    }
    public void changePdesc(String pdesc){
        this.pdesc = pdesc;
    }
    public void changeDelFlag(boolean delFlag){
        this.delFlag = delFlag;
    }
    public void changeCno(int cno){
        this.cno = cno;
    }
    public void changeStockNumber(int stockNumber){
        this.stockNumber = stockNumber;
    }
    public void addImage(ProductImages image){
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }
    public void addImageString(String filename){
        ProductImages productImage = ProductImages.builder()
                .fileName(filename)
                .build();
        addImage(productImage);
    }
    public void addImageDetail(ProductImages detailImage){
        detailImage.setOrd(this.imageList.size());
        imageList.add(detailImage);
    }
    public void addDetailImageString(String dfileName){
        ProductImages productImage = ProductImages.builder()
                .dfileName(dfileName)
                .build();
        addImageDetail(productImage);
    }
    public void clearList(){
        this.imageList.clear();
    }
    public void removeStock(int stockNumber){ //재고 줄어들때 OutOfStockException은 만들어써야됨
        int restStock = this.stockNumber - stockNumber;
        if(restStock<0){
            throw new OutOfStockException("상품의 재고가 부족 합니다. (현재 재고 수량: " + this.stockNumber + ")");
        }
        this.stockNumber = restStock;
    }
    public void addStock(int stockNumber){ //재고 증가할때
        this.stockNumber += stockNumber;
    }
}