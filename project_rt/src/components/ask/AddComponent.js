import { useState } from "react";
import { postAdd } from "../../api/askApi";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import signinState from "../../atoms/signinState";
import { useRecoilValue } from "recoil";


const initState = {
  title: '',
  text: '',
  password: '',
  writer: '',
  regDate: '',
  modDate: ''
}

const AddComponent = () => {

  const userInfo = useRecoilValue(signinState);


  // initState를 기반으로 상태를 초기화하지만, 사용자 이메일과 현재 날짜로 일부 필드를 덮어씁니다.
  const [ask, setAsk] = useState({
    ...initState,
    writer: userInfo.email || '', // 사용자 이메일이 없다면 빈 문자열로 초기화

  });

  const [result, setResult] = useState(null) //결과 상태 

  const { moveToList } = useCustomMove() //useCustomMove 활용

  const [titleMsg, setTitleMsg] = useState(null);
 
  const [textMsg, setTextMsg] = useState(null);
 
  const [writerMsg, setWriterMsg] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  const handleChangeAsk = (e) => {

    ask[e.target.name] = e.target.value

    setAsk({ ...ask })
  }

  const handleClickAdd = () => {
    if (!ask.title) {
      setTitleMsg("제목을 입력해주세요.")
      return;
    } else {
      setTitleMsg(null);
    }
    if (!ask.writer) {
      setWriterMsg("이메일이 설정되지 않았습니다.")
      return;
    } else {
      setWriterMsg(null);
    }
    if (!ask.text) {
      setTextMsg("내용을 입력해주세요.")
      return;
    } else {
      setTextMsg(null);
    }

    postAdd(ask)
      .then(result => {
        console.log(result)

        setResult(result.ANO) //결과 데이터 변경 
        setAsk({ ...initState })
        setErrorMsg(null);

      }).catch(e => {
        console.error(e)
        setErrorMsg("등록 중 오류가 발생했습니다.")
      })
  }

  const closeModal = () => {

    setResult(null)
    moveToList()  //moveToList( )호출 

  }


  return (
    <div className="mr-2 ml-2">

      {/* 모달 처리 */}

      {result ? <ResultModal title={'Add Result'} content={`New ${result} Added`} callbackFn={closeModal} /> : <></>}

      <div className="sm:col-span-5 mb-4 ml-5">
        {errorMsg && <div className="error">{errorMsg}</div>}
        <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900">
          * TITLE
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-400 sm:max-w-full">
            <input
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="title"
              type={'text'}
              value={ask.title}
              placeholder="제목을 입력해주세요"
              onChange={handleChangeAsk}
            />
          </div>
          {titleMsg && <div className="error">{titleMsg}</div>}
        </div>
      </div>
      <div className="sm:col-span-5 mb-4 ml-5">
        <label htmlFor="writer" className="block text-sm font-bold leading-6 text-gray-900">
          * EMAIL
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-400 sm:max-w-full">
            <input
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="writer"
              type={'text'}
              value={ask.writer}
              placeholder="아이디를 입력해주세요"
              onChange={handleChangeAsk}
              readOnly
            />
          </div>
          {writerMsg && <div className="error">{writerMsg}</div>}
        </div>
      </div>
      <div className="col-span-full mb-4 ml-5">
        <label htmlFor="text" className="block text-sm font-bold leading-6 text-gray-900">
          * TEXT
        </label>
        <div className="mt-2">
          <textarea
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            name="text"
            rows="4"
            placeholder="내용을 입력해주세요"
            onChange={handleChangeAsk}
            value={ask.text}
          />
        </div>
        {textMsg && <div className="error">{textMsg}</div>}
      </div>
      <div className="sm:col-span-5 mb-4 ml-5">
        <label htmlFor="password" className="block text-sm font-bold leading-6 text-gray-900">
          PASSWORD
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-400 sm:max-w-full">
            <input
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="password"
              type={'password'}
              value={ask.password}
              placeholder="비밀번호를 입력해주세요"
              onChange={handleChangeAsk}
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-5 mb-4 ml-5">
        <div className="text-sm"> * 는 필수 입력항목입니다.<br /> 비밀 번호 입력시 비밀글이 됩니다.</div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 mr-4"
          onClick={handleClickAdd}
        >
          글등록
        </button>
        <button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
          onClick={moveToList}
        >
          목록
        </button>
      </div>
    </div>
  );
}

export default AddComponent;