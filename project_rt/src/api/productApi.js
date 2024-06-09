
import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = 'http://localhost:8081'
const host = `${API_SERVER_HOST}/api/products`

export const postAdd = async (product) => {
    const header = {headers : {"Content-Type" : "multipart/form-data"}}

    const res = await jwtAxios.post(`${host}/`, product,header)
    console.log(res.data)
    return res.data
}

export const getListOne = async (pageParam) => {
     const {page,size} = pageParam
     const res = await axios.get(`${host}/list/one`, {params:{page:page,size:size}})
     console.log(res.data)
     return res.data
}
export const getListSet = async (pageParam) => {
    const {page,size} = pageParam
    const res = await axios.get(`${host}/list/set`, {params:{page:page,size:size}})
    console.log(res.data)
    return res.data
}
export const getListAll = async (pageParam) => {
    const {page,size} = pageParam
    const res = await axios.get(`${host}/list/all`, {params:{page:page,size:size}})
    console.log(res.data)
    return res.data
}

export const getOne = async (pno) => {
    const res = await axios.get(`${host}/${pno}`)
    return res.data
}

export const putOne = async (pno,product)=>{
    const header = {headers : {"Content-Type" : "multipart/form-data"}}
    const res = await jwtAxios.put(`${host}/${pno}`, product, header)
    return res.data
}
export const deleteOne = async (pno) => {
    const res = await jwtAxios.delete(`${host}/${pno}`)
    return res.data
}
