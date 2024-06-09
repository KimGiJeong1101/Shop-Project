import axios from "axios"; // axios 모듈을 가져옵니다.
import { getCookie, setCookie } from "./cookieUtil"; // 쿠키 관련 유틸리티 함수를 가져옵니다.
import { API_SERVER_HOST } from "../api/todoApi"; // API 서버 호스트 주소를 가져옵니다.

// axios 인스턴스를 생성합니다.
const jwtAxios = axios.create();

// JWT 토큰을 갱신하는 함수입니다.
const refreshJWT =  async (accessToken, refreshToken) => {

  const host = API_SERVER_HOST

  const header = {headers: {"Authorization":`Bearer ${accessToken}`}}

  const res = await axios.get(`${host}/api/member/refresh?refreshToken=${refreshToken}`, header)

  console.log("----------------------")
  console.log(res.data)

  return res.data 
}

// 요청 전에 실행되는 함수입니다.
const beforeReq = (config) => {
    console.log("before request..........."); // 요청 전 메시지를 콘솔에 출력합니다.
    const memberInfo = getCookie("member"); // 쿠키에서 회원 정보를 가져옵니다.

    if (!memberInfo) { // 회원 정보가 없는 경우
        console.log("Member NOT FOUND"); // 회원을 찾을 수 없다는 메시지를 콘솔에 출력합니다.
        return Promise.reject({ // 프로미스를 사용하여 에러를 반환합니다.
            response: {
                data: { error: "REQUIRE_LOGIN" } // 로그인이 필요하다는 에러 메시지를 반환합니다.
            }
        });
    }
    const { accessToken } = memberInfo; // 회원 정보에서 액세스 토큰을 가져옵니다.
    config.headers.Authorization = `Bearer ${accessToken}`; // 요청 헤더에 인증 토큰을 설정합니다.

    return config; // 설정된 config를 반환합니다.
};

// 요청 실패 시 실행되는 함수입니다.
const requestFail = (err) => {
    console.log("request error.............."); // 요청 오류 메시지를 콘솔에 출력합니다.
    return Promise.reject(err); // 프로미스를 사용하여 에러를 반환합니다.
};

// 응답 전에 실행되는 함수입니다.
const beforeRes = async (res) => {
    console.log("before return response............."); // 응답 전 메시지를 콘솔에 출력합니다.
    console.log(res); // 응답 데이터를 콘솔에 출력합니다.
    const data = res.data; // 응답 데이터를 저장합니다.

    if (data && data.error === 'ERROR_ACCESS_TOKEN') { // 응답 데이터에 오류가 있는 경우
        const memberCookieValue = getCookie("member"); // 쿠키에서 회원 정보를 가져옵니다.

        const result = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken); // JWT 토큰을 갱신합니다.
        console.log("refreshJWT RESULT", result); // 갱신된 JWT 토큰 결과를 콘솔에 출력합니다.

        memberCookieValue.accessToken = result.accessToken; // 갱신된 액세스 토큰을 저장합니다.
        memberCookieValue.refreshToken = result.refreshToken; // 갱신된 리프레시 토큰을 저장합니다.

        setCookie("member", JSON.stringify(memberCookieValue), 1); // 쿠키에 회원 정보를 저장합니다.
        const originalRequest = res.config; // 원래의 요청을 저장합니다.
        originalRequest.header.Authorization = `Bearer ${result.accessToken}`; // 요청 헤더에 갱신된 인증 토큰을 설정합니다.
        return await axios(originalRequest); // 원래의 요청을 다시 보냅니다.
    }
    return res; // 응답을 반환합니다.
};

// 응답 실패 시 실행되는 함수입니다.
const responseFail = (err) => {
    console.log("response fail error ..............."); // 응답 실패 메시지를 콘솔에 출력합니다.
    return Promise.reject(err); // 프로미스를 사용하여 에러를 반환합니다.
};

// 요청 전 처리, 요청 실패 처리, 응답 전 처리, 응답 실패 처리를 적용합니다.
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios; // jwtAxios 인스턴스를 내보냅니다.
