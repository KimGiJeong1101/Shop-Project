import ListComponent from "../../components/notice/ListComponent";

const ListPage = () => {

    return (
        <div className="px-4 p-4 w-full bg-white min-w-[1050px]">
            <div className="flex justify-center items-center text-5xl font-extrabold text-center pb-10 w-full">
                공 지 사 항
            </div>
            <div className="px-80 min-w-[500px]">
                <div className="border-t-4 border-black text-3xl font-extrabold flex min-w-[500px]"></div>
                <div className="font-bold pt-4 pb-4 flex px-20 min-w-[500px] whitespace-nowrap">
                    <div className="w-1/2 text-lg lg:text-2xl">번호</div>
                    <div className="w-1/2 text-lg lg:text-2xl">제목</div>
                    {/* <div className="w-1/6 pl-10 text-lg lg:text-2xl">작성자</div> */}
                </div>
                <div className="border-t border-gray-400 text-3xl font-extrabold pt-2 pb-2 flex min-w-[500px]" />
            </div>
            <ListComponent />
        </div>
    );
}

export default ListPage;