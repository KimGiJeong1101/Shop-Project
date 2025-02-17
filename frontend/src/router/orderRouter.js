import { Suspense, lazy } from "react";


const orderRouter = () => {
    const Loading = <div>Loading</div>
    const OrderPage = lazy(()=> import("../pages/order/OrderPage"))
    const OrderListPage = lazy(()=> import("../pages/order/OrderListPage"))
    const OrderSuccess = lazy(()=> import("../pages/order/OrderSuccessPage"))
    const OrderFail = lazy(()=> import("../pages/order/OrderFailPage"))
    return [
        {
            path : "",
            element : <Suspense fallback = {Loading}><OrderPage/></Suspense>
        },
        {
            path : "list",
            element : <Suspense fallback = {Loading}><OrderListPage/></Suspense>
        },
        {
            path : "success",
            element : <Suspense fallback={Loading}><OrderSuccess/></Suspense>
        },
        {
            path : "fail",
            element : <Suspense fallback={Loading}><OrderFail/></Suspense>
        }
    ]
}
export default orderRouter;