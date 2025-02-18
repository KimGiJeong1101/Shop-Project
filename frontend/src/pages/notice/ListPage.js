import ListComponent from "../../components/notice/ListComponent";

const ListPage = () => {
  return (
    <div className="px-4 py-4 w-full bg-white min-w-[1050px]">
      <div className="px-20 min-w-[500px]">
        <div className="border-t-4 border-black text-3xl font-extrabold flex min-w-[500px]"></div>
        <div className="py-4 flex justify-between items-center min-w-[500px] whitespace-nowrap">
          <div className="w-1/4 text-lg lg:text-2xl">번호</div>
          <div className="w-1/2 text-lg lg:text-2xl text-center">제목</div>
          <div className="w-1/4 text-lg lg:text-2xl text-center">작성일</div>
        </div>
        <div className="border-t border-gray-400 text-3xl font-extrabold flex min-w-[500px]" />
      </div>
      <ListComponent />
    </div>
  );
};

export default ListPage;
