package com.belleange.mall.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="board_event")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Event extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eno; //이벤트 게시글 번호
    private String title;  //이벤트글 제목
    private String content; //이벤트글 내용
    private boolean delFlag; //상품이 삭제되었는지 확인하는 역할 (soft Delete)

    @ElementCollection
    //엔티티 클래스 내에 컬렉션(예: List, Set, Map 등)을 저장할 때 사용
    @Builder.Default//빌더 패턴을 사용할 때 기본값을 설정하는 데 사용
    private List<EventImages> imageList=new ArrayList<>();


    public void changeTitle(String title){
        this.title=title;
    }

    public void changeContent(String content){
        this.content= content;
    }

    public void changeDel(boolean delFlag){
        this.delFlag=delFlag;
    }


    public void addImage(EventImages image) {

        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName){

        EventImages eventImages = EventImages.builder()
                .fileName(fileName)
                .build();
        addImage(eventImages);

    }

    public void clearList() {
        this.imageList.clear();
    }

}