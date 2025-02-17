import { useParams } from "react-router-dom";
import ReadComponent from "../../components/products/ReadComponent";


const ReadPage = () => {

  const {pno} = useParams()

  return (  
    <div className="w-full flex justify-center items-center m-0 p-2 border">    
        <ReadComponent pno={pno}></ReadComponent>
        
    </div>
  );
}
export default ReadPage;