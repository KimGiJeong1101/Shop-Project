import { getListOne, API_SERVER_HOST } from "../../api/productApi"
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { singleProductState } from "../../atoms/productState";
import { Link } from 'react-router-dom';

const host = API_SERVER_HOST

const ListComponent = () => {

  const { page, size, refresh, moveToListOne, moveToRead,moveToReadProduct } = useCustomMove()
  const [product, setProduct] = useRecoilState(singleProductState)
  const [ImageIndex, setImageIndex] = useState(0)
  const [hovered, setHovered] = useState(false);
  const { isFetching: isFetchingOne, data: dataOne, error: errorOne, isError: isErrorOne } = useQuery(
    ['products/listone', { page, size: 12, refresh }],   //key값 page,size,refresh 요소가 변경될때마다 렌더링됨
    () => getListOne({ page, size: 12 }), //page,size를 파라미터로해서 getList호출
    { staleTime: 1000 * 5 }   // 5초동안 신선한 데이터임 5초후에 리렌더링

    //useQuery로부터 반환받는 객체가 isFetching,data,error,isError를 받는데
    // isFetching은 데이터를 불러올때, data는 요청이 성공적으로 완료되면 저장되는곳
    // error는 요청중 에러가 발생했을때 에러반환값이 저장되고
    // isError는 요청이 에러를 반환했을때 불리언값으로 답을줌 에러나면 True로 반환
  )
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  const handlePurchaseClick = (event, pno) => {
    event.stopPropagation(); // Stop event bubbling
    // 구매 로직을 실행하세요.
    console.log("구매 처리", pno);
  };

  const handleAddToCartClick = (event, pno) => {
    event.stopPropagation(); // Stop event bubbling
    // 장바구니 추가 로직을 실행하세요.
    console.log("장바구니 추가", pno);
  };
  useEffect(() => {
    if (dataOne) {
      setProduct(prevData => ({ ...prevData, ...dataOne }))
    }
  }, [dataOne, setProduct])

  const handleClickPage = (pageParam) => {
    // if(pageParam.page === parseInt(page)){
    //   queryClient.invalidateQueries("products/list")
    // }
    moveToListOne(pageParam)
  }
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  if (isErrorOne) {
    console.log(errorOne)
    return
  }

  const serverData = dataOne || product

  return (<>
    <div className="w-full flex justify-center items-center p-2 border-2">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-gray-900">All</h2>
            <h2 className="text-base font-bold text-gray-900"><Link to="/products">더보기<span aria-hidden="true">&rarr;</span></Link></h2>
          </div>


          {isFetchingOne ? <FetchingModal /> : <></>}
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {serverData.dtoList.slice(0,4).map((product) => (

              <div key={product.pno} className="group relative " onClick={() => moveToReadProduct(product.pno)} style={{ cursor: "pointer" }}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave} >
                  <img
                    src={`${host}/api/products/view/${product.uploadFileNames[ImageIndex]}`}
                    alt='product'
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"

                  />
                </div>
                <div className="mt-4 flex flex-col"> {/* 위아래로 배치하기 위해 flex-col 클래스 추가 */}
                  <div>
                    <h3 className="text-sm text-gray-700 font-extrabold overflow-hidden whitespace-nowrap truncate" style={{ maxWidth: '250px' }}>
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.pname}
                      </a>
                    </h3>
                    {/* product.pname 요소 */}
                    <p className="mt-1 text-sm font-extrabold text-gray-500 overflow-hidden whitespace-nowrap truncate"
                      style={{ maxWidth: '250px' }}>
                      {product.pdesc}
                    </p>
                  </div>
                  <div className="mt-auto"> {/* 위쪽 여백을 자동으로 채우기 위해 mt-auto 클래스 추가 */}
                    {/* product.price 요소 */}
                    <p className="font-bold text-md text-gray-900">{formatPrice(product.price)}원</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>

  </>


  );

}

export default ListComponent;