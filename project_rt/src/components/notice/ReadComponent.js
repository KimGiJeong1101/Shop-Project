import { getOne } from "../../api/noticeApi";
import { useEffect, useState } from "react"
import { API_SERVER_HOST } from "../../api/todoApi"
import useCustomMove from "../../hooks/useCustomMove"
import FetchingModal from "../common/FetchingModal"
import signinState from "../../atoms/signinState";
import { useRecoilValue } from "recoil";

const initState = {
    ntitle: '', // 제목
    nwriter: '', // 작성자
    ncontent: '',  // 내용
    ndesc: '',  //사진설명
    noticeUploadFileNames: [],
    roleNames: []
}
const host = API_SERVER_HOST
const ReadComponent = ({ nno }) => { //pno를 선택. 다른페이지에서 클라이언트가 원하는 pno선택하는 것 그럼 그게 여기로 옴
    const [notice, setNotice] = useState(initState) //일단 윗쪽의 기본 initState값들이 온다


    const userInfo = useRecoilValue(signinState);

    //화면 이동용 함수
    const { moveToList, moveToModify } = useCustomMove()
    //fetching
    const [fetching, setFetching] = useState(false)
    useEffect(() => {
        setFetching(true)
        getOne(nno).then(data => { //pno를 받은 getOne()메서드가 서버에 get요청을 보내고 서버가 보내준 데이터를 받은다음
            //then()이 실행되는데 서버에서 받아온 데이터를 data라는 이름으로 이동시킨다
            setNotice(data)      //그리고 해당 데이터가 setProduct(),setFetching()함수를 실행시킨다
            setFetching(false)  //결국 pno가 getOne()을 호출하고 data가 setProduct(),setFetching()를 호출한다
        })
    }, [nno]) //[pno]이건 pno값이 바뀌면 useEffect가 실행된다는 조건을 걸어둔거다



    const isAdmin = Array.isArray(userInfo.roleNames) && (userInfo.roleNames.includes('ADMIN') || userInfo.roleNames.includes('MANAGER'));

    return (

        <div className="px-60">
            {fetching ? <FetchingModal /> : <></>}
            <div className="flex flex-col justify-center px-20 min-w-[400px]">
                <div className="border-t-4 border-black text-3xl font-extrabold flex min-w-[400px]"></div>
                <div className="w-4/5 p-6 font-bold text-xl">{notice.ntitle}</div>
                <div className="border-t border-gray-400 text-3xl font-extrabold pt-4 pb-4 flex min-w-[400px]" />
            </div>
            <div className="flex flex-col justify-center px-20 min-w-[400px]">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="px-10">{notice.ncontent}</div>
                </div>
            </div>
            <div className="w-full justify-center flex flex-col m-auto items-center">
                {notice.noticeUploadFileNames.map((imgFile, i) =>
                    <img alt="notice" key={i} className="px-20 w-full" src={`${host}/api/notice/view/${imgFile}`} />
                )}
                {/*a.b.c()라는 빌더패턴은 a에서b를 찾고, b속의 c()를 찾아 호출한다 이다. b속에 c()가 있어야 한다*/}
                {/*그리고 []이런 배열은 기본적으로 map() 함수를 내장하고 있다*/}
                {/*uploadFileNames속의 정보를 imgFile라는 이름으로 담는다, i는 인덱스이다 그리고 map은 반복문이다*/}
                {/*결국 인덱스 번호에 맞춰서 uploadFileNames 정보를 담은 이미지들을 보여주는것이다*/}
            </div>
            <div className="flex justify-end p-20">

                {isAdmin && (
                    <button type="button"
                        className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 mx-3"
                        onClick={() => moveToModify(nno)}
                    >
                        수정
                    </button>

                )}
                <button type="button" className="inline-flex items-center border rounded-md bg-gray-50 px-2 text-sm shadow-sm hover:bg-gray-100"
                    onClick={moveToList}>
                    목록
                </button>
            </div>
        </div>
    )
}

export default ReadComponent