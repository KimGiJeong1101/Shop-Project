import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';
import { API_SERVER_HOST, getOne } from '../../api/productApi';
import FetchingModal from '../../components/common/FetchingModal';
import useCustomCart from "../../hooks/useCustomCart";
import useCustomLogin from '../../hooks/useCustomLogin';
import useCustomMove from '../../hooks/useCustomMove';
import useCustomOrder from '../../hooks/useCustomOrder';
import "./ReadComponent.css";
import { orderState,orderTotalState } from '../../atoms/orderState';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

const host = API_SERVER_HOST

const initState = {
    pno: 0,
    pname: '',
    pdesc: '',
    price: 0,
    uploadFileNames: [],
    uploadDfileNames: []
}
export default function ReadComponent({ pno }) {

    const navigate = useNavigate()
    const [count, setCount] = useState(1);
    const [order, setOrder] = useRecoilState(orderState); // Recoil 상태를 사용
    const [totalPrice, setTotalPrice] = useState(0);
    const { moveToList, moveToModify } = useCustomMove()
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const { isFetching, data, isError, isFetched } = useQuery(
        ['products', pno], //useQuery에서 쓰는 key값
        () => getOne(pno), // api함수 호출
        {
            staleTime: 1000 * 10 * 60, //10분동안 데이터유지후 다시 읽음, 데이터 가지고올때 실패시 재시도횟수1
            retry: 1
        }
    )
    const products = data || initState
    useEffect(() => {
        // 주문 금액 계산
        setTotalPrice(count * products.price);
    }, [count, products.price]);
    const [showModal, setShowModal] = useState(false);
    const [filteredUploadFileNames, setFilteredUploadFileNames] = useState([]);
    const [showAddedModal, setShowAddedModal] = useState(false); // ★장바구니 새 상품 추가 모달

    const { loginState } = useCustomLogin();

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // 이미지 클릭시 모달 토글 함수
    const closeModal = () => {
        setShowModal(false);
        setShowAddedModal(false); //★
    };


    const isOnlyUser = Array.isArray(loginState.roleNames) && loginState.roleNames.length === 1 && loginState.roleNames.includes('USER');
    const canModify = Array.isArray(loginState.roleNames) && loginState.roleNames.includes('ADMIN');

    useEffect(() => {
        setFilteredUploadFileNames(products.uploadFileNames.filter(imgFile => imgFile !== null));
        window.scrollTo(0, 0);
    }, [products.uploadFileNames]);
    const [slide, setSlide] = useState(0);
    const nextSlide = () => {
        const newSlideIndex = slide === filteredUploadFileNames.length - 1 ? 0 : slide + 1;
        // 현재 슬라이드를 왼쪽으로 이동시키고, 다음 슬라이드를 활성화
        updateSlides(slide, newSlideIndex);
    }

    const prevSlide = () => {
        const newSlideIndex = slide === 0 ? filteredUploadFileNames.length - 1 : slide - 1;
        // 현재 슬라이드를 오른쪽으로 이동시키고, 이전 슬라이드를 활성화
        updateSlides(slide, newSlideIndex);
    }
    const updateSlides = (oldIndex, newIndex) => {
        const slides = document.querySelectorAll('.slide-container');
        slides[oldIndex].classList.add(newIndex > oldIndex ? 'left-hidden' : 'hidden');
        slides[newIndex].classList.remove('hiddenImag', 'left-hidden');
        slides[newIndex].classList.add('activeImg');
        setSlide(newIndex);
    }

    const { changeCart, cartItems } = useCustomCart() //★장바구니 usecustomcart

    const handleClickaddCart = () => { //★장바구니 추가버튼 메서드
        // let count = 1

        const addedItem = cartItems.filter(item => item.pno === parseInt(pno))[0]

        if (addedItem) {
            if (window.confirm("장바구니에 동일한 상품이 있습니다.\n장바구니에 추가하시겠습니까?") === false) {
                return
            }
            // count = count
            window.location.href = '/cart'; // ★장바구니로 바로 이동(동일 상품 추가시)
        } else {
            setShowAddedModal(true);
        }

        changeCart({ email: loginState.email, pno: pno, count: count })
    }

    const handleClickOrder = () => {
        
        const orderData = {
            productPno: parseInt(pno),
            count: count,
            price: products.price,
            pname: products.pname,
            images: products.uploadFileNames
        };
        console.log("Adding order:", orderData);
        // 주문 데이터를 초기화하고 새로운 주문을 추가합니다.
        setOrder(() => [orderData]); // 기존의 모든 주문을 제거하고 새 주문으로 대체합니다.
        
        navigate('/order'); // 주문 페이지로 이동
    };
    
    return (

        <div className="bg-white" >
            {isFetching ? <FetchingModal /> : <></>}
            <div className="pt-6">
                {/* 왼쪽 컨텐츠 이미지 나오는곳*/}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-8">
                        <div className="flex justify-center carousel relative"> {/* relative 위치 추가 */}
                            {filteredUploadFileNames.map((imgFile, i) => (
                                <div key={i} className={`slide-container ${slide === i ? "activeImg" : "hiddenImg"}`} style={{ width: '33%' }}>
                                    <BsArrowLeftCircleFill 
                                        className='arrow arrow-left cursor-pointer' 
                                        onClick={() => prevSlide(i)}
                                        style={{ zIndex: 0 }}
                                    />
                                    <img
                                        alt="product"
                                        className="slide"
                                        src={`${host}/api/products/view/${imgFile}`}
                                    />
                                    <BsArrowRightCircleFill 
                                        className='arrow arrow-right cursor-pointer' 
                                        onClick={() => nextSlide(i)}
                                        style={{ zIndex: 0 }}
                                    />
                                </div>
                            ))}
                            <span className='indicators absolute bottom-0 w-full flex justify-center p-2'>
                                {filteredUploadFileNames.map((_, idx) => (
                                    <button key={idx} onClick={() => setSlide(idx)} className={slide === idx ? "indicator" : "indicator indicator-inactive"}></button>
                                ))}
                            </span>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        {/* 오른쪽 컨텐츠 */}
                        <div className="flex flex-wrap justify-left font-extrabold text-2xl">
                            {products.pname}
                        </div>
                        <div className="mt-4 flex flex-wrap justify-left font-extrabold text-sm">
                            {products.pdesc}
                        </div>
                        <div className="mt-4 flex flex-wrap justify-left font-extrabold text-xl">
                            {formatPrice(products.price)}원
                        </div>
                        <div className="mt-6 flex flex-wrap justify-left font-extrabold text-sm">
                            <p>배송방법&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;택배</p>
                        </div>
                        <div className="mt-2 flex flex-wrap justify-left font-extrabold text-sm">
                            <p>배송비&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3000원(30,000원 이상 구매시 무료)</p>
                        </div>
                        <hr className="w-full border-t-1 border-gray-300 my-2" />
                        <div className="mt-3 flex">
                            <h2 className='font-extrabold text-center mt-3'>구매수량</h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button
                            className="m-1 p-1 text-2xl w-8 rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => setCount(prev => Math.max(1, prev - 1))} // 최소값 1을 유지
                            >
                            -
                            </button>
                            <input
                                type="number"
                                className="m-1 p-1 text-2xl w-12 text-center rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={count}
                                onChange={e => {
                                    const newValue = parseInt(e.target.value, 10);
                                    setCount(newValue >= 1 ? newValue : 1); // 입력값이 1보다 작을 때 1로 설정
                                }}
                                min={1} // 입력 필드의 최소값 설정
                            />
                            <button
                                className="m-1 p-1 text-2xl w-8 rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setCount(prev => prev + 1)} // 숫자를 증가
                            >
                                +
                            </button>
                            {/* 결제 금액 표시 */}
                            <div className="ml-4 font-extrabold text-xl mt-3">
                                {formatPrice(totalPrice)}원
                            </div>
                          </div>
                        <hr className="w-full border-t-1 border-gray-300 my-2" />
                        <div className="mt-4">

                            {isOnlyUser && (
                                <button
                                    className="w-full flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-extrabold text-white shadow-sm hover:bg-gray-800"
                                    onClick={handleClickaddCart}
                                >
                                    장바구니 담기
                                </button>
                            )}
                        </div>
                        <div className="mt-2">
                            <button
                                className="w-full flex items-center justify-center rounded-md border-2 border-black bg-white px-6 py-3 text-base font-extrabold text-black shadow-sm hover:bg-gray-100"
                                onClick={handleClickOrder}>
                                구매하기
                            </button>
                        </div>

                        {/*모달창 버튼이미지  */}
                        <div className="mt-6 border rounded">
                            <img
                                src="/img/BN.png"
                                alt="Open Modal"
                                className="cursor-pointer hover:opacity-80"
                                onClick={toggleModal}
                            />

                            {showModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
                                        <img
                                            src="/img/modal.png"
                                            alt="Modal"
                                            className="mb-4 cursor-pointer"
                                            onClick={closeModal}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* 모달창 버튼 이미지 end */}
                        <div className="relative mb-4 flex p-4 flex-wrap items-stretch">

                            {canModify && (
                                <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                                    onClick={() => moveToModify(pno)}>
                                    상품 수정
                                </button>
                            )}

                            {canModify && (
                                <button className=" m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                                    onClick={moveToList}>
                                    취소
                                </button>
                            )}

                            {/* ★장바구니 새 상품 추가 모달 */}
                            {showAddedModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
                                        <p className="text-lg font-bold">장바구니에 추가되었습니다.</p>
                                        <button
                                            className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                                            onClick={closeModal}
                                        >
                                            확인
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                {/* 오른쪽 컨텐츠 End */}
                {/* 밑에 상세이미지 나오는 부분 */}
                <hr className="mt-20 w-full border-t-1 border-gray-300 my-2" />
                <div className="col-span-12 md:col-span-8 flex justify-center items-center">
                    <div className="mt-12 flex flex-col justify-center items-center">
                        {products.uploadDfileNames.filter(imgFile => imgFile !== null).map((imgFile, i) =>
                            <img
                                alt="product"
                                key={i}
                                className="p-0 w-1/2"
                                src={`${host}/api/products/view/${imgFile}`}
                            />
                        )}
                    </div>
                </div>




            </div>
        </div>
    )
}