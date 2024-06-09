// atoms/productStates.js
import { atom } from "recoil";

const ProductInitState = {
    dtoList: [],
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

const SingleProductInitState = {
    ...ProductInitState,
    // 추가적인 단일상품 관련 상태 초기화가 필요한 경우 여기에 작성
};

const SetProductInitState = {
    ...ProductInitState,
    // 추가적인 세트상품 관련 상태 초기화가 필요한 경우 여기에 작성
};

export const singleProductState = atom({
    key: 'singleProductState',
    default: SingleProductInitState
});

export const setProductState = atom({
    key: 'setProductState',
    default: SetProductInitState
});

