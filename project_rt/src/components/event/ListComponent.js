import { useEffect, useState } from "react";

import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";

import { API_SERVER_HOST } from "../../api/todoApi";
import PageComponent from "../common/PageComponent";
import { getList } from "../../api/eventApi";

const host = API_SERVER_HOST

const initState = {
  dtoList:[],
  pageNumList:[],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
}

const ListComponent = () => {

  const {page, size, refresh, moveToList, moveToRead} = useCustomMove()

  const [serverData, setServerData] = useState(initState)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    setFetching(true)

    getList({page,size}).then(data => {
      console.log(data)
      setServerData(data)
      setFetching(false)
    })

  }, [page,size, refresh])

  return ( 
    <div className="mt-1 mr-2 ml-2">
      
      {fetching? <FetchingModal/> :<></>}

      <div className="flex flex-wrap lg:ml-20 lg:pl-20 mx-auto p-6">

        {serverData.dtoList.map(event => (
          <div
            key={event.eno} 
            className="w-6/12 rounded"
            onClick={() => moveToRead(event.eno)}
          >
            <div className="flex flex-col h-full">
              <div className="text-1xl m-1 p-2 w-full flex flex-col">
                <div className="w-full overflow-hidden" style={{maxWidth: '600px'}}>
                  <img 
                    alt="ev"
                    className="m-auto rounded-md w-full" 
                    src={`${host}/api/event/view/${event.uploadFileNames[0]}`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>

    </div>
  );
}
 
export default ListComponent;

