import { useRef, useState } from "react";
import { postAdd } from "../../api/noticeApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import { useRecoilValue } from "recoil";
import signinState from "../../atoms/signinState";

// AddComponent 함수형 컴포넌트 정의
const AddComponent = () => {


    const memberInfo = useRecoilValue(signinState)

    const initState = {
        ntitle: '', // 제목
        nwriter: memberInfo.nickname || '', // 작성자
        ncontent: '',  // 내용
        files: []  // 업로드할 파일 목록
    }

    // 상태 변수와 상태를 변경하는 함수 선언
    const [notice, setNotice] = useState({ ...initState }); // 제품 초기 상태
    const uploadRef = useRef(); // 파일 업로드(input 요소)에 대한 참조를 나타내는 변수
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)
    const { moveToList } = useCustomMove() //이동을 위한 함수

    // 입력 값 변경 핸들러
    const handleChangeNotice = (e) => { //입력 요소의 값이 변경될 때 실행되는 함수를 정의 (e)이렇게 해서 함수가 실행됨
        notice[e.target.name] = e.target.value; //매개변수로 전달된 이벤트 객체(e)의 target.name에 해당하는 속성 이름으로 product 객체의 값을 변경
        //여기서 product[e.target.name] 이건 배열이 아닌 객체인데 대괄호 쓴건 
        //product객체 내부의 특정 속성이 접근하기 위함이다
        setNotice({ ...notice }); // 상태 업데이트
    }

    // 추가 버튼 클릭 핸들러
    const handleClickAdd = (e) => {
        // 입력값이 비어 있는지 확인
        if (!notice.ntitle || !notice.nwriter || !notice.ncontent) {
            alert("제목, 작성자, 내용을 모두 입력해주세요.");
            return; // 등록 중단
        }
        const files = uploadRef.current.files // useRef 훅을 사용하여 만든 uploadRef를 통해 파일 업로드(input) 요소에 접근하고, 사용자가 업로드한 파일들을 얻어옵니다.
        const formData = new FormData() //이걸 작성함으로 인해서 사용자가 입력한 데이터를 모아서 한번에 보낸다 이거 안쓰면 하나 고칠 때 마다 서버로 전송될듯?
        for (let i = 0; i < files.length; i++) {
            formData.append("NoticeFiles", files[i]);
        }
        //other data
        formData.append("ntitle", notice.ntitle)
        formData.append("nwriter", notice.nwriter)
        formData.append("ncontent", notice.ncontent)
        console.log(formData)

        setFetching(true)
        postAdd(formData).then(data => {  //formData를 페러미터로 받은 postAdd()함수가 실행되어 서버로 부터 응답이오면
            setFetching(false)           //then()메서드가 실행된다 메서드 내에서는 해당 응답 데이터(data)를 처리한다
            setResult(data.result)      //그리고 data를 사용해서 setFetching()과 setResult() 함수를 호출하여 상태를 업데이트
        })                              //하겠다는 말인데 setFetching(false) 이건 그냥 setFetching이 false값을 가진 채로 
        //재호출(랜더링)시키겠다는 말(data.result) 이건 그 값으로 바꾸겠다는 거다 set뭐시기 니까
    }
    const closeModal = () => { //ResultModal 종료 

        setResult(null)
        moveToList({ page: 1 }) //모달 창이 닫히면 이동
    }

    // JSX 반환
    return (
        <div className="pr-40">

            {/*조건부 랜더링 fetching상태가 true면 <FetchingModal /> 렌더링, false면 <></>렌더링*/}
            {fetching ? <FetchingModal /> : <></>}

            {result ? //result가 참 or 거짓일 때 
                <ResultModal
                    title={'Notice Add Result'}
                    content={`${result}번 등록 완료`}
                    callbackFn={closeModal}
                />
                : <></>
            }

            {/* 공지사항 이름 입력 */}
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">제목</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                        name="ntitle" type={'text'} value={notice.ntitle} onChange={handleChangeNotice} >
                    </input>
                </div>
            </div>
            {/* 공지사항 작성자 입력 */}
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">작성자</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                        name="nwriter" type={'text'} value={notice.nwriter} onChange={handleChangeNotice} readOnly>
                    </input>
                </div>
            </div>
            {/* 내용 입력 */}
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">내용</div>
                    <textarea
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
                        name="ncontent" rows="4" onChange={handleChangeNotice} value={notice.ncontent}> {/*이건 초기값*/}
                        {notice.ncontent}{/*이건 사용자입력용*/}
                    </textarea>
                </div>
            </div>

            {/* 파일 업로드 입력 */}
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">사진첨부</div>
                    <input
                        ref={uploadRef} //업로드 기능 선언
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" //업로드아이콘 디자인
                        type={'file'} multiple={true}>{/*형식이 파일이라 선언하고 여러개 파일 업로드 가능하도록 선언*/}
                    </input>
                </div>
            </div>
            {/* 추가 버튼 */}
            <div className="flex justify-end">
                <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                    <button type="button"
                        className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 mx-3"
                        onClick={moveToList}> 목록
                    </button>
                    <button type="button"
                        className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
                        onClick={handleClickAdd} > {/*위에 선언했던거 여기서 사용*/}
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddComponent; // AddComponent 컴포넌트 내보내기