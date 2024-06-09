import { Outlet, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

const IndexPage = () => {

  const navigate = useNavigate()

  const handleClickList = useCallback(() => {
    navigate({ pathname: 'list' })
  })

  const handleClickAdd = useCallback(() => {
    navigate({ pathname: 'add' })
  })


  const { loginState } = useCustomLogin();


  const cannotAskAdd = Array.isArray(loginState.roleNames) && loginState.roleNames.length === 0;


  return (
    <BasicLayout>
      <div className="text-3xl flex justify-center font-bold m-3">
        Q&A
      </div>
    
      <div className="flex flex-wrap w-full">
        <Outlet/>
      </div>
    </BasicLayout>
  );
}

export default IndexPage;