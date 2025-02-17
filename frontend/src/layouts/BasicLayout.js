import BasicMenu from "./BasicMenu";
import BasicFooter from "./BasicFooter";

const BasicLayout = ({ children }) => {
    return (
        <>
         {/* 기존헤더대신BasicMenu*/ }
        <BasicMenu></BasicMenu>
            {/* 상단여백my-5 제거*/}
            <div /* className="bg-white my-5 w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0" */>
                {/* 상단여백py-40 변경flex 제거*/}
                <main /* className="bg-sky-300 md:w-2/3 lg:w-3/4 px-5 py-40" */>{children}</main>
                {/* 상단여백py-40 제거flex 제거*/}
                {/* <aside className="bg-green-300 md:w-1/3 lg:w-1/4 px-5 py-40">
                    <h1 className="text-2xl md:text-4xl"> Sidebar </h1>
                </aside> */}
            </div>
        <BasicFooter>`</BasicFooter>
        </>
    );
}
export default BasicLayout;