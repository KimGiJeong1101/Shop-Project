import { Suspense, lazy } from "react"
import { Navigate } from "react-router-dom"

const productRouter = () => {
    const Loading = <div>Loading</div>
    const ProductsList = lazy(()=> import("../pages/products/ListPage"))
    const ProductsSetList = lazy(()=> import("../pages/products/SetListPage"))
    const ProductsOneList = lazy(()=> import("../pages/products/OneListPage"))
    const ProductsAdd = lazy(()=> import("../pages/products/AddPage"))
    const ProductRead = lazy(()=> import("../pages/products/ReadPage"))
    const ProductModify = lazy(()=> import("../pages/products/ModifyPage"))

    return[
        {
            path : "list",
            element : <Suspense fallback={Loading}><ProductsList/></Suspense>
        },
        {
            path : "setlist",
            element : <Suspense fallback={Loading}><ProductsSetList/></Suspense>
        },
        {
            path : "onelist",
            element : <Suspense fallback={Loading}><ProductsOneList/></Suspense>
        },
        {
            path : "",
            element : <Navigate replace to = "/products/list"></Navigate>
        },
        {
            path : "add",
            element : <Suspense fallback={Loading}><ProductsAdd/></Suspense>
        },
        {
            path : "read/:pno",
            element : <Suspense fallback={Loading}><ProductRead/></Suspense>
        },
        {
            path : "modify/:pno",
            element : <Suspense fallback={Loading}><ProductModify/></Suspense>
        }
    ]
}

export default productRouter;