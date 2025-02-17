import { atom, selector, useRecoilState, useSetRecoilState } from "recoil";


// Recoil 상태 정의
export const orderState = atom({
    key: 'orderState',
    default: []
});

export const orderTotalState = selector({
    key: "orderTotalState",
    get: ({ get }) => {
        const orders = get(orderState);
        return orders.reduce((total, order) => total + order.price * order.count, 0);
    }
});


const OrderInitState = {
    
    orderHistDTO: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
};

const GetOrderInitState = {
    ...OrderInitState,
}

export const getOrderState = atom({
    key:'GetOrderInitState',
    default: GetOrderInitState
})
