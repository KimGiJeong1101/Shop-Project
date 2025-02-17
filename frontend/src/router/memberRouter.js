import { Suspense, lazy } from "react";
const Loading = <div>Loading....</div>
const Login = lazy(() => import("../pages/member/LoginPage"))


const LogoutPage = lazy(() => import("../pages/member/LogoutPage"))

const KakaoRedirect = lazy(() => import("../pages/member/kakaoRedirectPage"))

const MemberModify = lazy(() => import("../pages/member/ModifyPage"))

const Join = lazy(() => import("../pages/member/JoinPage"))


const memberRouter = () => {

    return [
        {
            path: "login",
            element: <Suspense fallback={Loading}><Login /></Suspense>
        },
        
        {
            path: "join",
            element: <Suspense fallback={Loading}><Join></Join></Suspense>
        },

        {
            path: "logout",
            element: <Suspense fallback={Loading}><LogoutPage /></Suspense>,
        },

        {
            path: "kakao",
            element: <Suspense fallback={Loading}><KakaoRedirect></KakaoRedirect></Suspense>,
        },

        {
            path: "modify",
            element: <Suspense fallback={Loading}><MemberModify></MemberModify></Suspense>,
        }

    ]

}

export default memberRouter