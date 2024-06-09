import { useEffect, useRef, useState } from "react";
import { getOne, putOne, deleteOne } from "../../api/noticeApi";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
    nno: '',
    ntitle: '',
    nwriter: '',
    ncontent: '',
    ndelFlag: false,
    noticeUploadFileNames: []
}
const host = API_SERVER_HOST
const ModifyComponent = ({ nno }) => {
    const [notice, setNotice] = useState(initState)
    //결과 모달
    const [result, setResult] = useState(null)
    //이동용 함수
    const { moveToRead, moveToList } = useCustomMove()

    const [fetching, setFetching] = useState(false)
    
    const uploadRef = useRef()
    
    useEffect(() => {
        setFetching(true)
        getOne(nno).then(data => {
            setNotice(data)
            setFetching(false)
        })
    }, [nno])

    const handleChangeNotice = (e) => {
        notice[e.target.name] = e.target.value
        setNotice({ ...notice })
    }
    const deleteOldImages = (imageName) => {
        const resultFileNames = notice.noticeUploadFileNames.filter(fileName => fileName !== imageName)
        notice.noticeUploadFileNames = resultFileNames
        setNotice({ ...notice })
    }

    const handleClickModify = () => {
        if (!notice.ntitle || !notice.nwriter || !notice.ncontent) {
            alert("제목, 작성자, 내용을 모두 입력해주세요.");
            return; // 등록 중단
        }
        const files = uploadRef.current.files
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append("NoticeFiles", files[i]);
        }
        //other data
        formData.append("ntitle", notice.ntitle)
        formData.append("nwriter", notice.nwriter)
        formData.append("ncontent", notice.ncontent)
        formData.append("ndelFlag", notice.ndelFlag)
        for (let i = 0; i < notice.noticeUploadFileNames.length; i++) {
            formData.append("noticeUploadFileNames", notice.noticeUploadFileNames[i])
        }
        //fetching
        setFetching(true)
        putOne(nno, formData).then(data => { //수정 처리
            setResult('Modified')
            setFetching(false)
        })
    }

    const handleClickDelete = () => {
        setFetching(true)
        deleteOne(nno).then(data => {
            setResult("Deleted")
            setFetching(false)
        })
    }

    const closeModal = () => {
        if (result === 'Modified') {
            moveToRead(nno)
        } else if (result === 'Deleted') {
            moveToList({ page: 1 })
        }
        setResult(null)
    }

    return (
        <div className="pr-40">
            {fetching ? <FetchingModal /> : <></>}
            {result ?
                <ResultModal
                    title={`${result}`}
                    content={'정상적으로 처리되었습니다.'}  //결과 모달창 
                    callbackFn={closeModal} /> : <></>}
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">제목</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                        name="ntitle" type={'text'} value={notice.ntitle} onChange={handleChangeNotice}>
                    </input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">작성자</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                        name="nwriter" type={'text'} value={notice.nwriter} onChange={handleChangeNotice} readOnly>
                    </input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">내용</div>
                    <textarea className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                        name="ncontent" type={'text'} value={notice.ncontent} onChange={handleChangeNotice}>
                    </textarea>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">사진첨부</div>
                    <input ref={uploadRef}
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                        type={'file'} multiple={true}
                    >
                    </input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">
                        사진 미리보기
                    </div>
                    <div className="w-4/5 justify-center flex flex-wrap items-start">

                        {notice.noticeUploadFileNames.map((imgFile, i) =>
                            <div className="flex justify-center flex-col w-1/3" key={i}>
                                <button className="bg-blue-500 text-3xl text-white"
                                    onClick={() => deleteOldImages(imgFile)}>삭제하기</button>
                                <img alt="img" src={`${host}/api/notice/view/s_${imgFile}`} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end p-20 ">
                <button type="button"
                    className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
                    onClick={handleClickDelete}> 글삭제
                </button>

                <button type="button"
                    className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 mx-3"
                    onClick={handleClickModify}> 수정
                </button>

                <button type="button"
                    className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
                    onClick={moveToList}> 목록
                </button>
            </div>
        </div>
    );
}

export default ModifyComponent;