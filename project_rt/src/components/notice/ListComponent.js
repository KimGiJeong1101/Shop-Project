import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import PageComponent from "../common/PageComponent";
import { useEffect, useState } from "react";
import { getList } from "../../api/noticeApi";

const host = API_SERVER_HOST

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    prevPage: 0,
    nextPage: 0,
    next: false,
    totoalCount: 0,
    totalPage: 0,
    current: 0
}

const ListComponent = () => {
    const { page, size, refresh, moveToList, moveToRead } = useCustomMove()
    //serverData는 나중에 사용
    const [serverData, setServerData] = useState(initState) //useState 상수의 초기값을 설정하겠다는 의미 initState은 위에 있는거
    //for FetchingModal
    const [fetching, setFetching] = useState(false)
    useEffect(() => {
        setFetching(true)
        getList({ page, size }).then(data => {
            console.log(data)
            setServerData(data)
            setFetching(false)
        })
    }, [page, size, refresh])
    //[page, size, refresh]는 useEffect 훅의 의존성 배열(dependency array)을 나타냅니다. 
    //이 배열은 useEffect가 실행되어야 하는 조건을 결정
    //page, size, refresh 중 하나라도 값이 변경되면 useEffect 내의 코드가 실행됩니다. 
    //이 배열을 사용하여 useEffect를 특정 상황에만 실행하도록 제어할 수 있습니다.

    return (
        <div className="px-60 ">
            {fetching ? <FetchingModal /> : <></>}
            <div className="flex flex-wrap mx-auto ">
                {serverData.dtoList && serverData.dtoList
                    .map((notice, index) =>
                        <div
                            key={notice.nno}
                            className="w-full min-w-[400px]  "
                            onClick={() => moveToRead(notice.nno)}
                        >
                            <div className="flex flex-col  h-full">
                                <div className="text-1xl  w-full flex flex-col ">
                                    <div className="font-extrabold bg-white px-20 ">
                                        <div className="pb-7 flex px-10 min-w-[400px] ml-10">
                                            <div className="w-1/4 pl-2">{((serverData.totalCount - (serverData.current - 1) * size) - index)}</div> {/* 각 공지사항에 대한 번호 표시 */}
                                            <div className="w-1/2 pl-12 ml-20">{notice.ntitle}</div>{/* 제목 */}
                                            {/* <div className="w-2/2 pl-32">{notice.nwriter}</div>작성자 */}
                                        </div>
                                        <div className="border-t border-gray-400 text-3xl font-extrabold pt-4 pb-4 flex min-w-[400px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </div>
    );
}

export default ListComponent;