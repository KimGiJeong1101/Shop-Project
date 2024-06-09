import { Link } from "react-router-dom";
import ListComponent from "../../components/ask/ListComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

const ListPage = () => {


  const { loginState } = useCustomLogin();



  const cannotAskAdd = Array.isArray(loginState.roleNames) && loginState.roleNames.length === 0;


  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">
        Q&A 게시판
      </div>



      <div className="flex justify-end mx-7">
        {!cannotAskAdd && (
          <Link to="/ask/add" className="inline-flex items-center border rounded-md bg-gray-50 px-3 py-2 text-sm shadow-sm hover:bg-gray-100">
            글쓰기
          </Link>
        )}
      </div>

      <ListComponent />
    </div>
  );
}

export default ListPage;