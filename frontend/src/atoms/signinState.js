// signinState.js (로그인 상태 관리)
import { atom } from "recoil";
import { getCookie } from "../util/cookieUtil";

// 로그인 상태의 기본값 (초기 상태)
const initState = {
  email: "",
  pw: "",
  nickname: "",
  phone: "",
  birth: "",
  useraddress: "",
  detailaddress: "",
  roleNames: [], // 사용자 역할 (ex: admin, user)
  social: false, // 소셜 로그인 여부
  accessToken: "", // 로그인 토큰
  refreshToken: "", // 리프레시 토큰
};

// 쿠키에서 로그인 정보 가져오기
const loadMemberCookie = () => {
  const memberInfo = getCookie("member"); // "member" 쿠키 값 가져오기

  // 닉네임이 있으면 URL 디코딩 (인코딩된 값이 저장될 가능성 있음)
  if (memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }

  return memberInfo; // 쿠키에 저장된 로그인 정보 반환
};

// Recoil 전역 상태 (로그인 정보 저장)
const signinState = atom({
  key: "signinState", // Recoil 상태 키 (고유해야 함)
  default: loadMemberCookie() || initState, // 쿠키에서 로그인 정보를 가져오거나 기본값 사용
});

export default signinState;