import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import { getList, deleteOne } from "../../api/reviewApi";
import { data } from "autoprefixer";
import AddComponent from "./AddComponent";
import { useRecoilValue } from "recoil";
import signinState from "../../atoms/signinState";

const initState = {
  reviewDTOList: []
}


const ListComponent = ({ pno }) => {
  console.log(pno)
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove()
  const [serverData, setServerData] = useState([])
  const userInfo = useRecoilValue(signinState)
  console.log(userInfo)
  /* const d = userInfo.roleNames.includes(''); */

  const [fetching, setFetching] = useState(false)
  const [register, setRegister] =useState(false)

  const navigate = useNavigate()

  const handleClickAdd =()=>{
    setRegister(true)
  }
  const goBack = () => {
    setRegister(false)
}


  useEffect(() => {
    // getList 함수의 파라미터는 페이지 번호와 사이즈를 포함한 객체여야 합니다.
    getList(pno, { page, size }).then(data => {
      setServerData(data)
      console.log(serverData)
      setFetching(false)
    }).catch(error => {
      console.error('Error fetching data: ', error)
      setFetching(false)
    })
  }, [page, size, refresh, pno])

  { console.log("-----------------------") }
  { console.log(serverData) }
  { console.log("-----------------------") }

  // 리뷰 삭제 함수
  const handleDelete = async (rno) => {
    try {
      await deleteOne(rno);
      // 삭제 후 데이터를 다시 불러옵니다.
      refreshData();
    } catch (error) {
      console.error('Error deleting review: ', error);
    }
  }

  // 데이터를 불러오는 함수
  const refreshData = () => {
    getList(pno, { page, size }).then(data => {
      setServerData(data);
      setFetching(false);
    }).catch(error => {
      console.error('Error fetching data: ', error);
      setFetching(false);
    });
  }

  useEffect(() => {
    refreshData();
  }, [page, size, refresh, pno]);

  return (

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-0" style={{width: '1000px', zIndex:-10}}>

      {fetching ? <FetchingModal /> : null}
      

      <div className="mx-auto max-w-2xl lg:mx-0 mt-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">상품 리뷰</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          상품을 구매하신 분들이 작성하신 리뷰입니다.
        </p>
        {register ? <AddComponent pno={pno} goBack={goBack}  /> : null }
      </div>


      <div className="w-full flex justify-end items-start mb-5">
        <></>
        {/* {d &&( 상품 구매자만 체크 */}
        <div className="p-5" onClick={handleClickAdd}>
          <button className="px-5 py-2.5 relative rounded group font-medium text-white inline-block bg-gradient-to-br from-purple-600 to-blue-500">
            <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm"></span>
            <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50"></span>
            <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
            <span className="relative">리뷰 작성</span>
          </button>
        </div>
        {/* )} */}
      </div>


      {serverData.map((review) => (
        <li key={review.rno} className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-8 sm:pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >

          <div className="flex max-w-xl flex-col items-start justify-between ">
            <h3 className="text-sm text-gray-700 ">
              <span aria-hidden="true" className="absolute inset-0 " />
              {'⭐'.repeat(review.grade) + '☆'.repeat(5 - review.grade)}
            </h3>

            <p className="text-sm leading-6 text-gray-900">{review.reviewContent.length > 20 ? review.reviewContent.substring(0, 40) + "..." : review.reviewContent}</p>
            <span className="mt-1 text-xs leading-5 text-gray-500">{review.email.split("@")[0]}</span>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Last seen {review.modDate.split("T")[0]}
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 cursor-pointer" onClick={()=>handleDelete(review.rno)}>삭제하기</p>

          </div>

        </li>
      ))}

      
    </div>
  );
}

export default ListComponent;
