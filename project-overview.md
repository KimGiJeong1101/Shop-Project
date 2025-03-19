# 📌 BelleAnge (벨앙주) 프로젝트 개발 과정

> ✨ SpringBoot + React 를 활용한 반응형 웹 쇼핑몰 구현

## 📚 프로젝트 과정

**프로젝트 명**: BelleAnge (벨앙주)  
**프로젝트 기간**: 2024.03 ~ 2024.05  
**개발목표**: 오픈소스를 활용한 반응형 웹 쇼핑몰 구현 (SpringBoot + React)  

---

## 🛠️ 개발 환경 및 기술 스택

### **환경**  
- **운영 체제**: Windows  
- **개발 도구**: VS Code, IntelliJ, HeidiSQL, Git, SourceTree, Postman  
- **버전 관리**: Git, GitHub, SourceTree  

### **프로턴트**  
- **React, tailwindcss, Axios, Recoil, Redux, React-Router**
- **버튼러 프로턴트 및 API 손정**

### **버튼러**  
- **JAVA, Spring Boot, REST API, Spring Security, JPA**
- **데이터베이스**: MariaDB
- **개발 인원**: 6명

---

## ⚙️ 개발 과정

### 1. **JPA를 활용한 데이터 목록 및 연관 관계 매핑**
- **사용 기술**: JPA (@OneToMany, @ManyToOne, @EntityGraph)
- **기능**:
  - @OneToMany, @ManyToOne을 활용하여 Member과 Role 관계 설정
  - @EntityGraph 어노테이션을 사용하여 즉시 로딩(Eager Loading) 처리 효율성 개선

### 2. **Spring Security 기반 인증 & 권한 관리**
- **해결**:
  - 로그인 성공/실패 핸들러 구현
  - 성공 시: JWT 발급 및 사용자 정보 보내기
  - 실패 시: 예외 메시지 컨테트 및 응답 코드 설정
  - @PreAuthorize 어노테이션을 활용하여 API 접근 권한 제어

### 3. **API 주소 관리 및 환경 설정 개선**
- **문제**: API 주소를 공간공간 하드코딩 해 시엘 환경 변경 시 부분적인 바꾸기로 인해 오류 발생
- **해결**: API 주소를 별도 변수로 관리
- **결과**: 네트워크 환경 변경 시, 해당 변수만 변경하여 일관된 API 요청 가능

### 4. **React 기반 UI 개발 및 상황 관리 처리**
- **해결**:
  - useState, props로 초기 상황 관리하여 복잡해지면서 Recoil을 활용하여 전역 상황 관리 개선
  - axios를 활용하여 버튼러와 RESTful API 통신 구현
  - React Router를 사용하여 페이지를 기능별로 분리, 리다이디리트 처리 개선

---

## 🛠️ 트러블슈팅

### **문제 1: 조건부 레네더링 및 권한별 UI 제어**
- **해결**:
  - &&, 삼화 엔자리트를 활용하여 권한 및 상황에 따라 UI 동적 레네더링
  - axios + JWT 토큰 기반 API 요청을 결합
