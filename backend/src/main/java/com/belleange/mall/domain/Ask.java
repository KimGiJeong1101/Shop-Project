package com.belleange.mall.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "board_ask")
public class Ask extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) // 시퀀스 생성
    private Long ano; // 질문 게시글 번호
    private String title; // 제목
    private String text; // 내용 // 수정가능

    @Column(nullable = true, length = 4) // null 가능 => null 일때 공개글
    private String password; // 비밀번호 4자리로 있다면 비밀글, 없다면 공개글 설정
    // null 값을 위해 int 대신 Integer
    @ManyToOne(fetch = FetchType.LAZY) // 한 사람이 여러 질문
    @JoinColumn(name = "member_email")
    private Member writer;



//    @Column(columnDefinition = "integer default 0", nullable = false) // 조회수 기본값을 숫자0. null 불가
//    private int view; // 조회수를 db에서 처리 하기 위해 엔티티에 필드 생성

    public void changeText(String text){
        this.text = text;
    }

    public void changeTitle(String title){
        this.title = title;
    }
}
