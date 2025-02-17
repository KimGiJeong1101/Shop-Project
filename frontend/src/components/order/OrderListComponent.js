import React, { useState } from 'react';
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import FetchingModal from "../common/FetchingModal";
import { getOrder,postCancel } from "../../api/orderApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import { API_SERVER_HOST } from "../../api/productApi";
import { ChevronDownIcon,ChevronUpIcon } from '@heroicons/react/20/solid';

const OrderListComponent = () => {
    const { isLogin, loginState } = useCustomLogin();
    const { page, size } = { page: 0, size: 4 }; // 예시로 페이지와 사이즈 설정
    const queryClient = useQueryClient();
    const [showAllItems, setShowAllItems] = useState(false);

    const { data, isError, error, isFetching } = useQuery(
        ['order/list', page, size],
        () => getOrder({ page, size }),
        {
            staleTime: 5 * 1000, // 5초 동안 데이터는 신선함
            onError: (error) => console.error('Error fetching orders:', error)
        }
    );
    const cancelOrderMutation = useMutation(orderId => postCancel(orderId), {
        onSuccess: () => {
            queryClient.invalidateQueries(['order/list']);
            alert("주문이 성공적으로 취소되었습니다.");
        },
        onError: (error) => {
            alert(`주문 취소 중 오류가 발생했습니다: ${error.message}`);
        }
    });

    const handleCancelOrder = (orderId) => {
        if (window.confirm("주문을 취소하시겠습니까?")) {
            cancelOrderMutation.mutate(orderId);
        }
    };

    
    const toggleShowAllItems = () => {
        setShowAllItems(!showAllItems);
    };

    if (isFetching) return <FetchingModal />;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLogin && <h2 className="text-xl font-semibold text-gray-800 my-4">{loginState.nickname} 님의 주문정보입니다.</h2>}
            {data && data.content.map((order) => (
                <div key={order.orderId} className="bg-white border shadow overflow-hidden rounded-lg mb-6 p-6">
                    
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-indigo-400">주문번호: {order.orderId}</h3>
                        <button 
                            className="px-3 py-3 bg-indigo-400 text-white font-medium text-xs rounded hover:bg-indigo-500 transition duration-300"
                            onClick={() => handleCancelOrder(order.orderId)}
                        >
                            주문 취소
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2  text-sm">
                        <p>주문 날짜: {order.orderDate}</p>
                        <p>주문 상태: {order.orderStatus}</p>
                        <p>수령인: {order.dname}</p>
                        <p>배송 주소: {order.deliveryAddress} {order.detailAddress}</p>
                        <p>연락처: {order.tel}</p>
                        <p>배송 메모: {order.dmemo}</p>
                        <p className='my-4'>총 주문 금액: {order.totalOrderPrice}원</p>
                    </div>

                    {order.orderItemDtoList.length > 0 && (
                        <>
                            {showAllItems
                                ? order.orderItemDtoList.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                        <div className="flex items-center">
                                            <img src={`${API_SERVER_HOST}/api/products/view/${item.uploadFileNames}`} alt="Product" className="h-20 w-20 object-cover rounded-md mr-4" />
                                            <div>
                                                <p className="font-bold text-base">{item.pname}</p>
                                                <p className="text-xs text-gray-600">수량: {item.count}</p>
                                                <p className="text-xs text-gray-600">가격: {item.orderPrice}원</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : order.orderItemDtoList.slice(0, 1).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 last:border-b-0">
                                        <div className="flex items-center">
                                            <img src={`${API_SERVER_HOST}/api/products/view/${item.uploadFileNames}`} alt="Product" className="h-20 w-20 object-cover rounded-md mr-4" />
                                            <div>
                                                <p className="font-bold text-base">{item.pname}</p>
                                                <p className="text-xs text-gray-600">수량: {item.count}</p>
                                                <p className="text-xs text-gray-600">가격: {item.orderPrice}원</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                            {order.orderItemDtoList.length > 1 && (
                                <div className=' m-4'>
                                    <button className='text-base' onClick={toggleShowAllItems}>
                                        {showAllItems ? <>접기 <ChevronUpIcon className='w-6 h-6 inline' /></>: <>더보기 <ChevronDownIcon className='w-6 h-6 inline' /></>}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default OrderListComponent;