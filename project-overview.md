# 📌 BelleAnge (벨앙주) 프로젝트 개발 과정

> ✨ SpringBoot + React를 활용한 반응형 웹 쇼핑몰 구현

## 📚 프로젝트 개요

**프로젝트 명**: BelleAnge (벨앙주)  
**프로젝트 기간**: 2024.03 ~ 2024.05  
**개발 목표**: 오픈소스를 활용한 반응형 웹 쇼핑몰 구현 (SpringBoot + React)

---

## 🛠️ 개발 환경 및 기술 스택

### **환경**  
- **운영 체제**: Windows  
- **개발 도구**: VS Code, IntelliJ, HeidiSQL, Git, SourceTree, Postman  
- **버전 관리**: Git, GitHub, SourceTree  

### **프론트엔드 (Frontend)**  
- **React**, **TailwindCSS**, **Axios**, **Recoil**, **Redux**, **React Router**
- **기능**: UI 컴포넌트 개발, API 요청 처리, 상태 관리 등

### **백엔드 (Backend)**  
- **Java**, **Spring Boot**, **REST API**, **Spring Security**, **JPA**
- **데이터베이스**: MariaDB
- **개발 인원**: 6명

---

## ⚙️ 개발 과정

### 1. **JPA를 활용한 데이터 목록 및 연관 관계 매핑**
- **사용 기술**: JPA (@OneToMany, @ManyToOne, @EntityGraph)
- **기능**:
  - @OneToMany, @ManyToOne을 활용하여 `Member`와 `Role` 간의 관계 설정
  - `@EntityGraph` 어노테이션을 사용하여 즉시 로딩(Eager Loading) 처리 효율성 개선

### 2. **Spring Security 기반 인증 & 권한 관리**
- **기능**:
  - 로그인 성공/실패 핸들러 구현
  - 로그인 성공 시: JWT 발급 및 사용자 정보 전송
  - 로그인 실패 시: 예외 메시지 처리 및 응답 코드 설정
  - `@PreAuthorize` 어노테이션을 활용하여 API 접근 권한 제어

### 3. **API 주소 관리 및 환경 설정 개선**
- **문제**: API 주소를 하드코딩하여, 환경 변경 시 코드 일부를 수정해야 해서 오류가 발생함
- **해결**: API 주소를 별도의 변수로 관리
- **결과**: 네트워크 환경이 변경될 때, 해당 변수만 수정하면 일관된 API 요청이 가능

### 4. **React 기반 UI 개발 및 상태 관리 처리**
- **해결 방법**:
  - 초기 상태 관리는 `useState`와 `props`로 처리했으나, 상태가 복잡해지면서 **Recoil**을 활용하여 전역 상태 관리 개선
  - **Axios**를 활용하여 백엔드와 RESTful API 통신 구현
  - **React Router**를 사용하여 페이지를 기능별로 분리하고, 리디렉션 처리 개선

---

## 🛠️ 트러블슈팅

### **문제 1: 조건부 렌더링 및 권한별 UI 제어**
- **해결 방법**:
  - `&&` 및 삼항 연산자를 활용하여 권한 및 상황에 따라 UI를 동적으로 렌더링
  - **Axios**와 **JWT 토큰** 기반 API 요청을 결합하여 권한에 맞는 데이터 처리
