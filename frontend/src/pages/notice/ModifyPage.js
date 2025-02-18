import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/notice/ModifyComponent";

const ModifyPage = () => {
  const { nno } = useParams(); //const { pno } 이건 구조분해할당이다 useParams()속의 정보 중에 pno값만 넣는거다
  return (
    <div className="p-4 w-full bg-white">
      <ModifyComponent nno={nno} />
    </div>
  );
};
export default ModifyPage;
