import { useSearchParams } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

import { useEffect } from "react";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";

const KakaoRedirectPage = () => {
  // URL의 쿼리스트링에서 `code` 값을 가져옴 (ex: ?code=abcd1234)
  const [searchParams] = useSearchParams();

  // 커스텀 훅에서 로그인 관련 함수 가져오기
  const { moveToPath, saveAsCookie } = useCustomLogin();

  // 카카오 인증 코드 값 가져오기
  const authCode = searchParams.get("code");

  useEffect(() => {
    // authCode가 없으면 실행하지 않음 (안전장치)
    if (!authCode) return;

    // 1. 인증 코드로 카카오 AccessToken 가져오기
    getAccessToken(authCode).then((accessToken) => {
      console.log("🔑 AccessToken:", accessToken);

      // 2. AccessToken을 이용해 회원 정보 가져오기
      getMemberWithAccessToken(accessToken).then((memberInfo) => {
        // 회원 정보가 없으면 에러 출력 후 함수 종료
        if (!memberInfo) {
          console.error("🚨 Failed to fetch member info");
          return;
        }

        // 3. 회원 정보를 쿠키에 저장
        saveAsCookie(memberInfo);

        // 4. 메인 페이지로 이동
        moveToPath("/");
      });
    });
  }, [authCode]); // authCode 값이 변경될 때마다 실행됨

  return (
    <div>
      <div>✅ Kakao Login Redirect 성공</div>
      <div>🔄 인증 코드: {authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
