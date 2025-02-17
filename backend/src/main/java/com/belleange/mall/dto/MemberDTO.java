package com.belleange.mall.dto;


import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberDTO extends User {

    private String email;

    private String pw;

    private String nickname;

    private String phone;

    private String birth;

    private String useraddress;

    private String detailaddress;

    private boolean social;

    private List<String> roleNames = new ArrayList<>();


    private boolean userExists; // 추가


    public MemberDTO(String email, String pw, String nickname, String phone, String birth, String useraddress,String detailaddress, boolean social, List<String> roleNames) {
        super(
                email, pw, roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList())); // SimpleGrantedAuthority 권한을 나타낸단다.

        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.phone = phone;
        this.birth = birth;
        this.useraddress = useraddress;
        this.detailaddress = detailaddress;
        this.social = social;
        this.roleNames = roleNames;
    }

    public Map<String, Object> getClaims() {

        Map<String, Object> dataMap = new HashMap<>();


        dataMap.put("email", email);
        dataMap.put("pw", pw);
        dataMap.put("nickname", nickname);
        dataMap.put("phone", phone);
        dataMap.put("birth", birth);
        dataMap.put("useraddress", useraddress);
        dataMap.put("detailaddress", detailaddress);
        dataMap.put("social", social);
        dataMap.put("roleNames", roleNames);

        return dataMap;
    }

}
