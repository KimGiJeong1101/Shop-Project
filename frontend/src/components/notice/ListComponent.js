import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";
import { useEffect, useState } from "react";
import { getList } from "../../api/noticeApi";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  prevPage: 0,
  nextPage: 0,
  next: false,
  totalCount: 0,
  totalPage: 0,
  current: 0,
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};

const ListComponent = () => {
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    getList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
      setFetching(false);
    });
  }, [page, size, refresh]);

  return (
    <div className="px-20">
      {fetching && <FetchingModal />}
      <div className="flex flex-col mx-auto">
        {serverData.dtoList.map((notice, index) => (
          <div key={notice.nno} className="w-full min-w-[400px] my-1">
            <div className="flex flex-col h-full bg-white p-4 border-b-2 border-gray-300">
              <div className="flex items-center justify-between">
                <div className="w-1/4 text-base">
                  {serverData.totalCount -
                    (serverData.current - 1) * size -
                    index}
                </div>
                <div className="w-1/2 font-bold text-base">
                  <span
                    className="cursor-pointer hover:underline hover:text-blue-500"
                    onClick={() => moveToRead(notice.nno)}
                  >
                    {notice.ntitle}
                  </span>
                </div>
                <div className="w-1/4 text-center text-base">
                  {formatDate(notice.regDate)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PageComponent serverData={serverData} movePage={moveToList} />
    </div>
  );
};

export default ListComponent;
