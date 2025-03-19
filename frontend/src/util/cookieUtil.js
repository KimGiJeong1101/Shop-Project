// cookieUtil.js (쿠키 관리 유틸)
import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 쿠키 저장 함수 (name: 쿠키 이름, value: 저장할 데이터, days: 유지 기간)
export const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days); // 지정한 일 수(days)만큼 쿠키 유지

  return cookies.set(name, value, { path: "/", expires: expires }); // 사이트 전체에서 접근 가능하도록 설정
};

// 쿠키 가져오기 (name: 쿠키 이름)
export const getCookie = (name) => {
  return cookies.get(name); // 해당 쿠키의 값을 반환
};

// 쿠키 삭제 (name: 쿠키 이름, path: 삭제할 경로, 기본값은 "/")
export const removeCookie = (name, path = "/") => {
  cookies.remove(name, { path }); // 해당 쿠키 삭제
};
