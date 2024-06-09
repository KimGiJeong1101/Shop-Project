import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./productApi";


const host = `${API_SERVER_HOST}/api`

export const postAddOrder = async(param) => {
    const res = await jwtAxios.post(`${host}/order`,param)
    return res.data
}

export const postCartOrder = async(param) => {
    const res = await jwtAxios.post(`${host}/cart/orders`,param)
    return res.data
}

export const getOrder = async ({ page, size }) => {
    const response = await jwtAxios.get(`${host}/orders`, {
        params: { page, size } // URL에 파라미터로 page와 size를 추가
    });
    return response.data; // 응답 데이터 반환
}

export const postCancel = async (orderid) => {
    const res = await jwtAxios.post(`${host}/order/${orderid}/cancel`)
    return res.date
}
