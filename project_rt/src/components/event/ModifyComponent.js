import { useEffect, useRef, useState } from "react";
import { getOne, putOne, deleteOne } from "../../api/eventApi";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid'

const initState = {
  eno: '',
  title: '',
  content: '',
  delFlag: false,
  uploadFileNames: [],

}

const host = API_SERVER_HOST

const ModifyComponent = ({ eno }) => {

  const [event, setEvent] = useState(initState)
  //결과 모달
  const [result, setResult] = useState(null)
  //이동용 함수
  const { moveToRead, moveToList } = useCustomMove()

  const [fetching, setFetching] = useState(false)

  const uploadRef = useRef()

  const [showAlert, setShowAlert] = useState(false); // 알림 표시 여부 상태 추가

  useEffect(() => {

    setFetching(true)

    getOne(eno).then(data => {

      setEvent(data)
      setFetching(false)
    })

  }, [eno])

  const handleChangeEvent = (e) => {

    event[e.target.name] = e.target.value

    setEvent({ ...event })
  }

  const deleteOldImages = (imageName) => {

    const resultFileNames = event.uploadFileNames.filter(fileName => fileName !== imageName)

    event.uploadFileNames = resultFileNames

    setEvent({ ...event })
  }



  // const handleFileChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setEvent(prevState => ({
  //     ...prevState,
  //     files: files
  //   }));
  // };


  const handleClickModify = () => {
    // 이미지가 없으면 알림 표시하고 함수 종료
    // if (!uploadRef.current.files || uploadRef.current.files.length === 0) {
    //   setShowAlert(true);
    //   return;
    // }

    const files = uploadRef.current.files

    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    //other data
    formData.append("title", event.title)
    formData.append("content", event.content)
    formData.append("delFlag", event.delFlag)

    for (let i = 0; i < event.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", event.uploadFileNames[i])
    }
    //fetching
    setFetching(true)

    putOne(eno, formData).then(data => { //수정 처리
      setResult('Modified')
      setFetching(false)
    })


  }

  const handleClickDelete = () => {

    setFetching(true)
    deleteOne(eno).then(data => {

      setResult("Deleted")
      setFetching(false)

    })

  }

  const closeModal = () => {

    if (result === 'Modified') {
      moveToRead(eno)
    } else if (result === 'Deleted') {
      moveToList({ page: 1 })
    }

    setResult(null)

  }




  return (
    <div className="mt-1 mx-8">
      {fetching ? <FetchingModal /> : <></>}

      {result ?
        <ResultModal
          title={`${result}`}
          content={'정상적으로 처리되었습니다.'}  //결과 모달창 
          callbackFn={closeModal}
        />
        :
        <></>
      }


      {/* <div className="flex justify-center">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <div className="w-1/5 p-6 text-right font-bold">title</div>
        <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
          name="title"
          type={'text'} 
          value={event.title}
          onChange={handleChangeEvent}
          >
          </input>
      </div>
    </div> */}

      <div className="mb-4 ml-5">
        <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900">
              Title
            </label>
            <div className="mt-2">
              <input className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="title"
                type={'text'}
                value={event.title}
                placeholder="제목을 입력해주세요"
                onChange={handleChangeEvent}
              >
              </input>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="delete" className="block text-sm font-bold leading-6 text-gray-900">
              Delete
            </label>
            <div className="mt-2">
              <select
                name="delFlag" value={event.delFlag}
                onChange={handleChangeEvent}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <option value={false}>사용</option>
                <option value={true}>삭제</option>
              </select>
            </div>
          </div>
        </div>
      </div>


      {/* <div className="sm:col-span-4 mb-4 ml-5">
        <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900">
          Title
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="title"
              type={'text'}
              value={event.title}
              placeholder="제목을 입력해주세요"
              onChange={handleChangeEvent}
            >
            </input>
          </div>
        </div>
      </div> */}

      <div className="col-span-full mb-4 ml-5">
        <label htmlFor="content" className="block text-sm font-bold leading-6 text-gray-900">
          Content
        </label>
        <div className="mt-2">
          <textarea
            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="content"
            rows="4"
            placeholder="내용을 입력해주세요"
            onChange={handleChangeEvent}
            value={event.content}>
            {event.content}
          </textarea>
        </div>
      </div>

      {/* <div className="flex justify-center">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <div className="w-1/5 p-6 text-right font-bold">Content</div>
          <textarea 
          className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
          name="content"
          rows="4"
          onChange={handleChangeEvent}
          value={event.content}>
            {event.content}
          </textarea>
        </div>  
    </div> */}

      {/* <div className="sm:col-span-4 mb-4 ml-5">
        <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900">
          삭제 여부
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <select
            name="delFlag" value={event.delFlag}
            onChange={handleChangeEvent}
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
            <option value={false}>사용</option>
            <option value={true}>삭제</option>
          </select>
          </div>
        </div>
      </div> */}

      {/* <div className="col-span-full mb-4 ml-5">
        <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
          upload
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  ref={uploadRef}
                  id="file-upload"
                  name="file-upload"
                  type={'file'}
                  multiple={true}
                  className="sr-only" />

              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div> */}

      <div className="col-span-full mb-4 ml-5">
        <label htmlFor="upload" className="block text-sm font-bold leading-6 text-gray-900">
          upload
        </label>
        <div className="mt-1 flex justify-start rounded-lg border border-gray-800/25 px-6 py-4">
          <div className="text-center">
            <div className="flex text-sm leading-6 text-gray-400">
              <input ref={uploadRef}
                className="justify-start"
                type={'file'} multiple={true}
                
              ></input>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">images</div>
          <input ref={uploadRef}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            type={'file'} multiple={true}
          >
          </input>
        </div>
      </div> */}

      {/* <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">images</div>
          <input ref={uploadRef}
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            type={'file'} multiple={true}
          >
          </input>
        </div>
      </div> */}

      {/* <div className="col-span-full mb-4 ml-5">
        <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
          Images
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="w-4/5 justify-center flex flex-wrap items-start">
            {event.uploadFileNames.map((imgFile, i) =>
              <div
                className="flex justify-center flex-col w-1/3 "
                key={i}>
                <button className=" text-3xl text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                  onClick={() => deleteOldImages(imgFile)}
                ><XMarkIcon className="h-6 w-6" aria-hidden="true" /></button>
                <img
                  alt="img"
                  src={`${host}/api/event/view/${imgFile}`} />

              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">
            Images
          </div>
          <div className="w-4/5 justify-center flex flex-wrap items-start">
            {event.uploadFileNames.map((imgFile, i) =>
              <div
                className="flex justify-center flex-col w-1/3"
                key={i}>
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                  onClick={() => deleteOldImages(imgFile)}
                >
                  <span className="sr-only">DELETE</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <img
                  alt="img"
                  src={`${host}/api/event/view/${imgFile}`} />

              </div>
            )}
          </div>
        </div>
      </div> */}


      <div className="col-span-full mb-4 ml-5">
        <label htmlFor="uploaded-files" className="block text-sm font-bold leading-6 text-gray-900">
          Uploaded Files
        </label>
        <ul className="mt-2">
          {event.uploadFileNames.map((fileName, index) => {
            // UUID와 파일 이름을 공백으로 나누고, 마지막 요소를 파일 이름으로 사용
            const parts = fileName.split(' ');
            const originalFileName = parts[parts.length - 1];
            return (
              <li key={index} className="flex items-center">
                <img
                  src={`${host}/api/event/view/${fileName}`}
                  alt={originalFileName}
                  className="w-12 h-12 object-cover rounded-lg mr-2"
                />
                <span className="text-gray-900">{originalFileName}</span>
                <button className="ml-2 text-red-500" onClick={() => deleteOldImages(fileName)}>
                  <XMarkIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>








      {/* <div className="col-span-full mb-4 ml-5">
        <div className="mt-2">
          <div className="w-1/5 p-6 text-right font-bold">
            Images
          </div>
          <div className="w-4/5 justify-center flex flex-wrap items-start ml-4">
            {event.uploadFileNames.map((imgFile, i) =>
              <div
                className="flex justify-center flex-col w-1/3"
                key={i}>
                <button className="bg-blue-500 text-3xl text-white"
                  onClick={() => deleteOldImages(imgFile)}
                >DELETE</button>
                <img
                  alt="img"
                  src={`${host}/api/event/view/${imgFile}`} />

              </div>
            )}
          </div>
        </div>
      </div> */}



      {/* 알림 */}
      {showAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          <strong className="font-bold">알림:</strong>
          <span className="block sm:inline">이미지를 추가해주세요.</span>
        </div>
      )}


      <div className="flex justify-end p-4">

        <button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
          onClick={handleClickDelete}
        >
          글삭제
        </button>

        <button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 mx-2"
          onClick={handleClickModify}
        >
          글수정
        </button>

        <button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
          onClick={moveToList}
        >
          목록
        </button>

        {/* 
        <button type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
          onClick={handleClickDelete}
        >
          Delete
        </button>

        <button type="button"
          className="inline-block rounded p-4 m-2 text-xl w-32  text-white bg-orange-500"
          onClick={handleClickModify}
        >
          Modify
        </button>

        <button type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
          onClick={moveToList}
        >
          List
        </button> */}

      </div>

    </div>
  );
}

export default ModifyComponent;
