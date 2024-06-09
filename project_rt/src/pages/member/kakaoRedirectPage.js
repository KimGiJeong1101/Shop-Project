
import { useSearchParams } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

import { useEffect } from "react";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";


const KakaoRedirectPage = () => {

  const [searchParams] = useSearchParams()

  const { moveToPath, saveAsCookie } = useCustomLogin()

  const authCode = searchParams.get("code")

  useEffect(() => {

    getAccessToken(authCode).then(accessToken => {
      console.log(accessToken)

      getMemberWithAccessToken(accessToken).then(memberInfo => {

        console.log("-------------------")
        console.log(memberInfo)
        console.log("==========================")

        console.log("memberInfo exists:", !!memberInfo);
        console.log("memberInfo.social is false:", !memberInfo.social);

        saveAsCookie(memberInfo)
        //소셜 회원이 아니라면
        if (memberInfo && !memberInfo.social) {
          moveToPath("/")
        } else {
          moveToPath("/member/modify")
        }
      })
    })

  }, [authCode])


  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div>
    </div>
  )
}

export default KakaoRedirectPage;
