import jwtAxios from "../util/jwtUtil"

export const API_SERVER_HOST = 'http://localhost:8081'
const host = `${API_SERVER_HOST}/api/cart`

export const getCartItems = async ( ) => {

  const res = await jwtAxios.get(`${host}/items`)

  return res.data

}

export const postChangeCart = async (cartItem) => {

  const res = await jwtAxios.post(`${host}/change`, cartItem)

  return res.data
}