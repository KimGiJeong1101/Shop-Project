package com.belleange.mall.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name = "board_notice")
@Getter
@ToString(exclude = "noticeImageList")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nno; // 공지사항 번호

    private String ntitle; // 제목

    private String nwriter; // 작성자

    private String ncontent; // 내용

    private boolean ndelFlag; //글 삭제여부 확인

    public void changeNdel(boolean ndelFlag) {
        this.ndelFlag = ndelFlag;
    }

    @ElementCollection
    @Builder.Default
    private List<NoticeImage> noticeImageList = new ArrayList<>();

    public void changentitle(String ntitle){
        this.ntitle = ntitle;
    }

    public void changenwriter(String nwriter){
        this.nwriter = nwriter;
    }

    public void changencontent(String ncontent){
        this.ncontent = ncontent;
    }

    public void addNimage(NoticeImage nimage){
        nimage.setOrd(this.noticeImageList.size());
        noticeImageList.add(nimage);
    }

    public void addNoticeImageString(String noticeFileName){
        NoticeImage noticeImage = NoticeImage.builder()
                .noticeFileName(noticeFileName)
                .build();
        addNimage(noticeImage);
    }

    public void nClearList(){
        this.noticeImageList.clear();
    }

}