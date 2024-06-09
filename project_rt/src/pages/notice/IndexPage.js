import { Outlet, useNavigate } from "react-router-dom"; // react-router-dom 모듈에서 Outlet과 useNavigate를 가져옴
import BasicLayout from "../../layouts/BasicLayout"; // BasicLayout 컴포넌트를 가져옴
import { useCallback } from "react"; // react 모듈에서 useCallback을 가져옴
import useCustomLogin from "../../hooks/useCustomLogin";

const IndexPage = () => { // IndexPage 컴포넌트 선언
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 함수를 가지고 오고 그걸 상수인 navigate에 넣는다 
    // 해당 코드 이후에는 navigate가 함수 처럼 사용 된다

    // 추가 클릭 핸들러, useCallback 훅을 사용하여 최적화
    const handleClickAdd = useCallback(() => {
        navigate({ pathname: 'add' }); // 'add' 경로로 이동하는 navigate 함수 호출
    });

    const { loginState } = useCustomLogin();


    const canNoticeAdd = Array.isArray(loginState.roleNames) &&
        (loginState.roleNames.includes('ADMIN')
            || loginState.roleNames.includes('MANAGER'));


    return (
        <BasicLayout> {/* BasicLayout 컴포넌트를 렌더링 */}
            {/* 리스트와 추가 버튼을 담는 div */}
            <div className="w-full flex justify-end m-2 p-2 pr-60 ">
                {/* 추가 버튼 */}
                {canNoticeAdd && (<div className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 " onClick={handleClickAdd}>
                    추가
                </div>
                )}
            </div>
            {/* Outlet을 사용하여 하위 라우트를 렌더링 */}
            <div className="flex flex-wrap w-full ">
                <Outlet />
            </div>
        </BasicLayout>
    );
}

export default IndexPage; // IndexPage 컴포넌트를 내보냄