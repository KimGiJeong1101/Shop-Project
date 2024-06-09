package com.belleange.mall.dto;

import lombok.Data;

@Data

public class MemberModifyDTO {


    private String email;
    private String pw;
    private String nickname;
    private String phone;
    private String birth;
    private String useraddress;
    private String detailaddress;
}
