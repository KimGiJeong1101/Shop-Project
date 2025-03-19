# 📌 BelleAnge (벨앙주) 프로젝트 개발 과정

> ✨ Spring Boot + React 를 활용한 반응형 웹 쇼핑몰 구현

## 📚 프로젝트 개요

**프로젝트 명**: BelleAnge (벨앙주)  
**프로젝트 기간**: 2024.03 ~ 2024.05  
**개발 목표**: 오픈소스를 활용한 반응형 웹 쇼핑몰 구현 (Spring Boot + React)  

---

## 🛠️ 개발 환경 및 기술 스택

### **환경**  
- **운영 체제**: Windows  
- **개발 도구**: VS Code, IntelliJ, HeidiSQL, Git, SourceTree, Postman  
- **버전 관리**: Git, GitHub, SourceTree  

### **프론트엔드 (Frontend)**  
- **React.js**: 컴포넌트 기반 UI 개발
- **Tailwind CSS**: 스타일링을 위한 유틸리티 퍼스트 CSS 프레임워크
- **Axios**: RESTful API 통신
- **Recoil**: 상태 관리 (전역 상태 관리)
- **Redux**: 상태 관리 (특정 데이터 관리 및 API 상태)
- **React Router**: 페이지 이동 및 라우팅 관리

### **백엔드 (Backend)**  
- **Spring Boot**: 서버 개발 및 REST API 구축
- **Spring Security**: 인증 및 권한 관리
- **JPA (Java Persistence API)**: 데이터베이스 ORM (Object-Relational Mapping)
- **MariaDB**: 데이터베이스 관리 시스템

### **개발 인원**  
- **총 개발 인원**: 6명  
  - 백엔드 개발: 3명  
  - 프론트엔드 개발: 3명

---

## ⚙️ 개발 과정

### 1. **JPA를 활용한 데이터 목록 및 연관 관계 매핑**
- **사용 기술**: JPA (`@OneToMany`, `@ManyToOne`, `@EntityGraph`)
- **기능**:
  - `@OneToMany`, `@ManyToOne` 관계를 통해 `Member`와 `Role` 간의 관계 설정
  - `@EntityGraph` 어노테이션을 사용하여 **즉시 로딩(Eager Loading)** 처리 및 효율성 개선

### 2. **Spring Security 기반 인증 & 권한 관리**
- **사용 기술**: Spring Security, JWT (JSON Web Token)
- **기능**:
  - 로그인 성공/실패 핸들러 구현
  - 로그인 성공 시 JWT 발급 및 사용자 정보 반환
  - 로그인 실패 시 예외 메시지와 응답 코드 설정
  - `@PreAuthorize` 어노테이션을 사용하여 **API 접근 권한 제어**

### 3. **React 기반 UI 개발 및 상태 관리 처리**
- **사용 기술**: React, Recoil, Axios, React Router
- **기능**:
  - `useState`, `props`를 이용해 초기 상태 관리 → **Recoil**을 사용해 전역 상태 관리 개선
  - `Axios`를 사용하여 백엔드와 RESTful API 통신
  - `React Router`로 페이지 기능별 분리 및 리다이렉션 처리

---

## 🛠️ 트러블슈팅

### **문제 1: 조건부 렌더링 및 권한별 UI 제어**
- **상황**: 사용자의 권한에 따라 UI를 동적으로 변경해야 하는 상황 발생
- **해결 방법**:
  - `&&` 연산자와 삼항 연산자를 활용하여 권한 및 상태에 따라 동적 렌더링 처리
  - **JWT 토큰**을 기반으로 한 API 요청 및 권한 제어 구현
- **결과**: 각 권한에 맞는 UI가 동적으로 렌더링되도록 해결

### **문제 2: API 주소 관리 및 환경 설정 개선**
- **상황**: API 주소가 하드코딩되어 있어, 네트워크 환경 변경 시 매번 수정이 필요하고 오류가 발생함
- **해결 방법**:
  - API 주소를 별도의 변수로 관리하여 환경에 맞게 한 번만 수정하면 되도록 설정
  - 네트워크 환경 변경 시 해당 변수만 수정하여 일관된 API 요청 가능
- **결과**: 효율적인 API 관리와 환경 설정 변경 가능

---


