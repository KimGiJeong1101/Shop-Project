import { Link } from "react-router-dom";
import ListComponent from "../../components/ask/ListComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

const ListPage = () => {
  const { loginState } = useCustomLogin();
  const cannotAskAdd = Array.isArray(loginState.roleNames) && loginState.roleNames.length === 0;

  return (
    <div className="px-4 py-4 w-full bg-white min-w-[1050px]">
      <div className="flex justify-end mb-4 pr-20">
        {!cannotAskAdd && (
          <Link to="/ask/add" className="inline-flex items-center border rounded-md bg-gray-50 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 transition duration-300 ease-in-out">
            글쓰기
          </Link>
        )}
      </div>

      <div className="px-20 min-w-[500px]">
        <div className="border-t-4 border-black text-3xl font-extrabold flex min-w-[500px]"></div>
        <div className="py-4 flex justify-between items-center min-w-[500px] whitespace-nowrap">
          <div className="w-1/12 text-lg lg:text-2xl">번호</div>
          <div className="w-8/12 text-lg lg:text-2xl text-center">제목</div>
          <div className="w-2/12 text-lg lg:text-2xl">작성자</div>
          <div className="w-2/12 text-lg lg:text-2xl">작성일</div>
        </div>
        <div className="border-t border-gray-400 text-3xl font-extrabold flex min-w-[500px]" />
      </div>
      <ListComponent />
    </div>
  );
}

export default ListPage;

