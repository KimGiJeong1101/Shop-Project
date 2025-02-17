package com.belleange.mall.domain;

public enum MemberRole { // 상수로 사용하기 위해 enum 클래스를 쓴다. 왜냐면 이 클래스는 권한에 대한 규칙??을 설정하는 클래스인데, 상수가 아닌 변수라서 그 값이 막 바뀌면 권한이 뒤죽박죽 될것이다.

    USER, MANAGER, ADMIN; // DB에 저장될 때에는 상수에 대한 순서의 정수가 저장된단다.
}