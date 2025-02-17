import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import PasswordCheckModal from "../common/PasswordCheckModal";
import signinState from "../../atoms/signinState";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { getList } from "../../api/askApi";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);

  return `${year}-${month}-${day}`;
};

const ListComponent = () => {
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [listData, setListData] = useState(initState);
  const [selectAno, setSelectAno] = useState(null);
  const [show, setShow] = useState(false);
  const userInfo = useRecoilValue(signinState);

  useEffect(() => {
    getList({ page, size }).then(data => {
      setServerData(data);
      setListData(data);
    });
  }, [page, size, refresh]);

  const handleClickAsk = (ano) => {
    const selectPost = serverData.dtoList.find(post => post.ano === ano);
    if (selectPost && !selectPost.password || userInfo.roleNames.includes('ADMIN') || userInfo.roleNames.includes('MANAGER')) {
      moveToRead(ano);
    } else {
      setSelectAno(ano);
      setShow(true);
    }
  };

  const onClose = () => {
    setShow(false);
  };

  window.scrollTo({ top: 0 });

  return (
    <div className="px-20">
      {show && (
        <PasswordCheckModal
          moveToRead={moveToRead}
          listData={listData}
          selectAno={selectAno}
          show={show}
          onClose={onClose}
        />
      )}

      <div className="flex flex-col mx-auto">
        {serverData.dtoList.map(ask => (
          <div key={ask.ano} className="w-full min-w-[400px] my-1">
            <div className="flex flex-col h-full bg-white p-4 border-b-2 border-gray-300">
              <div className="flex items-center justify-between">
                <div className="w-1/12 text-base">{ask.ano}</div>
                <div className="w-6/12 font-bold text-base">
                  <span
                    className="cursor-pointer hover:underline hover:text-blue-500"
                    onClick={() => handleClickAsk(ask.ano)}
                  >
                    {ask.title} {ask.password && <span>🔒</span>}
                  </span>
                </div>
                <div className="w-2/12 text-right text-base">
                  {ask.writer.split("@")[0]}
                </div>
                <div className="w-3/12 text-center text-base">
                  {formatDate(ask.regDate)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
    </div>
  );
};

export default ListComponent;
