import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk'; //npm install @tosspayments/payment-sdk
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { API_SERVER_HOST } from '../../api/productApi';
import { orderState } from '../../atoms/orderState';
import useCustomLogin from '../../hooks/useCustomLogin';
import useCustomOrder from '../../hooks/useCustomOrder';
import "./OrderComponent.css";
import { useRecoilState } from 'recoil';
import signinState from "../../atoms/signinState";

const host = API_SERVER_HOST;

const OrderComponent = () => {
    const { isLogin, loginState } = useCustomLogin();
    const orders = useRecoilValue(orderState);
    const navigate = useNavigate();
    const { addOrder, cartOrder } = useCustomOrder();
    const [member, setMember] = useRecoilState(signinState);
    const [localAddress, setLocalAddress] = useState(member.useraddress || '');
    const [localDetailAddress, setLocalDetailAddress] = useState(member.detailaddress || '');
    const [localPhone, setLocalPhone] = useState(member.phone || '');
    const [dname, setDname] = useState("");
    const [deliveryMemo, setDeliveryMemo] = useState('빠른배송 부탁드립니다');
    const formatPrice = (price) => {if (price === undefined) {return price;}return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};

    useEffect(() => {
        setLocalAddress(member.useraddress || '');
        setLocalDetailAddress(member.detailaddress || '');
        setLocalPhone(member.phone || '');
    }, [member.useraddress, member.detailaddress, member.phone]);
    // useMemo를 사용하여 주문의 총 가격을 계산합니다.
    const totalPrice = useMemo(() => {
        return orders.reduce((sum, order) => sum + order.price * order.count, 0);
    }, [orders]);
    const handleDnameChange = (event) => {
        setDname(event.target.value);
    };

    //원래코드
    // const handleDeliveryMemoChange = (event) => {
    //     setDeliveryMemo(event.target.value);
    // };


    /////직접 입력하기///////////////////
    const [directInput, setDirectInput] = useState(false); // 직접 입력 폼이 열려있는지 여부를 관리하는 상태

    // 직접 입력 폼이 열리고 닫힐 때 상태를 변경하는 함수
    const toggleDirectInput = () => {
        setDirectInput(!directInput);
    };

    // 배송 메모를 변경할 때 호출되는 함수
    const handleDeliveryMemoChange = (event) => {
        const value = event.target.value;
        if (value === '직접입력하기') {
            toggleDirectInput(); // 직접 입력 폼을 열도록 상태를 변경
        } else {
            setDeliveryMemo(value); // '직접입력하기'가 아닌 경우 배송 메모 상태를 변경
        }
    };




    const deliveryFee = totalPrice === 0 || totalPrice >= 30000 ? 0 : 3000; // 배송비 설정
    const widgetClientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; //★토스페이먼츠 시험키
    // const widgetClientKey = "test_ck_DpexMgkW36wNW9BqPpndVGbR5ozO";// ★토스페이먼츠 내키
    const customerKey = loginState.email; //★토스페이먼츠
    const [paymentWidget, setPaymentWidget] = useState(null);//★토스
    const paymentMethodsWidgetRef = useRef(null);//★토스

    //------------------결제0.토스페이 페이지형-------------------------------------------------------------



    useEffect(() => {
        const fetchPaymentWidget = async () => {
            try {
                const loadedWidget = await loadPaymentWidget(widgetClientKey, customerKey);
                setPaymentWidget(loadedWidget);
            } catch (error) {
                console.error("Error fetching payment widget:", error);
            }
        };

        fetchPaymentWidget();
    }, []);



    useEffect(() => {
        if (paymentWidget == null) {
            return;
        }

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            "#payment-widget",
            { value: (totalPrice+deliveryFee) },
            { variantKey: "DEFAULT" }
        );

        paymentWidget.renderAgreement(
            "#agreement",
            { variantKey: "AGREEMENT" }
        );

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }, [paymentWidget, (totalPrice+deliveryFee)]);



    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;

        if (paymentMethodsWidget == null) {
            return;
        }

        paymentMethodsWidget.updateAmount(totalPrice);
    }, [totalPrice]);



    const handleClickOrder = async () => {

        try {
            const orderName1 = orders.map(item => item.pname).join(', ');
            // 주문 정보를 DB에 넘김
            console.log('전달된 아이템의 개수가 몇개인지 콘솔에 표시하면' + orders.length);
            if (orders.length === 1) {
                // 결제 성공 후, 주문 정보를 DB에 저장
                const order = orders[0];
                await addOrder({
                    productPno: order.productPno,
                    count: order.count,
                    dname: dname,
                    deliveryAddress: localAddress,
                    detailAddress: localDetailAddress,
                    tel: localPhone,
                    dmemo: deliveryMemo,
                    totalOrderPrice: totalPrice + deliveryFee
                });
                await paymentWidget?.requestPayment({
                    orderId: "testorderid",
                    orderName: orderName1,
                    customerName: "Null",
                    customerEmail: "Null",
                    customerMobilePhone: "01012341234",
                    successUrl: `${window.location.origin}/order/success`,
                    failUrl: `${window.location.origin}/fail`,
                });
            } else if (orders.length > 1) {
                // 주문이 여러 개인 경우
                const cartOrderDTOList = orders.map(order => ({
                    productPno: order.productPno,
                    count: order.count,
                    cino: order.cino
                }));

                const orderData = {
                    cartOrderDTOList: cartOrderDTOList,
                    dname: dname,
                    deliveryAddress: localAddress,
                    detailAddress: localDetailAddress,
                    tel: localPhone,
                    dmemo: deliveryMemo,
                    totalOrderPrice: totalPrice + deliveryFee
                };

                await cartOrder(orderData); // 수정된 객체 구조를 cartOrder 함수에 전달
                await paymentWidget?.requestPayment({
                    orderId: "testorderid",
                    orderName: orderName1,
                    customerName: "Null",//orderName
                    customerEmail: "Null",
                    customerMobilePhone: "01012341234",
                    successUrl: `${window.location.origin}/order/success`,
                    failUrl: `${window.location.origin}/fail`,
                });
            }
            const orderName = orders.map(item => item.pname).join(', ');



        } catch (error) {
            console.error('Order processing failed:', error);
            // 에러 처리: 사용자에게 오류 메시지를 보여주거나 로깅할 수 있습니다.
        }

    };

    /////카카오 주소 API////////////
    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                // 주소 입력 처리
                setLocalAddress(data.address); // 'localAddress' 상태를 업데이트하여 주소를 입력받습니다.
                // 상세 주소 입력란에 자동 포커싱
                document.querySelector("input[name='detailAddress']").focus();
            }
        }).open();
    };



    return (
        <div className='w-full'>
            {isLogin ? (
                <div>
                    <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-grow'>
                        <div className='flex justify-center mb-4'>
                            <h1 className='text-4xl font-bold'>ORDER</h1>
                        </div>
                        <div className='flex justify-end mb-4'>
                            <h2 className='text-base font-medium text-gray-900'>
                                {loginState.nickname} 님의 주문정보입니다.
                            </h2>
                        </div>



                        <div className='my-3 ml-3 font-bold mr-5'>배송지 정보 입력</div>

                        <div className='border rounded my-4 p-6 '>
                            <div className="sm:col-span-5 mb-4 ml-5 mt-2 flex">
                                <label htmlFor="name" className="block text-sm font-bold leading-6 text-gray-900 w-20">
                                    받는사람 *
                                </label>
                                <div className='ml-2 flex-grow' >
                                    <input
                                        className="block w-full p-1 rounded-md border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                        name="name"
                                        type={'text'}
                                        value={dname}
                                        placeholder="수령인을 입력해주세요"
                                        onChange={handleDnameChange}
                                    />
                                </div>
                            </div>

                            <div className="col-span-full mb-4 ml-5 flex">
                                <label htmlFor="address" className="block text-sm font-bold leading-6 text-gray-900 w-20">
                                    주소 *
                                </label>
                                <div className="ml-2 flex-grow">
                                    <input
                                        name="address"
                                        type={'text'}
                                        onClick={handleAddressSearch}
                                        onChange={(e) => setLocalAddress(e.target.value)}
                                        value={localAddress}
                                        className="block w-full p-1 rounded-md border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                        readOnly
                                    />

                                </div>
                                <button className="items-center border rounded-md ml-5 bg-gray-50 px-2 py-0.5 text-sm shadow-sm hover:bg-gray-100"
                                    onClick={handleAddressSearch}
                                >주소 입력</button>
                            </div>

                            <div className="col-span-full mb-4 ml-5 flex">
                                <label htmlFor="detailAddress" className="block text-sm font-bold leading-6 text-gray-900 w-20">
                                    상세주소 *
                                </label>
                                <div className="ml-2 flex-grow">
                                    <input
                                        name="detailAddress"
                                        type={'text'}
                                        onChange={(e) => setLocalDetailAddress(e.target.value)}
                                        value={localDetailAddress}
                                        className="block w-full p-1 rounded-md border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-5 mb-4 ml-5 flex">
                                <label htmlFor="tel1" className="block text-sm font-bold leading-6 text-gray-900 w-20">
                                    번호 *
                                </label>
                                <div className="ml-2 flex-grow">
                                    <input
                                        className="block w-full p-1 rounded-md border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                        name="tel1"
                                        type={'text'}
                                        onChange={(e) => setLocalPhone(e.target.value)}
                                        value={localPhone}
                                        placeholder="전화번호를 입력해주세요"
                                    />
                                </div>
                            </div>

                            {/* 원래코드 */}
                            {/* <div className="flex sm:col-span-5 mb-4 ml-5">
                                <label htmlFor="tel1" className="block text-sm font-bold leading-6 text-gray-900 w-20">
                                    배송메모
                                </label>
                                <div></div>
                                <div className="mt-2">
                                    <select
                                        name="deliveryMemo"
                                        value={deliveryMemo}
                                        onChange={handleDeliveryMemoChange}
                                        className="block w-full p-1 rounded-md border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    >
                                        <option value="">메모를 선택하세요</option>
                                        <option value="부재시 문 앞에 놓아주세요">부재시 문 앞에 놓아주세요</option>
                                        <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
                                        <option value="택배함에 보관해주세요">택배함에 보관해주세요</option>
                                        <option value="직접 받겠습니다">직접 받겠습니다</option>
                                    </select>
                                </div>
                            </div> */}

                            {/* 직접 입력하기 */}
                            <div className="flex sm:col-span-5 mb-4 ml-5">
                                <label htmlFor="tel1" className="block text-sm font-bold leading-6 text-gray-900 w-20">
                                    배송메모
                                </label>
                                <div></div>
                                <div className="mt-2">
                                    <select
                                        name="deliveryMemo"
                                        value={deliveryMemo}
                                        onChange={handleDeliveryMemoChange}
                                        className="block w-full p-1 rounded-md border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    >
                                        <option value="">메모를 선택하세요</option>
                                        <option value="부재시 문 앞에 놓아주세요">부재시 문 앞에 놓아주세요</option>
                                        <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
                                        <option value="택배함에 보관해주세요">택배함에 보관해주세요</option>
                                        <option value="직접 받겠습니다">직접 받겠습니다</option>
                                        <option value="직접입력하기">직접입력하기</option> {/* 직접 입력 폼을 열기 위한 옵션 */}
                                    </select>
                                </div>
                            </div>

                            {/* 직접 입력 폼이 열려있는 경우에만 표시되는 JSX */}
                            {directInput && (
                                <div className="flex sm:col-span-5 mb-4 ml-5">
                                    <label htmlFor="tel1" className="block text-sm font-bold leading-6 text-gray-900 w-20">
                                        직접 입력
                                    </label>
                                    <input
                                        className="block w-full p-1 rounded-md border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                        name="deliveryMemo"
                                        value={deliveryMemo}
                                        onChange={(event) => setDeliveryMemo(event.target.value)}
                                    />
                                </div>
                            )}

                        </div>


                        <div className='my-3 ml-3 font-bold mr-5'>상품 목록</div>

                        <div className='border rounded my-4 p-6'>
                            {orders.map((order, index) => (
                                <div key={index} className="overflow-hidden ">
                                    <div className='flex'>

                                        <div className="w-100 h-56 overflow-hidden">
                                            {order.images && order.images.length > 0 ? (
                                                <img src={`${host}/api/products/view/${order.images[0]}`} alt="Product" className="thumbnail-image cursor-pointer" onClick={()=>window.location.href = `/products/read/${order.productPno}`}/>
                                            ) : (
                                                <p className="flex items-center justify-center h-full">No image available</p>
                                            )}
                                        </div>

                                        <div className='mt-4 ml-5'>
                                            <p className="cursor-pointer font-bold text-lg" onClick={()=>window.location.href = `/products/read/${order.productPno}`}>{order.pname}</p>
                                            <p>제품 단가 : {formatPrice(order.price)}원</p>
                                            <p>주문 수량 : {order.count}EA</p>
                                            <p>합산 가격 : {formatPrice(order.price * order.count)}원</p>
                                        </div>
                                    </div>



                                </div>
                            ))}

                        </div>




                           <div className="">
                            <div className="">
                                {/* 결제 UI, 이용약관 UI 영역 */}
                                <div id="payment-widget" />
                                <div id="agreement" />
                            </div>
                        </div>

                    </div>
                    <div className=" bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>상품구매금액</p>
                                    <p>{formatPrice(totalPrice)} 원</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Product purchase amount</p>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>배송비 </p>
                                    <p>{formatPrice(deliveryFee)} 원</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Delivery cost (30,000원 이상 구매시 무료배송) </p>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>총 주문 금액 </p>
                                    <p>{formatPrice(totalPrice+deliveryFee)} 원</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Delivery cost</p>
                                <div className="mt-6 flex justify-end items-center space-x-4">
                                    <button
                                        onClick={handleClickOrder}
                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 h-12"
                                    >
                                        주문하기
                                    </button>
                                    <a
                                        href="/products/list"
                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-indigo-200 h-12"
                                    >
                                        쇼핑 계속하기
                                    </a>
                                </div>

                            </div>
                        </div>
                </div>

            ) : (

                <div className="bg-white flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-lg font-medium text-gray-900">로그인이 필요합니다</h2>
                </div>
            )}
        </div>
    );
};

export default OrderComponent;