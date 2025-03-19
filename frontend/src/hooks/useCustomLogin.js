import { Navigate, createSearchParams, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { loginPost } from "../api/memberApi";
import { removeCookie, setCookie } from "../util/cookieUtil";
import signinState from "../atoms/signinState";
import { cartState } from "../atoms/cartState";

const useCustomLogin = () => {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useRecoilState(signinState);
  const resetState = useResetRecoilState(signinState);
  const resetCartState = useResetRecoilState(cartState); //장바구니 비우기
  const isLogin = loginState.email ? true : false; //----------로그인 여부

  const doLogin = async (loginParam) => {
    const result = await loginPost(loginParam);

    console.log("💡 doLogin result:", result); // 결과 확인

    if (!result) {
      console.error("❌ 로그인 요청 결과가 없습니다.");
      return null;
    }

    saveAsCookie(result);

    return result;
  };

  const saveAsCookie = (data) => {
    setCookie("member", JSON.stringify(data), 1); //1일

    console.log("셋로그인스테이트 위위위" + setLoginState(data));

    if (!data) {
      console.error("로그인 데이터가 없습니다.");
      return;
    }
    setLoginState(data);

    console.log("셋로그인스테이트 아래아래" + setLoginState(data));
  };

  const doLogout = () => {
    //---------------로그아웃 함수

    removeCookie("member");
    resetState();
    resetCartState();
  };

  const exceptionHandle = (ex) => {
    console.log("Exception------------------------");

    console.log(ex);

    const errorMsg = ex.response.data.error;

    const errorStr = createSearchParams({ error: errorMsg }).toString();

    if (errorMsg === "REQUIRE_LOGIN") {
      alert("로그인 해야만 합니다.");
      navigate({ pathname: "/member/login", search: errorStr });

      return;
    }

    if (ex.response.data.error === "ERROR_ACCESSDENIED") {
      alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.");
      navigate({ pathname: "/member/login", search: errorStr });
      return;
    }
  };

  const moveToPath = (path) => {
    //----------------페이지 이동
    navigate({ pathname: path }, { replace: true });
  };

  const moveToLogin = () => {
    //----------------------로그인 페이지로 이동
    navigate({ pathname: "/member/login" }, { replace: true });
  };

  const moveToLoginReturn = () => {
    //----------------------로그인 페이지로 이동 컴포넌트
    return <Navigate replace to="/member/login" />;
  };

  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
    saveAsCookie,
  };
};

export default useCustomLogin;
