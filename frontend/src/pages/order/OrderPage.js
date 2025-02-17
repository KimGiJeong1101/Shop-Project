import OrderComponent from "../../components/order/OrderComponent";
import BasicLayout from "../../layouts/BasicLayout";

const OrderPage = () => {
    return (
        <BasicLayout>
            <div>
                <OrderComponent/>
            </div>
        </BasicLayout>
    );
}

export default OrderPage;