import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import { Link, useNavigate } from "react-router-dom";
import KakaoLoginComponent from './kakaoLoginComponent';



console.log("------------------------------------")

const initState = {

  email: '',
  pw: '',
  roleNames: []
}


console.log("===========================")
const LoginComponent = () => {

  const [loginParam, setLoginParam] = useState({ ...initState })

  const { doLogin, moveToPath } = useCustomLogin()

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginParam(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 이벤트를 방지합니다.
    doLogin(loginParam) // loginSlice의 비동기 호출 
      .then(data => {
        console.log(data)

        if (data.error) {
          alert("이메일과 패스워드를 다시 확인하세요")
        } else {
          alert("로그인 성공")
          moveToPath('/')
        }
      })
  }

  const handleClickJoin = () => {
    navigate('/member/join'); // JOIN 페이지로 이동
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
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type={'text'}
                  value={loginParam.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to='#' className="font-semibold text-orange-400 hover:text-orange-300">Forgot password?</Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  name="pw"
                  type={'password'}
                  value={loginParam.pw}
                  onChange={handleChange}
                  required
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
            회원이 아니세요?{' '}
            <Link onClick={handleClickJoin} className="font-semibold leading-6 text-orange-400 hover:text-orange-00">회원가입 하기</Link>
          </p>
          <div className='mt-10'>
            <KakaoLoginComponent ></KakaoLoginComponent>
            </div>
          
        </div>
      </div>


  );
}

export default LoginComponent;
