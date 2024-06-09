import AddComponent from "../../components/notice/AddComponent";


const AddPage = () => {
    return (
        <div className="p-4 w-full bg-white">
            <div className="text-5xl font-extrabold text-center pb-10 min-w-[1050px] px-4 flex items-center justify-center">
                공 지 사 항
            </div>
            <AddComponent/>
        </div>
    );
}
export default AddPage;