import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/ask/ModifyComponent";

const ModifyPage = () => {

  const { ano } = useParams()

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">
        Ask Modify Page
      </div>

      <ModifyComponent ano={ano} />

    </div>
  );
}

export default ModifyPage;