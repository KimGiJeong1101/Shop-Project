import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; // @reduxjs/toolkit에서 createAsyncThunk와 createSlice를 가져옵니다.
import { getCartItems, postChangeCart } from "../api/cartApi"; // cartApi에서 getCartItems와 postChangeCart 함수를 가져옵니다.

// 비동기 작업을 처리하는 Thunk 함수를 생성합니다.
export const getCartItemsAsync = createAsyncThunk('getCartItemsAsync', () => {
    return getCartItems(); // cartApi에서 장바구니 항목을 가져오는 비동기 함수를 호출하여 반환합니다.
});

// 장바구니 항목을 변경하는 비동기 Thunk 함수를 생성합니다.
export const postChangeCartAsync = createAsyncThunk('postCartItemsAsync', (param) => {
    return postChangeCart(param); // cartApi에서 장바구니 항목을 변경하는 비동기 함수를 호출하여 반환합니다.
});

const initState = []; // 초기 상태를 빈 배열로 설정합니다.

// Redux slice를 생성합니다.
const cartSlice = createSlice({
    name: 'cartSlice', // slice의 이름을 정의합니다.
    initialState: initState, // 초기 상태를 설정합니다.

    // extraReducers를 통해 비동기 액션에 대한 reducer를 정의합니다.
    extraReducers: (builder) => {
        builder
            .addCase(getCartItemsAsync.fulfilled, (state, action) => { // getCartItemsAsync 액션이 완료되었을 때의 reducer를 추가합니다.
                console.log("getCartItemsAsync fulfilled"); // 콘솔에 로그를 출력합니다.
                return action.payload; // 액션 페이로드를 새로운 상태로 반환합니다.
            })
            .addCase(postChangeCartAsync.fulfilled, (state, action) => { // postChangeCartAsync 액션이 완료되었을 때의 reducer를 추가합니다.
                console.log("postCartItemsAsync fulfilled"); // 콘솔에 로그를 출력합니다.
                return action.payload; // 액션 페이로드를 새로운 상태로 반환합니다.
            });
    }
});

export default cartSlice.reducer; // slice의 reducer를 내보냅니다.
