import { OrderSuccessComponent } from "../../components/order/OrderSuccessComponent";
import BasicLayout from "../../layouts/BasicLayout";

const OrderSuccessPage = () => {
    return (
        <BasicLayout>
            <div>
                <OrderSuccessComponent/>
            </div>
        </BasicLayout>
    );
}

export default OrderSuccessPage;