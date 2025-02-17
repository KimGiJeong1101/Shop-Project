import BasicMenu from "../../layouts/BasicMenu";
import BasicFooter from "../../layouts/BasicFooter";
import { Outlet } from "react-router-dom";

const IndexPage = () => {
    return (
        <>
            <BasicMenu />
            <Outlet />
            <BasicFooter />
        </>
    );
}

export default IndexPage;
