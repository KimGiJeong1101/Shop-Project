import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import ResultModal from "../common/ResultModal";
import FetchingModal from "./../common/FetchingModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import { joinPost } from "../../api/memberApi";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const initState = {
  email: "",
  pw: "",
  nickname: "",
  phone: "",
  birth: "",
  useraddress: "",
  detailaddress: "",
  social: false,
  roleNames: [],
};

const JoinComponent = () => {
  const [joinParam, setJoinParam] = useState({ ...initState });
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);
  const { moveToLogin } = useCustomLogin();
  const navigate = useNavigate();

  const handleAddressSearch = () => {
    new window.daum.Postcode({ // 카카오API 문법
      oncomplete: function (data) {
        // 주소 입력 처리
        setJoinParam((prevState) => ({
          ...prevState,
          useraddress: data.address, // 카카오 API에서 반환된 주소를 useraddress1으로 설정
        }));
        // 상세 주소 입력란에 자동 포커싱
        document.querySelector("input[name='detailaddress']").focus(); // 자바스크립트 문법을 사용한 이유는 카카오API가 자바스크립트문법으로 실행되기 때문
      },
    }).open();
  };

  const handleChangeJoin = (e) => {
    // 이벤트가 발생한 input 요소에서 name 속성과 입력된 value 값을 꺼낸다
    let { name, value } = e.target;

    // name이 "birth"이고, 값이 존재할 경우 (둘 다 만족해야 함)
    if (name === "birth" && value) {
      // 날짜 데이터의 '-'를 제거하여 YYYYMMDD 형태로 변환
      value = value.split("-").join("");
    }

    // 기존 상태(prevState)를 복사해 새로운 객체를 만들고,
    // name에 해당하는 항목만 새 값(value)으로 덮어써 업데이트함
    // 그렇게 만들어진 updatedValues를 리턴하여 상태를 업데이트함
    setJoinParam((prevState) => {
      let updatedValues = { ...prevState, [name]: value };
      return updatedValues;
    });
  };

  const handleClickJoin = (e) => {
    e.preventDefault();

    if (joinParam.email === "") {
      alert("이메일을 입력해주세요.");
      return;
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(joinParam.email)
    ) {
      alert("올바른 이메일 형식이 아닙니다. 형식을 맞춰주세요.");
      return;
    }

    if (joinParam.pw === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (joinParam.nickname === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (joinParam.phone === "") {
      alert("전화번호를 입력해주세요.");
      return;
    }
    if (!joinParam.phone.startsWith("01")) {
      alert("올바른 전화번호를 입력해주세요.");
      return;
    } else if (joinParam.phone.length < 10 || joinParam.phone.length > 11) {
      alert("전화번호는 10~11자리 숫자로 입력해주세요.");
      return;
    } else if (!/^\d+$/.test(joinParam.phone)) {
      alert('전화번호는 숫자만 입력해야 하며, "-"는 포함하지 않습니다.');
      return;
    }

    if (joinParam.birth === "") {
      alert("생년월일을 입력해주세요.");
      return;
    } else if (!/^\d{8}$/.test(joinParam.birth)) {
      alert("생년월일은 8자리 숫자로 입력해주세요.");
      return;
    } else {
      const year = parseInt(joinParam.birth.substring(0, 4));
      const month = parseInt(joinParam.birth.substring(4, 6)) - 1; // JS는 월이 0부터 시작
      const day = parseInt(joinParam.birth.substring(6, 8));
      const birthDate = new Date(year, month, day);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // 시간, 분, 초, 밀리초 초기화

      if (
        year < 1900 ||
        year > 2100 ||
        month < 0 ||
        month > 11 ||
        day < 1 ||
        day > 31
      ) {
        alert("올바른 날짜 형식이 아닙니다. 생년월일을 다시 확인해주세요.");
        return;
      } else if (birthDate > today) {
        alert(
          "입력하신 날짜가 현재 날짜를 초과합니다. 생년월일을 다시 확인해주세요."
        );
        return;
      }
    }

    if (!joinParam.useraddress || joinParam.useraddress.length === 0) {
      alert("주소를 입력해주세요.");
      return;
    }
    if (!joinParam.detailaddress || joinParam.detailaddress.length === 0) {
      alert("상세주소를 입력해주세요.");
      return;
    }
    if (!agreed) {
      alert("약관에 동의해야 합니다.");
      return; // 약관에 동의하지 않으면 함수 종료
    }

    setFetching(true);
    joinPost(joinParam)
      .then((data) => {
        setResult(data.result);
        navigate("/member/login");
      })
      .catch((error) => {
        console.error("Join failed:", error);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const closeModal = () => {
    setResult(null);
    moveToLogin();
  };

  const handleLoginClick = () => {
    moveToLogin();
  };

  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        {fetching ? <FetchingModal /> : <></>}
        {result ? (
          <ResultModal
            title={"회원가입을 축하합니다"}
            content={`${result} 가입 완료`}
            callbackFn={closeModal}
          />
        ) : (
          <></>
        )}
        <div>
          <Link to="/" className="-m-1.5 p-1.5">
            <img
              className="mx-auto h-10 w-auto"
              src="/img/logo.png"
              alt="Your Company"
            />
          </Link>
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            회원가입
          </h2>
        </div>
        <form
          action="#"
          method="POST"
          className="mx-auto mt-16 max-w-xl sm:mt-20"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  name="email"
                  type="text"
                  onChange={handleChangeJoin}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2.5">
                <input
                  name="pw"
                  type="password"
                  onChange={handleChangeJoin}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="nickname"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                NickName
              </label>
              <div className="mt-2.5">
                <input
                  name="nickname"
                  type="text"
                  onChange={handleChangeJoin}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="phone-number"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Phone number
              </label>
              <div className="mt-2.5">
                <input
                  name="phone"
                  type="text"
                  onChange={handleChangeJoin}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                BIRTH
              </label>
              <div className="mt-2.5">
                <input
                  name="birth"
                  type="date"
                  onChange={handleChangeJoin}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-2.5">
                <input
                  name="useraddress"
                  type="text"
                  onClick={handleAddressSearch}
                  onChange={handleChangeJoin}
                  // 다른 input과 다르게 value={joinParam.useraddress} 이렇게 표현햇는데, 원래 로직이 기본과 상세 주소를 front에서 가공해서 사용하려 했기때문에 이런 문법이 필요했다.
                  value={joinParam.useraddress}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="detailaddress"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Detail Address
              </label>
              <div className="mt-2.5">
                <input
                  name="detailaddress"
                  type="text"
                  onChange={handleChangeJoin}
                  // 위에서 말했듯이 원래 하려던 가공 로직이 사라져 이렇게 주석처리해도 문제가 없다
                  // value={joinParam.detailaddress}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <Switch
                  checked={agreed}
                  onChange={setAgreed}
                  className={classNames(
                    agreed ? "bg-indigo-600" : "bg-gray-200",
                    "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  )}
                >
                  <span className="sr-only">Agree to policies</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      agreed ? "translate-x-3.5" : "translate-x-0",
                      "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </div>
              <Switch.Label className="text-sm leading-6 text-gray-600">
                By selecting this, you agree to our{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  privacy&nbsp;policy
                </a>
                .
              </Switch.Label>
            </Switch.Group>
          </div>
          <div className="mt-10">
            <button
              onClick={handleClickJoin}
              className="block w-full rounded-md bg-orange-300 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              회원가입
            </button>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            <Link
              onClick={handleLoginClick}
              className="font-semibold leading-6 text-orange-400 hover:text-orange-00"
            >
              로그인
            </Link>{" "}
            하러가기
          </p>
        </form>
      </div>
    </>
  );
};

export default JoinComponent;
