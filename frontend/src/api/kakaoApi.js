import axios from "axios"; // HTTP 요청을 보내기 위해 axios 라이브러리를 가져옴
import { API_SERVER_HOST } from "./productApi"; // 백엔드 API 서버 주소를 가져옴
import { getCookie, setCookie } from "../util/cookieUtil"; // 쿠키 관련 유틸리티 함수
import useCustomLogin from "../hooks/useCustomLogin"; // useCustomLogin 훅을 가져옵니다.

const rest_api_key = `60bd00ca7d8c18404bdec52f670cf137`; // 카카오 REST API 키
const redirect_uri = `http://localhost:3000/member/kakao`; // 카카오 로그인 후 리디렉션될 URI
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`; // 카카오 로그인 요청 URL
const access_token_url = `https://kauth.kakao.com/oauth/token`; // 카카오에서 액세스 토큰을 받는 URL

// 카카오 로그인 페이지 링크를 생성하는 함수
export const getKakaoLoginLink = () => {
  // 카카오 로그인 페이지 URL을 구성
  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  console.log("[DEBUG] 카카오 로그인 URL 생성됨:", kakaoURL); // 생성된 로그인 URL 확인

  return kakaoURL; // 완성된 카카오 로그인 URL 반환
};

// 액세스 토큰을 이용해 백엔드에서 카카오 회원 정보를 가져오는 함수
export const getMemberWithAccessToken = async (accessToken) => {
  try {
    // 백엔드에서 회원 정보 요청
    const res = await axios.get(
      `${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`
    );

    const memberInfo = res.data;
    console.log("[DEBUG] 받은 회원 정보:", memberInfo);

    // 여기서는 API 요청만 처리하고, 받은 정보를 컴포넌트에서 저장하도록 변경
    return memberInfo;
  } catch (error) {
    console.error("[ERROR] 회원 정보 요청 중 오류 발생:", error.message);
    throw error;
  }
};

// 카카오 로그인 후 받은 인증 코드(authCode)로 액세스 토큰을 요청하는 함수
export const getAccessToken = async (authCode) => {
  const headers = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: rest_api_key,
    redirect_uri: redirect_uri,
    code: authCode,
  }).toString();

  try {
    const res = await axios.post(access_token_url, params, headers);
    const accessToken = res.data.access_token;
    console.log("[DEBUG] 받은 액세스 토큰:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("[ERROR] 액세스 토큰 요청 중 오류 발생:", error.message);
    throw error;
  }
};
