import { useEffect, useState } from "react";
import { getList } from "../../api/askApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import PasswordCheckModal from "../common/PasswordCheckModal";
import signinState from "../../atoms/signinState";
import { useRecoilValue } from "recoil";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
}


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);  // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = (`0${date.getDate()}`).slice(-2);

  return `${year}-${month}-${day}`;
}

const ListComponent = () => {
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [listData, setListData] = useState(initState);
  const [selectAno, setSelectAno] = useState(null);
  const [show, setShow] = useState(false);
  const userInfo = useRecoilValue(signinState); // 유저 정보 Recoil에서 가져오기

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

  window.scrollTo({ top: 0 }); // 맨위로 가기

  return (
    <div className="border-2 border-gray-200 rounded mt-10 mr-2 ml-2">
      {show ? (
        <PasswordCheckModal
          moveToRead={moveToRead}
          listData={listData}
          selectAno={selectAno}
          show={show}
          onClose={onClose}
        />) : <></>
      }

<div className="flex flex-wrap mx-auto justify-center p-6">

{serverData.dtoList.map(ask =>

  <div
    key={ask.ano}
    className="w-full min-w-[400px]  p-2 m-2 rounded shadow-md"
     //이벤트 처리 추가 
  >
    <div className="flex">
      <div className="font-extrabold text-2xl p-2 w-1/12">
      </div>
      <div className="text-1xl m-1 p-2 w-8/12 font-extrabold"
      onClick={() => handleClickAsk(ask.ano)}>
        {ask.title} {ask.password && <span>🔒</span>}
      </div>
      <div className="text-l p-2 w-1/12">
        {ask.writer.split("@")[0]}
      </div>
      <div className="text-1xl m-1 p-2 w-2/10 font-medium">
      {formatDate(ask.regDate)}
      </div>
    </div>
  </div>
)}
</div>

<PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
    </div>
  );
};


export default ListComponent;