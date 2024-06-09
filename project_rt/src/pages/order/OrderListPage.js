import { useParams } from "react-router-dom";
import OrderListComponent from "../../components/order/OrderListComponent";
import BasicLayout from "../../layouts/BasicLayout";

const OrderListPage = () => {

  const {orderId} = useParams()

  return (  
    <BasicLayout>
    <div className="w-full flex justify-center items-center m-0 p-2 border">
    <div className="p-4 w-full bg-white">
        <div className="text-3xl font-extrabold">
        <OrderListComponent orderId={orderId}></OrderListComponent>
        </div>
    </div>
    </div>
    </BasicLayout>
  );
}
 
export default OrderListPage;
