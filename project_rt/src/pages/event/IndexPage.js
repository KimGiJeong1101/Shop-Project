import { Outlet, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

const IndexPage = () => {

  const navigate = useNavigate()

  const handleClickAdd = useCallback(() => {
    navigate({ pathname: 'add' })
  })



  const { loginState } = useCustomLogin();


  const canWriter = Array.isArray(loginState.roleNames) &&
    (loginState.roleNames.includes('ADMIN')
      || loginState.roleNames.includes('MANAGER'));




  return (
    <BasicLayout>

      <div className="text-3xl flex justify-center font-bold m-3">
        Event
      </div>

      <div className="flex justify-end mx-7">
        {canWriter && (<button
          type="button"
          className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
          onClick={handleClickAdd}
        >
          글쓰기
        </button>
        )}
      </div>

      <div className="flex flex-wrap w-full ">
        <Outlet />
      </div>
    </BasicLayout>
  );
}

export default IndexPage;