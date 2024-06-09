import BasicMenu from "../../layouts/BasicMenu";
import LogoutComponent from './../../components/member/LogoutComponent';

const LogoutPage = () => {
    return (
        <div className='top-0 left-0 z-[1055] flex flex-col h-full w-full'>

            <BasicMenu />

            <div className="w-full flex flex-wrap  h-full justify-center  items-center">
                <div className="mt-10 m-2 p-4" style={{ width: '600px' }}>
                    <LogoutComponent />
                </div>
            </div>
        </div>
    );
}

export default LogoutPage;
