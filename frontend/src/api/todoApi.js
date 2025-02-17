import axios from "axios"

//서버 주소
export const API_SERVER_HOST = 'http://localhost:8081' //API 서버주소 지정 
//(이 변수가 다른 파일에서도 사용될 수 있도록 모듈로 내보내고 있음)
const prefix = `${API_SERVER_HOST}/api/todo` //서버주소 뒤에 /api/todo 붙임 
//이렇게 하는 이유는 prefix 변수를 사용하여 API 엔드포인트를 구성할 때 반복을 줄이고 코드의 가독성을 높이기 위해서

export const getOne = async (tno) => {  //sync 키워드는 함수를 비동기 함수로 만듦. 이 키워드를 함수 선언 앞에 추가하면, 함수는 항상 프라미스를 반환,await 키워드를 해당 함수 내에서 사용 할 수 있게 됨
    const res = await axios.get(`${prefix}/${tno}`) // await 키워드는 프라미스를 기다리는데 사용
    return res.data
} //async와 await의 키워드를 통해 비동기임(작업이 동시에 처리 됨)을 알 수 있음 

//프라미스(Promise)는 자바스크립트에서 비동기 작업을 처리하는 객체
// 1. 대기(pending): 비동기 작업이 아직 완료되지 않은 상태입니다.
// 2. 이행(fulfilled): 비동기 작업이 성공적으로 완료된 상태입니다.
// 3. 거부(rejected): 비동기 작업이 실패한 상태입니다.

export const getList = async (pageParam) => {
    const { page, size } = pageParam
    const res = await axios.get(`${prefix}/list`, { params: { page: page, size: size } })
    return res.data
}

////////////////////////////////////////////////////////////// 아래 복붙

export const postAdd = async (todoObj) => {
    const res = await axios.post(`${prefix}/` , todoObj)
    return res.data
  }
  
  
  export const deleteOne = async (tno) => {
    const res = await axios.delete(`${prefix}/${tno}` )
    return res.data
  
  }
  
  export const putOne = async (todo) => {
    const res = await axios.put(`${prefix}/${todo.tno}`, todo)
    return res.data
  }
  

//   ***따옴표와 백틱의 사용시 차이점***
// 따옴표와 백틱은 문자열을 표현하는 데 사용되는 서로 다른 기호입니다. 여기에는 몇 가지 차이점이 있습니다

// 문자열 내 변수 또는 표현식 삽입: 백틱을 사용하면 문자열 내에 ${} 문법을 사용하여 변수나 표현식을 쉽게 삽입할 수 있습니다. 이는 템플릿 리터럴(template literal)이라고도 합니다. 반면에 단일 따옴표나 이중 따옴표는 변수나 표현식을 삽입할 때 별도의 문자열 연결 연산자(+)를 사용해야 합니다.

// 여러 줄 문자열: 백틱을 사용하면 여러 줄로 구성된 문자열을 표현할 수 있습니다. 단일 따옴표나 이중 따옴표를 사용하여 여러 줄 문자열을 표현하려면 각 줄마다 이스케이프 문자를 사용하거나 문자열을 연결해야 합니다.

// 특수 문자 처리: 백틱은 보다 자유롭게 특수 문자를 처리합니다. 이스케이프 문자 없이 백틱 안에 따옴표를 사용할 수 있습니다. 반면에 단일 따옴표나 이중 따옴표는 특수 문자를 처리하기 위해 이스케이프 처리가 필요할 수 있습니다.

// 따라서, 백틱은 문자열 내 변수 삽입이나 여러 줄 문자열을 표현하는 데 편리하며, 특수 문자를 처리하기가 더 용이합니다. 하지만 단일 따옴표나 이중 따옴표도 많이 사용되며, 간단한 문자열을 표현하는 데에는 충분히 유용합니다.