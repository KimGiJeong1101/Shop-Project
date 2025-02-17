import React, { useRef, useState } from "react";
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { postAdd } from "../../api/eventApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
  title: '',
  content: '',
  files: []
}

const AddComponent = () => {

  const [event, setEvent] = useState({ ...initState });
  const uploadRef = useRef();
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);
  const { moveToList } = useCustomMove();
  const [showAlert, setShowAlert] = useState(false); // 알림 표시 여부 상태 추가

  const handleChangeEvent = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = [...e.dataTransfer.files];
    setEvent(prevState => ({
      ...prevState,
      files: [...prevState.files, ...droppedFiles]
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = [...e.target.files];
    setEvent(prevState => ({
      ...prevState,
      files: [...prevState.files, ...selectedFiles]
    }));
  };

  const handleClickAdd = () => {
    // 이미지가 없으면 알림 표시하고 함수 종료
    if (event.files.length === 0) {
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    const files = event.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("title", event.title);
    formData.append("content", event.content);

    setFetching(true);

    postAdd(formData).then(data => {
      setFetching(false);
      setResult(data.result);
    });
  };

  const closeModal = () => {
    setResult(null);
    moveToList({ page: 1 });
  };

  // 파일 삭제 함수
  const deleteFile = (index) => {
    const updatedFiles = event.files.filter((_, i) => i !== index);
    setEvent({
      ...event,
      files: updatedFiles
    });
  };

  return (
    <div className="mr-2 ml-2">
      {fetching ? <FetchingModal /> : null}

      {result ?
        <ResultModal
          title={'Event Add Result'}
          content={`${result}번 등록 완료`}
          callbackFn={closeModal}
        />
        : null
      }
      

      <div className="sm:col-span-5 mb-4 ml-5">
        <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900">
          Title
        </label>
        <div className="mt-2"> 
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-400 sm:max-w-full">
            <input
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              name="title"
              type={'text'}
              value={event.title}
              placeholder="제목을 입력해주세요"
              onChange={handleChangeEvent}
            />
          </div>
        </div>
      </div>
      <div className="col-span-full mb-4 ml-5">
        <label htmlFor="content" className="block text-sm font-bold leading-6 text-gray-900">
          Content
        </label>
        <div className="mt-2">
          <textarea
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            name="content"
            rows="4"
            placeholder="내용을 입력해주세요"
            onChange={handleChangeEvent}
            value={event.content}
          />
        </div>
      </div>
      <div className="col-span-full mb-4 ml-5">
        <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
          upload
        </label>
        <div
          className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-400 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  ref={uploadRef}
                  id="file-upload"
                  name="file-upload"
                  type={'file'}
                  multiple={true}
                  className="sr-only"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
      <div className="col-span-full mb-4 ml-5">
        <label htmlFor="uploaded-files" className="block text-sm font-bold leading-6 text-gray-900">
          Uploaded Files
        </label>
        <ul className="mt-2">
          {event.files.map((file, index) => (
            <li key={index} className="flex items-center">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-12 h-12 object-cover rounded-lg mr-2"
              />
              <span className="text-gray-900">{file.name}</span>
              <button className="ml-2 text-red-500" onClick={() => deleteFile(index)}>
                <XMarkIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* 알림 */}
      {showAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          <strong className="font-bold">알림:</strong>
          <span className="block sm:inline">이미지를 추가해주세요.</span>
        </div>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
          onClick={handleClickAdd}
        >
          글등록
        </button>
      </div>
    </div>
  );
}

export default AddComponent;
