import { useEffect, useState } from "react"
import { getOne } from "../../api/eventApi"
import { API_SERVER_HOST } from "../../api/todoApi"
import useCustomMove from "../../hooks/useCustomMove"
import FetchingModal from "../common/FetchingModal"
import { useLocation } from "react-router-dom";
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import signinState from "../../atoms/signinState"
import { useRecoilValue } from "recoil"


// Define initState within the component
const initState = {
  eno: 0,
  title: '',
  content: '',
  regdate: '',
  uploadFileNames: []
};

const ReadComponent = ({ eno }) => {
  const location = useLocation();

  const [event, setEvent] = useState(initState);

  const userInfo = useRecoilValue(signinState);


  const [fetching, setFetching] = useState(false);
  const host = API_SERVER_HOST;

  // Import moveToList and moveToModify from useCustomMove hook
  const { moveToList, moveToModify } = useCustomMove();

  useEffect(() => {
    setFetching(true);
    getOne(eno).then(data => {
      setEvent(data);
      setFetching(false);
    });
  }, [eno]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었어요.");
    } catch (err) {
      console.log(err);
    }
  };

  const baseUrl = window.location.origin;


  const isAdmin = Array.isArray(userInfo.roleNames) && (userInfo.roleNames.includes('ADMIN') || userInfo.roleNames.includes('MANAGER'));

  return (
    <div className="mt-1 mr-2 ml-2">
      {fetching ? <FetchingModal /> : null}

      <div className="flex justify-center mb-4">
        <div className="w-5/6 p-6 border-t border-b">
          <h1 className="text-3xl mb-1">{event.title}</h1>
          <div className="flex">
            <div className="text-xs">작성일 : {formatDate(event.regdate)}</div>
            <div
              className="button-container"
              onClick={() => handleCopyClipBoard(`${baseUrl}${location.pathname}`)}
            ><ArrowTopRightOnSquareIcon className="h-4 w-4 ml-8"></ArrowTopRightOnSquareIcon></div>
          </div>

        </div>
      </div>


      <div className="flex justify-center">
        <div className="w-5/6 p-6 ">
          {event.content}
        </div>
      </div>

      <div className="w-full justify-center flex  flex-col m-auto items-center">
        {event.uploadFileNames.map((imgFile, i) =>
          <img
            alt="event"
            key={i}
            className="p-4 w-1/2"
            src={`${host}/api/event/view/${imgFile}`} />
        )}
      </div>
      <div className="flex justify-center">
        <div className="w-5/6 p-6 border-b">
        </div>
      </div>

      <div className="flex justify-between p-4 mx-10">
        <button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-2 text-sm shadow-sm hover:bg-gray-100"
          onClick={moveToList}
        >
          목록
        </button>


        {isAdmin && (
          <button
            type="button"
            className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
            onClick={() => moveToModify(eno)}
          >
            글수정
          </button>

        )}
      </div>
    </div>
  )
}

export default ReadComponent;