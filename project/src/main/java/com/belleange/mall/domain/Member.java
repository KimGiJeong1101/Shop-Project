package com.belleange.mall.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "memberRoleList")
public class Member extends BaseEntity {

    @Id
    private String email;

    private String pw;

    private String nickname;

    private String phone;

    private String birth;

    private String useraddress;

    private String detailaddress;

    private boolean social; // 소셜로그인 여부 체크를 위한 컬럼

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    // @Enumerated(EnumType.STRING) 롤셋 정보를 DB에 숫자가 아닌 스트링으로 넣어준다고 한다.
    private List<MemberRole> memberRoleList = new ArrayList<>();

    public void addRole(MemberRole memberRole) {

        memberRoleList.add(memberRole);
    }

    public void clearRole() {
        memberRoleList.clear();
    }


    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePw(String pw) {
        this.pw = pw;
    }

    public void changeSocial(boolean social) {
        this.social = social;
    }

    public void changePhone(String phone) {
        this.phone = phone;
    }


    public void changeBirth(String birth) {
        this.birth = birth;
    }

    public void changeUseraddress(String useraddress) {
        this.useraddress = useraddress;
    }


    public void changeDetailaddress(String detailaddress) {
        this.detailaddress = detailaddress;
    }


}
