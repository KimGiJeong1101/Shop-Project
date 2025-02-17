import { useEffect, useRef, useState } from "react";
import { deleteOne, getOne, putOne, API_SERVER_HOST } from "../../api/productApi"
import FetchingModal from "../common/FetchingModal";
import useCustomMove from "../../hooks/useCustomMove";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ResultModal from "../common/ResultModal";


const initState = {
  pname: '',
  pdesc: '',
  price: '',
  stockNumber: '',
  files: [],
  dfiles: [],
  cno: 0

}

const host = API_SERVER_HOST
const ModifyComponent = ({ pno }) => {

  const { moveToList, moveToRead } = useCustomMove()
  const [product, setProduct] = useState(initState)
  const duploadRef = useRef()
  const uploadRef = useRef()

  const query = useQuery(
    ['products', pno],
    () => getOne(pno),
    {
      staleTime: Infinity
    }
  )

  useEffect(() => {

    if (query.isSuccess) {
      setProduct(query.data)
    }

  }, [pno, query.data, query.isSuccess])


  const handleChangeProduct = (e) => {
    product[e.target.name] = e.target.value
    setProduct({ ...product })
  }

  const deleteOldImages = (imageName) => {
    const resultFileNames = product.uploadFileNames.filter(fileName => fileName !== imageName)
    product.uploadFileNames = resultFileNames
    setProduct({ ...product })
  }
  const deleteDoldImages = (imageName) => {
    const resultDfileNames = product.uploadDfileNames.filter(fileName => fileName !== imageName)
    product.uploadDfileNames = resultDfileNames
    setProduct({ ...product })
  }

  const delMutation = useMutation((pno) => deleteOne(pno))
  const queryClient = useQueryClient()
  const handleClickDelete = () => {
    delMutation.mutate(pno)
  }

  const modMutation = useMutation((product) => putOne(pno, product))
  const handleClickModify = () => {
    const files = uploadRef.current.files;
    const dfiles = duploadRef.current.files;
    const formData = new FormData();

    // 파일 배열을 필터링하여 null이나 빈 문자열을 제거하고 FormData에 추가
    Array.from(files).filter(file => file.name).forEach(file => {
      formData.append("files", file);
      console.log("files  : " + file.name);
    });

    Array.from(dfiles).filter(file => file.name).forEach(file => {
      formData.append("dfiles", file);
      console.log("dfiles : " + file.name);
    });

    // 기타 데이터 추가
    formData.append("pname", product.pname);
    formData.append("pdesc", product.pdesc);
    formData.append("price", product.price);
    formData.append("stockNumber", product.stockNumber);
    formData.append("cno", product.cno);

    // 이미지 이름 배열에서 빈 값을 제거하고 추가
    product.uploadFileNames.filter(name => name).forEach(name => {
      formData.append("uploadFileNames", name);
    });

    product.uploadDfileNames.filter(name => name).forEach(name => {
      formData.append("uploadDfileNames", name);
    });

    modMutation.mutate(formData);
  }



  const closeModal = () => {

    if (delMutation.isSuccess) {
      queryClient.invalidateQueries(['products', pno])
      queryClient.invalidateQueries(['products/list'])
      moveToList()
      return
    }

    if (modMutation.isSuccess) {
      queryClient.invalidateQueries(['products', pno])
      queryClient.invalidateQueries(['products/list'])
      moveToRead(pno)
    }

  }
  return (
    <div className="w-full flex justify-center items-center mt-10 border">
      <div className="w-4/6 mx-auto border-0 mt- m-2 p-2">

        {query.isFetching || delMutation.isLoading || modMutation.isLoading ?
          <FetchingModal />
          :
          <></>
        }

        {
          delMutation.isSuccess || modMutation.isSuccess ?
            <ResultModal
              title={'처리 결과'}
              content={'정상적으로 처리되었습니다.'}
              callbackFn={closeModal}>

            </ResultModal>
            :
            <></>
        }
        <div className="sm:col-span-3">

          <div className="flex flex-wrap justify-between items-center mt-4">
            <input
              placeholder="상품이름을 입력하세요"
              type="text"
              name="pname"
              value={product.pname}
              onChange={handleChangeProduct}
              className="block w-full rounded-md mb-1 p-4 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="flex flex-wrap justify-between items-center mt-4">
            <textarea
              placeholder="상품설명을 적어주세요"
              type="text"
              name="pdesc"
              rows="6"
              value={product.pdesc}
              onChange={handleChangeProduct}
              className="block w-full rounded-md mb-1 p-4 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-md resize-none"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="flex flex-wrap justify-between items-center mt-4">
            <input
              placeholder="상품가격을 입력하세요"
              type="number"
              name="price"
              value={product.price}
              onChange={handleChangeProduct}
              className="block w-full rounded-md mb-1 p-4 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="flex flex-wrap justify-between items-center mt-4">
            <input
              placeholder="입고수량을 입력해주세요"
              type="number"
              name="stockNumber"
              value={product.stockNumber}
              onChange={handleChangeProduct}
              className="block w-full rounded-md mb-4 p-4 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-md"
            />
          </div>
        </div>
        <p className="font-extrabold">Product Image</p>
        <input
          type="file"
          className="mt-0 block border border-solid w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4 file:rounded-md
                    file:border-0 file:text-sm file:font-semibold
                    file:bg-indigo-300 file:text-lime-50 shadow-md
                    hover:file:bg-indigo-400"
          ref={uploadRef} multiple={true}
        />
        <p className="font-extrabold">Product Detail Image</p>
        <input
          type="file"
          className=" block border border-solid w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4 file:rounded-md
                    file:border-0 file:text-sm file:font-semibold
                    file:bg-indigo-300 file:text-lime-50 shadow-md
                    hover:file:bg-indigo-400"
          ref={duploadRef} multiple={true}
        />


        <div className="sm:col-span-3">
          <div className="flex flex-wrap justify-between items-center mt-4">
            <select
              name="cno"
              className="p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              onChange={handleChangeProduct}
              value={product.cno || ''}>
              <option value=''>카테고리 선택</option>
              <option value='1'>단일상품</option>
              <option value='2'>세트상품</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
            <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              onClick={handleClickModify}>
              수정 등록
            </button>
            <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              onClick={handleClickDelete}>
              삭제
            </button>
            <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              onClick={moveToList}>
              취소
            </button>
          </div>
        </div>
        <h2 className="font-extrabold text-left">제품 이미지</h2>
        <div className="w-4/5 border rounded-lg  justify-center flex flex-wrap items-start mb-10">
          {product.uploadFileNames && product.uploadFileNames.filter(imgFile => imgFile).map((imgFile, i) => (
            <div className="flex justify-center flex-col w-1/3 overflow-hidden" key={i} style={{ height: '320px' }}>
              <button className="bg-blue-500 text-3xl text-white mb-2"
                onClick={() => deleteOldImages(imgFile)}>
                DELETE
              </button>
              <div style={{ height: '250px' }}> {/* 독립적인 높이 지정으로 이미지 공간 확보 */}
                <img
                  alt="img"
                  src={`${host}/api/products/view/${imgFile}`}
                  className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
        <h2 className="font-extrabold text-left">제품 상세 이미지</h2>
        <div className="w-4/5 border rounded-lg p-4 justify-center flex flex-wrap items-start mb-10">
          {product.uploadDfileNames && product.uploadDfileNames.filter(imgFile => imgFile).map((imgFile, i) => (
            <div className="flex justify-center flex-col w-1/3 overflow-hidden" key={i} style={{ height: '320px' }}>
              <button className="bg-blue-500 text-3xl text-white mb-2"
                onClick={() => deleteDoldImages(imgFile)}>
                DELETE
              </button>
              <div style={{ height: '250px' }}> {/* 독립적인 높이 지정으로 이미지 공간 확보 */}
                <img
                  alt="img"
                  src={`${host}/api/products/view/${imgFile}`}
                  className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>





      </div>
    </div>

  );
}

export default ModifyComponent;