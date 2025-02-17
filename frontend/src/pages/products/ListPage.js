import React, { useCallback, useState } from 'react';
import ListComponent from "../../components/products/ListComponent";
import SetListComponent from "../../components/products/SetListComponent";
import AllListComponent from "../../components/products/AllListComponent"
import '../../App.css'
import { useNavigate } from 'react-router-dom';
import signinState from '../../atoms/signinState';
import { useRecoilValue } from 'recoil';


const ListPage = () => {
    const navigate = useNavigate()
    const userInfo = useRecoilValue(signinState);
    const handleClickAdd = useCallback(() => {
        navigate({ pathname: '/products/add' });
    }, [navigate]);
    // 세트 리스트 표시 상태
    const [showSetList, setShowSetList] = useState(true);

    // 세트 리스트 표시 여부를 토글하는 함수
    const handleToggleSetList = (show) => {
        setShowSetList(show);
    };

    // isAdmin을 확인하기 전에 roleNames이 배열인지 확인
    const isAdmin = Array.isArray(userInfo.roleNames) && userInfo.roleNames.includes('ADMIN');

    return (
        <>


            <AllListComponent/>
            {/* ADMIN일 때만 ADD 버튼을 보여줌 */}
            {isAdmin && (
                <button className="fixed-button m-2 rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                    onClick={handleClickAdd} style={{ cursor: "pointer" }}>
                    상품 등록
                </button>
            )}


        </>
    );
}
export default ListPage;
