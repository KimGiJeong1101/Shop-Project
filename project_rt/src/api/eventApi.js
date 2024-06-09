import axios from "axios"
import { API_SERVER_HOST } from "./todoApi"
import jwtAxios from "../util/jwtUtil"

const host = `${API_SERVER_HOST}/api/event`

export const postAdd = async (event) => {

  const header = {headers: {"Content-Type": "multipart/form-data"}}

  // 경로 뒤 '/' 주의 
  const res = await jwtAxios.post(`${host}/`, event, header)

  return res.data

}

export const getList = async ( pageParam ) => {

  const {page,size} = pageParam

  const res = await axios.get(`${host}/list`, {params: {page:page,size:size }})
  
  return res.data

}

export const getOne = async (eno) => {

  const res = await axios.get(`${host}/${eno}` )

  return res.data

}


export const putOne = async (eno, event) => {

  const header = {headers: {"Content-Type": "multipart/form-data"}}

  const res = await jwtAxios.put(`${host}/${eno}`, event, header)

  return res.data

}

export const deleteOne = async (eno) => {

  const res = await jwtAxios.delete(`${host}/${eno}`)

  return res.data

}
