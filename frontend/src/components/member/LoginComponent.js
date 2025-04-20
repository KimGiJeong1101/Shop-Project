import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import { Link, useNavigate } from "react-router-dom";
import KakaoLoginComponent from "./kakaoLoginComponent";

const initState = {
  email: "",
  pw: "",
  roleNames: [],
};

const LoginComponent = () => {
  // 로그인 정보를 담기 위한 변수
  const [loginParam, setLoginParam] = useState({ ...initState });

  console.log(initState);

  // 커스텀 훅에서 로그인 처리 및 페이지 이동 함수를 꺼내옴.
  const { doLogin, moveToPath } = useCustomLogin();

  // 리액트에서 제공하는?? 기능으로 url이나 페이지?? 이동을 위해 사용
  const navigate = useNavigate();

  // 이건 회원가입 로직이랑 거의 비슷함. 입력란의 정보를 계속 최신화?? 하기 위함
  const handleChange = (e) => {
    setLoginParam((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 해당 컴포넌트에서 사실상 가장 중요한 함수
  const handleSubmit = async (e) => {
    // form의 기본 동작(새로고침/서버 전송)을 막고, JS 함수만 실행되도록 함
    e.preventDefault();

    try {
      // 여기서 doLogin 함수를 호출하면서 거기에 로그인 정보를 담아서 보냄.
      const response = await doLogin(loginParam);

      console.log("🚀 로그인 응답:", response);

      // 전체적으로 보자면, 서버에서 응답이 없거나, 있거나에 대한 로직을 처리함
      // ✅ 응답 데이터 상세 확인
      if (!response) {
        console.log("❌ 서버 응답 없음!");
        alert("서버 응답이 없습니다. 다시 시도해주세요.");
        return;
      }

      if (response?.error) {
        console.log("❌ 로그인 실패:", response?.error);
        alert("사용자를 찾을 수 없습니다.");
        moveToPath("/member/login");
        return;
      }

      console.log("✅ 로그인 성공!");
      alert("로그인 성공");
      moveToPath("/");
    } catch (error) {
      console.error("❌ 로그인 중 오류 발생:", error);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 이건 회원가입 버튼에 대한 로직. 단순이 회원가입 페이지로 이동을 도와줌.
  const handleClickJoin = () => {
    navigate("/member/join"); // JOIN 페이지로 이동
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Link to="/" className="-m-1.5 p-1.5">
          <img
            className="mx-auto h-10 w-auto"
            src="/img/logo.png"
            alt="Your Company"
          />
        </Link>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                name="email"
                type={"text"}
                value={loginParam.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to="#"
                  className="font-semibold text-orange-400 hover:text-orange-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                name="pw"
                type={"password"}
                value={loginParam.pw}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-orange-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              로그인
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          회원이 아니세요?{" "}
          <Link
            onClick={handleClickJoin}
            className="font-semibold leading-6 text-orange-400 hover:text-orange-00"
          >
            회원가입 하기
          </Link>
        </p>
        <div className="mt-10">
          <KakaoLoginComponent></KakaoLoginComponent>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
