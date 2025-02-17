import useCustomLogin from "../../hooks/useCustomLogin"


const LogoutComponent = () => {

    const { doLogout, moveToPath } = useCustomLogin()

    const handleClickLogout = () => {
        doLogout()
        alert("로그아웃되었습니다.")
        moveToPath("/")
        window.location.reload()
    }


    return (
        <div className="border-2 w-600 rounded-md border-gray-200 mt-10 m-2 p-4">
            <div className="flex justify-center">
                <div className="text-4xl m-4 p-4 font-extrabold text-slate-700">
                    Logout 
                </div>
            </div>
            <div className="flex justify-center text-xl ">
                로그아웃 하시겠습니까??
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full justify-center">
                    <div className="w-2/5 p-6 flex justify-center font-bold">
                        <button
                            className="rounded p-4 w-36 bg-orange-300 text-xl  text-white"
                            onClick={handleClickLogout}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogoutComponent;