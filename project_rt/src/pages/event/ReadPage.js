import { useParams } from "react-router-dom";
import ReadComponent from "../../components/event/ReadComponent";

const ReadPage = () => {

  const {eno} = useParams()

  return (  
  <div className="p-4 w-full bg-white">

    <ReadComponent eno={eno}></ReadComponent>

  </div>
  );
}
 
export default ReadPage;

