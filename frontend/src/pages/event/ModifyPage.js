import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/event/ModifyComponent";

const ModifyPage = () => {

  const {eno} = useParams()

  return ( 
  <div className="p-4 w-full bg-white">

    <ModifyComponent eno={eno}/>

  </div>
   );
}
 
export default ModifyPage;
