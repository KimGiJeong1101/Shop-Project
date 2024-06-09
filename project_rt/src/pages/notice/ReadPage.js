import { useParams } from "react-router-dom";
import ReadComponent from "../../components/notice/ReadComponent";

const ReadPage = () => {
    const { nno } = useParams() //useParams()메서드로 불러온 URL매개변수 중 이름이 pno인 것만 {pno}에 담긴다
    return (
        <div className="px-10 p-4 w-full bg-white">
            <div className="text-5xl font-extrabold text-center pb-10 min-w-[1050px] px-4 flex items-center justify-center">
                공 지 사 항
            </div>
            <ReadComponent nno={nno}></ReadComponent>
        </div>
    );
}
export default ReadPage;