import axios from "axios"
import { API_SERVER_HOST } from "./todoApi"
import jwtAxios from "../util/jwtUtil"

const host = `${API_SERVER_HOST}/api/member`

export const loginPost = async (loginParam) => {

    const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}
  
    const form = new FormData()
    form.append('username', loginParam.email)
    form.append('password', loginParam.pw)
  
    const res = await axios.post(`${host}/login`, form, header)
  
    return res.data
  
  }


export const joinPost = async (joinParam) => {
    try {
        const res = await axios.post(`${host}/join`, joinParam, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error during the join request:", error);
        throw error;
    }
}


export const modifyMember = async (member) => {

    const res = await jwtAxios.put(`${host}/modify`, member)
  
    return res.data
  
  }

export const getMember = async (email) => {
    try {
        // 이메일을 URL 파라미터로 포함시켜 jwtAxios.get 요청을 보냄
        const response = await jwtAxios.get(`${host}/${email}`);
        return response.data;  // 서버로부터 받은 데이터 반환
        
    } catch (error) {
        console.error('Failed to fetch member details:', error);
        
        throw error;  // 에러 처리
    }
};