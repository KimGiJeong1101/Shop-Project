import { Suspense, lazy } from "react"
import { Navigate } from "react-router-dom"


const cartRouter = () => {
    const Loading = <div>Loading</div>
    const CartPage = lazy(()=> import("../pages/CartPage"))
    const ProductsList = lazy(()=> import("../pages/products/ListPage"))


    return[
        {
            path : "",
            element : <Suspense fallback={Loading}><CartPage/></Suspense>
        },
        {
            path : "list",
            element : <Suspense fallback={Loading}><ProductsList/></Suspense>
        }
    ]
}

export default cartRouter;