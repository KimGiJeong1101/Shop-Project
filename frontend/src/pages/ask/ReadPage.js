import { useParams } from "react-router-dom";
import ReadComponent from "../../components/ask/ReadComponent";

const ReadPage = () => {

    const { ano } = useParams()

    return (
        <div className="p-4 w-full bg-white">
            <div className="text-3xl font-extrabold">
                
            </div>

            <ReadComponent ano={ano}></ReadComponent>

        </div>
    );
}

export default ReadPage;