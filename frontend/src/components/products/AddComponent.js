import {useState, useRef} from "react";
import { postAdd } from "../../api/productApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const initState = {
    pname : '',
    pdesc : '',
    price : '',
    stockNumber : '',
    files : [],
    dfiles : [],
    cno : 0
}

const Addcomponent = () => {
    const [product,setProduct] = useState({...initState})
    const uploadRef = useRef()
    const duploadRef = useRef()
    const {moveToList} = useCustomMove()//이동을 위한 함수
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }
    // 파일 상태를 설정하는 함수


      // 상품 정보 입력값 변경 시 호출되는 함수
      const handleChangeProduct = (e) => {
        product[e.target.name] = e.target.value
        
        setProduct({...product})
    }
    const handleChangeFile = (event) => {
      const files = Array.from(event.target.files); // 파일 리스트를 배열로 변환
      setProduct(prev => ({ ...prev, [event.target.name]: files }));
  };


    const addMutation = useMutation((product) => postAdd(product))// 리액트 쿼리
    /* 파일 업로드 버튼 클릭 시 호출되는 함수 */
    const handleClickAdd = (e) => {

    const files = uploadRef.current.files; 
    const dfiles = duploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
        console.log("files  : "+files[i].name)
    }
    for (let i =0; i< dfiles.length; i++){
        formData.append("dfiles", dfiles[i]);
        console.log("dfiles : "+dfiles[i].name)
    }
    //other Data
    formData.append("pname", product.pname);
    formData.append("pdesc", product.pdesc);
    formData.append("price", product.price);
    formData.append("stockNumber", product.stockNumber);
    formData.append("cno", product.cno);
    
    addMutation.mutate(formData)//코드변경 mutate함수를 실행하면 mutation이 실행되고
                                // mutation이 실행되는 동안 isLoading 속성이 true
                                // mutation 이 성공하면 isSuccess 속성이 true
                                // mutation 이 실패하면 isError 속성이 true
    }
    const queryClient = useQueryClient()
    const closeModal = () =>{
        queryClient.invalidateQueries("products/list")
        moveToList({page:1})//모달 창이 닫히면 이동
    }
    return(
        <div className="w-full flex justify-center items-center mt-10 border">
        <div className="w-4/6 mx-auto border-0 mt- m-2 p-2">

            {addMutation.isLoading ? <FetchingModal/>:<></>}
            {addMutation.isSuccess ? <ResultModal
            title = {'Add Result'}
            content= {`Add Success ${addMutation.data.result}`}
            callbackFn={closeModal}/>:<></>
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
                    ref={uploadRef} multiple={true} onChange={handleChangeFile}
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
                onChange={handleChangeProduct}>
                  <option value=''>카테고리 선택</option>
                  <option value='1'>단일상품</option>
                  <option value='2'>세트상품</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
                <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                     <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                      onClick={handleClickAdd}>
                         상품 등록
                     </button>
                     <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                     onClick={goBack}>
                         취소
                     </button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Addcomponent;