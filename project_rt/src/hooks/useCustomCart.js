import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query" // @tanstack/react-query에서 useMutation, useQuery, useQueryClient를 가져옵니다.
import { useEffect } from "react" // React에서 useEffect를 가져옵니다.
import { useRecoilState } from "recoil" // Recoil에서 useRecoilState를 가져옵니다.
import { getCartItems, postChangeCart } from "../api/cartApi" // cartApi에서 getCartItems와 postChangeCart 함수를 가져옵니다.
import { cartState } from "../atoms/cartState" // cartState atom을 가져옵니다.

const useCustomCart = () => { // useCustomCart 커스텀 훅을 정의합니다.

  const [cartItems, setCartItems] = useRecoilState(cartState) // cartState 상태를 읽고 업데이트하는 데 사용될 상태와 setState 함수를 가져옵니다.
  const queryClient = useQueryClient() // 쿼리 클라이언트 객체를 가져옵니다.
  const changeMutation = useMutation( // 변이 함수를 정의합니다.
    (param) => postChangeCart(param), // postChangeCart 함수를 이용하여 API를 호출하는 비동기 함수를 정의합니다.
    {
      onSuccess: (result) => { // 변이 함수가 성공했을 때 실행되는 콜백을 정의합니다.
        setCartItems(result) // 변이 함수가 반환한 결과를 사용하여 상태를 업데이트합니다.
      }
    }
  )

  const query = useQuery( // 쿼리 훅을 사용하여 데이터를 가져옵니다.
    ["cart"], // 쿼리 키를 정의합니다.
    getCartItems, // getCartItems 함수를 호출하여 API에서 데이터를 가져오는 비동기 함수를 정의합니다.
    { staleTime: 1000 * 60 * 60 } // 쿼리의 데이터가 만료되기 전에 재검사할 시간을 설정합니다. 여기서는 1시간입니다.
  )

  useEffect(() => { // 부수 효과 함수를 정의합니다. 이 함수는 컴포넌트가 마운트될 때와 query.isSuccess, query.data 또는 changeMutation.isSuccess 값이 변경될 때마다 실행됩니다.
    if (query.isSuccess || changeMutation.isSuccess) { // 만약 쿼리가 성공하거나 변이 함수가 성공했을 경우에만 실행됩니다.
      queryClient.invalidateQueries("cart") // "cart" 키를 가진 쿼리를 재검사하도록 지정합니다.
      setCartItems(query.data) // 쿼리로부터 받은 데이터를 사용하여 상태를 업데이트합니다.
    }
  }, [query.isSuccess, query.data]) // 쿼리의 성공 여부와 데이터가 변경될 때마다 이 효과가 다시 실행됩니다.

  const changeCart = (param) => { // 장바구니 항목을 변경하는 함수를 정의합니다.
    changeMutation.mutate(param) // 변이 함수를 호출하여 장바구니 항목을 변경합니다.
  }

  return { cartItems, changeCart } // cartItems와 changeCart 함수를 반환합니다.
}

export default useCustomCart // useCustomCart 훅을 내보냅니다.
