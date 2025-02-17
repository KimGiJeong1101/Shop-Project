import ModifyComponent from "../../components/member/ModifyComponent";
import BasicLayout from "../../layouts/BasicLayout";





const ModfyPage = () => {
    return (
        <BasicLayout>
            <div>
            
                <div className="bg-white w-full mt-4 p-2">
                    <ModifyComponent></ModifyComponent>
                </div>

            </div>

        </BasicLayout>
    );
}

export default ModfyPage;