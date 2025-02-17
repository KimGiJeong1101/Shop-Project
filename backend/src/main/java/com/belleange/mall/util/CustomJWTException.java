package com.belleange.mall.util;

public class CustomJWTException extends RuntimeException{

    public CustomJWTException(String msg){
        super(msg);
    }
}