import axios from "axios"
import jwtAxios from "../util/jwtUtil"
/* json 데이터 형식을 기본적으로 사용해 개발 분량이 적다는 장점으로 axios */
export const API_SERVER_HOST = 'http://localhost:8081'

const prefix = `${API_SERVER_HOST}/api/ask`

export const getOne = async (ano) => {

  const res = await axios.get(`${prefix}/${ano}`)

  return res.data

}

export const getList = async (pageParam) => {
  /* getList() 페이지처리위해 사용 */
  const { page, size } = pageParam

  const res = await axios.get(`${prefix}/list`, { params: { page: page, size: size } })

  return res.data

}


export const postAdd = async (askObj) => {

  const res = await jwtAxios.post(`${prefix}/register`, askObj)

  return res.data
}


export const deleteOne = async (ano) => {

  const res = await jwtAxios.delete(`${prefix}/${ano}`)

  return res.data

}

export const putOne = async (ask) => {

  const res = await jwtAxios.put(`${prefix}/${ask.ano}`, ask)

  return res.data
}

export const pwCheck = async (ask) => {
  const res = await jwtAxios.post(`${prefix}/pwCheck`, ask)
  return res.data
}
