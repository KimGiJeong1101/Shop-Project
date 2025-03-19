import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../../api/kakaoApi";

const KakaoLoginComponent = () => {
  const handleClick = () => {
    const link = getKakaoLoginLink();  // 클릭할 때만 실행
    window.location.href = link;       // 카카오 로그인 페이지로 이동
  };

  return (
    <div className="flex flex-col">
      <div className="text-center text-blue-500 mt-4">
        로그인시에 자동 가입처리 됩니다
      </div>
      <div className="flex justify-center w-full">
        <button
          className="text-3xl text-center m-2 text-white font-extrabold w-3/4 bg-yellow-300 shadow-sm rounded p-2"
          onClick={handleClick}  // 클릭 이벤트 추가
        >
          KAKAO LOGIN
        </button>
      </div>
    </div>
  );
};

export default KakaoLoginComponent;
