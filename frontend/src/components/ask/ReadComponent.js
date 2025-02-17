import { useEffect, useState } from "react"
import { getOne } from "../../api/askApi"
import useCustomMove from "../../hooks/useCustomMove"
import useCustomLogin from "../../hooks/useCustomLogin";
import signinState from "../../atoms/signinState";
import { useRecoilValue } from "recoil";

const initState = {
    ano: '',
    title: '',
    text: '',
    writer: '',
    password: '',
    regDate: '',
    modDate: ''
}




const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);  // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = (`0${date.getDate()}`).slice(-2);
  
    return `${year}-${month}-${day}`;
  }

const ReadComponent = ({ ano }) => {

    const [ask, setAsk] = useState(initState)


    const userInfo = useRecoilValue(signinState); // 로그인 상태 가져오기

    const { moveToList, moveToModify } = useCustomMove()
    /* useEffect() 사용해서 번호가 변경될 때만 Axios 이용해 readOne() 호출. */




    useEffect(() => {
        getOne(ano).then(data => {
            console.log(data)
            setAsk(data)
        })
    }, [ano])


    const showModifyButton = userInfo.email &&
        (userInfo.roleNames.includes('ADMIN')
            || userInfo.roleNames.includes('MANAGER')
            || userInfo.email === ask.writer);


    return (
        <div className="mt-1 mr-2 ml-2">

            <div className="flex justify-center mb-4">
                <div className="w-5/6 p-6 border-t border-b">
                    <h1 className="text-3xl mb-1">{ask.title}</h1>
                    <div className="flex">
                        <div className="text-sm mr-5">작성자 : {ask.writer}</div>
                        <div className="text-sm">작성일 :  {formatDate(ask.regDate)}</div>
                    </div>

                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-5/6 p-6 ">
                    {ask.text}
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-5/6 p-6 border-b">
                </div>
            </div>


            {/* buttons.........start */}

            <div className="flex justify-between p-4 mx-10">
                <button
                    type="button"
                    className="inline-flex items-center border rounded-md bg-gray-50 px-2 text-sm shadow-sm hover:bg-gray-100"
                    onClick={moveToList}
                >
                    목록
                </button>


                {showModifyButton && (
                    <button
                        type="button"
                        className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
                        onClick={() => moveToModify(ano)}
                    >
                        글수정
                    </button>

                )}
            </div>


            {/* 
            <div className="flex justify-end p-4">

                <button type="button"
                    className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
                    onClick={() => moveToList()}
                >
                    List
                </button>

                <button type="button"
                    className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
                    onClick={() => moveToModify(ano)}
                >
                    Modify
                </button>

            </div> */}


        </div>
    )
}

// const makeDiv = (title, value) =>
//     <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
//             <div className="w-1/5 p-6 text-right font-bold">{title}</div>
//             <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
//                 {value}
//             </div>
//         </div>
//     </div>


export default ReadComponent;