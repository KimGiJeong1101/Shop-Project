//리액트에서 API호출함수는 export defailt로 보내지 않는건 이 게 컴포넌트가 아니기 때문이다 
//이건 일반적인 자바스크립트 함수이기 때문에 그냥 쓰고싶은 곳에서 import해서 쓰면 된다

// Axios를 임포트하여 HTTP 요청을 보내는 함수를 정의합니다.
import axios from "axios";

// API 서버 호스트 주소를 가져옵니다.
import { API_SERVER_HOST } from "./todoApi";
import jwtAxios from "../util/jwtUtil";

// API 서버의 엔드포인트 주소 설정
const host = `${API_SERVER_HOST}/api/notice`;

export const postAdd = async (notice) => {

    const header = { headers: { "Content-Type": "multipart/form-data" } }

    // 경로 뒤 '/' 주의 
    const res = await jwtAxios.post(`${host}/`, notice, header)

    return res.data

}

// // 제품 정보를 서버에 추가하는 함수
// export const postAdd = async (product) => { //이렇게 export 하면 외부에서 이걸 쓰게 됨 import { postAdd } from './api/productsApi';이런 식으로
//     // multipart/form-data 형식의 헤더 설정. 왜냐하면 Axios가 기본적으로 Content-Type을 application/json을 이용하기 
//     //때문에 파일 업로드를 같이 할 때는 파일전송 헤더를 직접 설정 해야 한다
//     const header = { headers: { "Content-Type": "multipart/form-data" } };

//     try {
//         // POST 요청을 보내고 응답을 기다림 postAdd가 async(비동기)쓰니가 await(비동기 함수 내에서만 사용할 수 있는 키워드로, 
//         //프로미스가 처리(resolve)될 때까지 함수의 실행을 일시 중지합니다. 이 키워드는 async 함수 안에서만 사용할 수 있습니다.)
//         //를 써서 
//         const res = await axios.post(`${host}/`, product, header);//const host로 선언한 주소가 `${host}/`로 간다
//         //product : post요청으로 보낼 데이터, header :  이 요청의 헤더 정보

//         // 응답 데이터 반환
//         return res.data;
//     } catch (error) {
//         // 에러 처리
//         console.error("Error occurred while adding product:", error);
//         throw error; // 예외 던지기
//     }
// }

//서버에서 목록 데이터를 가져오기 위한 함수 추가
export const getList = async (pageParam) => {
    const { page, size } = pageParam //구조분해 할당으로 pageParam에서 page, size를 꺼내서 각각 page, size변수에 할당한다
    //pageParam속에 page, size변수가 있으면 자동으로 상수로 선언된 {page, size}에 할당되고 없으면 이 속은 빈 값으로 할당된다
    const res = await axios.get(`${host}/list`, {//axios.get() 함수를 호출. 첫 번째 매개변수는 요청을 보낼!!! URL
        params:                  //두 번째 매개변수는 옵션 객체. 여기서는 params 속성을 사용하여 쿼리 매개변수를 설정
            { page: page, size: size } //params 객체 내부에는 서버에 전달할 쿼리 매개변수가 포함. 쿼리 매개변수를 설정
    })
    return res.data //윗쪽의 await 키워드 때문에 비동기함수를 동기함수 처럼 변화 시켜서 axios.get()요청이 완료되면
    //반환된 응답을 res 변수에 저장 @@@@ await - 비동기의 동기화
}

export const getOne = async (nno) => {
    const res = await axios.get(`${host}/${nno}`)
    return res.data
}


export const putOne = async (nno, notice) => { // (pno, notice) 이건 단지 파라미터 2개를 받는다는 말
    const header = { headers: { "Content-Type": "multipart/form-data" } }
    const res = await jwtAxios.put(`${host}/${nno}`, notice, header) //  ${host}/${pno} 엔드포인트 주소
    return res.data                                               //put요청 보내는건 notice, header정보다
}
export const deleteOne = async (nno) => {
    const res = await jwtAxios.delete(`${host}/${nno}`)
    return res.data
}



