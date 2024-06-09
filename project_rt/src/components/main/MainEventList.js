import { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import { getList } from "../../api/eventApi";
import { Link } from "react-router-dom";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
const host = API_SERVER_HOST

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

const MainEventList = () => {

  const { page, size, refresh, moveToList, moveToReadEvent } = useCustomMove()

  const [serverData, setServerData] = useState(initState)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    setFetching(true)

    getList({ page, size }).then(data => {
      console.log(data)
      setServerData(data)
      setFetching(false)
    })

  }, [page, size, refresh])

  return (
    <div>

      {fetching ? <FetchingModal /> : <></>}

      <div className="bg-slate-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-12 lg:max-w-none lg:py-18">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Event</h2>
              <h2 className="text-base font-bold text-gray-900"><Link to="/event">더보기<span aria-hidden="true">&rarr;</span></Link></h2>
            </div>


            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {serverData.dtoList.slice(0, 3).map((event) => (
                <div key={event.title} className="group relative">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <img
                      src={`${host}/api/event/view/${event.uploadFileNames[0]}`}
                      alt={`${host}/api/event/view/${event.uploadFileNames[0]}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500" onClick={() => moveToReadEvent(event.eno)} style={{ cursor: "pointer" }}>

                    <span className="absolute inset-0" />
                    {event.title}

                  </h3>
                  <p className="text-base font-semibold text-gray-900">{event.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainEventList;