import axios from "axios";
import { API_SERVER_HOST } from "./productApi";

import jwtAxios from "../util/jwtUtil";

const host = `${API_SERVER_HOST}/api/member`;

export const loginPost = async (loginParam) => {
  console.log("🚨 로그인 시도 - 전달된 값 확인!");
  console.log("📌 이메일:", loginParam.email);
  console.log("📌 비밀번호:", loginParam.pw);

  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("username", loginParam.email);
  form.append("password", loginParam.pw);

  // 🚀 FormData 확인 (빈 값이 있는지 확인)
  console.log("📌 로그인 요청 데이터:");
  console.log(" - 이메일:", loginParam.email);
  console.log(" - 비밀번호:", loginParam.pw ? "입력됨" : "❌ 없음");

  try {
    const res = await axios.post(`${host}/login`, form, header);

    console.log("✅ 로그인 응답:", JSON.stringify(res.data, null, 2));

    return res.data; // 로그인 성공 시 데이터 반환
  } catch (error) {
    if (error.response) {
      console.error("❌ 응답 에러:", error.response);
      alert(error.response.data.error || "로그인 중 오류가 발생했습니다.");
    } else if (error.request) {
      console.error("❌ 요청 에러:", error.request);
      alert("서버에 응답이 없습니다. 네트워크 상태를 확인해주세요.");
    } else {
      console.error("❌ 일반 에러:", error.message);
      alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
    }
    return null;
  }
};

export const joinPost = async (joinParam) => {
  try {
    const res = await axios.post(`${host}/join`, joinParam, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error during the join request:", error);
    throw error;
  }
};

export const modifyMember = async (member) => {
  const res = await jwtAxios.put(`${host}/modify`, member);

  return res.data;
};

export const getMember = async (email) => {
  try {
    // 이메일을 URL 파라미터로 포함시켜 jwtAxios.get 요청을 보냄
    const response = await jwtAxios.get(`${host}/${email}`);
    return response.data; // 서버로부터 받은 데이터 반환
  } catch (error) {
    console.error("Failed to fetch member details:", error);

    throw error; // 에러 처리
  }
};
