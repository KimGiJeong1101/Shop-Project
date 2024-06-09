/* React의 상태 관리와 라우팅 관련 훅을 가져옵니다. */
import { useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

/* 파라미터 값을 숫자로 변환하는 함수, 유효하지 않은 값이면 기본값을 반환합니다. */
const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue; /* param이 없으면 기본값 반환 */
  }
  return parseInt(param); /* param이 있으면 정수로 변환하여 반환 */
};

/* 사용자 정의 훅, 라우팅 관련 로직을 캡슐화합니다. */
const useCustomMove = () => {
  const navigate = useNavigate(); /* 페이지 이동을 위한 훅 사용 */
  const [refresh, setRefresh] =
    useState(false); /* 리프레시 상태를 관리하기 위한 상태 변수 */

  const [queryParams] =
    useSearchParams(); /* 현재 URL의 검색 매개변수를 가져옵니다. */

  /* 쿼리 파라미터에서 'page'와 'size'를 가져오거나 없으면 기본값을 설정 */
  const page = getNum(
    queryParams.get("page"),
    1
  ); /* 'page' 파라미터의 값을 가져오거나 기본값으로 1 설정 */
  const size = getNum(
    queryParams.get("size"),
    12
  ); /* 'size' 파라미터의 값을 가져오거나 기본값으로 10 설정 */

  /* 현재 페이지와 사이즈 기반으로 기본 쿼리 스트링을 생성 */
  /* createSearchParam메서드에 page,size를 넣고 queryDefault를 만듬 toString()은 값을 문자열로 바꿔주는 역할 */
  const queryDefault = createSearchParams({ page, size }).toString();

  /* 리스트 페이지로 이동할 때 사용할 함수 */
  const moveToList = (pageParam) => {
    let queryStr = ""; /* 이동할 때 사용할 쿼리 스트링 초기화 */

    if (pageParam) {
      /* pageParam이 제공됐을 경우 해당 값을 사용하여 쿼리 스트링을 생성 */
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 12);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      /* pageParam이 제공되지 않았을 경우 기본 쿼리 스트링을 사용 */
      queryStr = queryDefault;
    }

    navigate({
      pathname: "../list" /* 리스트 페이지의 경로 */,
      search: queryStr /* 이동할 때 쿼리 스트링 */,
    });

    setRefresh(!refresh); /* 이동 후에 리프레시 상태를 토글 */
  };

  const moveToListOne = (pageParam) => {
    let queryStr = createQueryString(pageParam, "single");
    navigate({
      pathname: "../list",
      search: `type=single&${queryStr}`,
    });
  };

  const moveToListSet = (pageParam) => {
    let queryStr = createQueryString(pageParam, "set");
    navigate({
      pathname: "../list",
      search: `type=set&${queryStr}`,
    });
  };

  const createQueryString = (pageParam, listType) => {
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 12);
      return createSearchParams({
        page: pageNum,
        size: sizeNum,
        type: listType,
      }).toString();
    }
    return queryDefault;
  };

  /* 수정 페이지로 이동할 때 사용할 함수 */
  const moveToModify = (num) => {
    console.log(queryDefault); /* 현재 쿼리 스트링을 콘솔에 출력 */
    navigate({
      pathname: `../modify/${num}` /* 수정 페이지의 경로, num 파라미터를 경로에 포함 */,
      search: queryDefault /* 기존 쿼리 스트링을 유지 */,
    });
  };

  /* 읽기 페이지로 이동할 때 사용할 함수 */
  const moveToRead = (num) => {
    console.log(queryDefault); /* 현재 쿼리 스트링을 콘솔에 출력 */
    navigate({
      pathname: `../read/${num}` /* 읽기 페이지의 경로, num 파라미터를 경로에 포함 */,
      search: queryDefault /* 기존 쿼리 스트링을 유지 */,
    });
  };

  const moveToReadProduct = (num) => {
    console.log(queryDefault); /* 현재 쿼리 스트링을 콘솔에 출력 */
    navigate({
      pathname: `../products/read/${num}` /* 읽기 페이지의 경로, num 파라미터를 경로에 포함 */,
      search: queryDefault /* 기존 쿼리 스트링을 유지 */,
    });
  };

  const moveToReadEvent = (num) => {
    console.log(queryDefault); /* 현재 쿼리 스트링을 콘솔에 출력 */
    navigate({
      pathname: `../event/read/${num}` /* 읽기 페이지의 경로, num 파라미터를 경로에 포함 */,
      search: queryDefault /* 기존 쿼리 스트링을 유지 */,
    });
  };

  /* 훅에서 제공하는 함수와 상태를 객체로 반환 */
  return {
    moveToList,
    moveToModify,
    moveToRead,
    page,
    size,
    refresh,
    moveToListOne,
    moveToListSet,
    moveToReadEvent,
    moveToReadProduct,
  };
};

/* 다른 컴포넌트에서 사용할 수 있도록 useCustomMove 훅을 내보냅니다. */
export default useCustomMove;
