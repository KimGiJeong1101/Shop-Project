import axios from "axios"
import { API_SERVER_HOST } from "./todoApi"


const rest_api_key = `60bd00ca7d8c18404bdec52f670cf137` // REST API 키
const redirect_uri = `http://localhost:3000/member/kakao`

const auth_code_path = `https://kauth.kakao.com/oauth/authorize`

const access_token_url = `https://kauth.kakao.com/oauth/token`

export const getKakaoLoginLink = () => {

    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    return kakaoURL

}


export const getAccessToken = async (authCode) => {
    const headers = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };

    console.log("-------------getaccess 통과2222--------------");

    const params = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: rest_api_key,
        redirect_uri: redirect_uri,
        code: authCode
    }).toString();

    console.log("------------통과확인--------");

    try {
        const res = await axios.post(access_token_url, params, headers);
        console.log("-------------------");
        console.log(headers);
        const accessToken = res.data.access_token;
        return accessToken;
    } catch (error) {
        console.error('Error during fetching access token:', error);
        throw error;
    }
};


export const getMemberWithAccessToken = async (accessToken) => {


    console.log("----------------겟멤버윗124124----------------------" + API_SERVER_HOST)
    const res = await axios.get(`${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`)



    return res.data

}