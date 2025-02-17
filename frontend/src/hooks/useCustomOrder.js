import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react"
import { useRecoilState } from "recoil";
import { orderState } from "../atoms/orderState";
import { postAddOrder, postCartOrder, getOrder } from "../api/orderApi";


const useCustomOrder = () => {

    const [order, setOrder] = useRecoilState(orderState);
    const queryClient = useQueryClient()
    const [orderItems, setOrderItems] = useRecoilState(orderState)
    const changeMutation = useMutation( // 변이 함수를 정의합니다.
      (param) => getOrder(param), // postChangeCart 함수를 이용하여 API를 호출하는 비동기 함수를 정의합니다.
      {
        onSuccess: (result) => { // 변이 함수가 성공했을 때 실행되는 콜백을 정의합니다.
          setOrder(result) // 변이 함수가 반환한 결과를 사용하여 상태를 업데이트합니다.
        }
      }
    )

    const query = useQuery(
        ["orders"],
        getOrder,
        {staleTime: 1000*60*60}
    )

    useEffect(()=>{
        if (query.isSuccess||changeMutation.isSuccess) {
            queryClient.invalidateQueries("orders")
            setOrderItems(query.data)
        }
    },[])

    
    
    //단일상품 주문
    const addOrderMutation = useMutation(
        (param) => postAddOrder(param),
        {
            onSuccess: (data) => {
                // 주문 성공 후 처리: 상태 업데이트, 성공 메시지 표시 등
                setOrder([...order, data]); // 주문 상태에 새 주문 추가
                // alert('주문이 성공적으로 주문되었습니다.');
            },
            onError: (error) => {
                // 에러 처리
                alert('주문 처리 중 오류가 발생했습니다: ' + error.message);
            }
        }
    );
    const addOrder = (param) => {
        console.log(param);
        addOrderMutation.mutate(param)
    }
    //장바구니 주문
    const cartOrderMutation = useMutation(
        (param) => postCartOrder(param),
        {
            onSuccess:(data) => {
                setOrder([...order,data])
                // alert('선택하신 상품이 성공적으로 주문되었습니다.')
            },
            onError:(error) => {
                alert('주문 처리 중 오류가 발생하였습니다.' + error.message)
            }
        }
    );
    const cartOrder = (param) => {
        console.log(param)
        cartOrderMutation.mutate(param)
    }





    return { orderItems, addOrder,cartOrder}
}

export default useCustomOrder;