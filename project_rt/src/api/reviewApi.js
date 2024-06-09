import axios from "axios"
import jwtAxios from "../util/jwtUtil"
/* json 데이터 형식을 기본적으로 사용해 개발 분량이 적다는 장점으로 axios */
export const API_SERVER_HOST = 'http://localhost:8081'

const prefix = `${API_SERVER_HOST}/review`

/********************* 리스트  ********************/
export const getList = async (pno, pageParam) => {
  /* getList() 페이지처리위해 사용 */
  const { page, size } = pageParam
  // console.log(`${prefix}/list/${pno}`)
  const res = await axios.get(`${prefix}/list/${pno}`, { params: { page: page, size: size } })
  console.log(res.data)
  return res.data

}

/* 상세보기 */
export const getReview = async (pno, rno) => {
  
  const res = await axios.get(`${prefix}/${pno}/${rno}`)

  return res.data

}


export const postAdd = async (pno,reviewObj) => {
  console.log(pno)
  console.log(reviewObj)
  const res = await axios.post(`${prefix}/add/${pno}`, reviewObj)
  console.log(reviewObj)
  console.log(res)
  return res.data
}


export const putOne = async (rno,review) => {

  const res = await axios.put(`${prefix}/${rno}`, review)

  return res.data
}


export const deleteOne = async (rno) => {
console.log(rno)
  const res = await axios.delete(`${prefix}/remove/${rno}`)
console.log(res.data)
  return res.data

}


