import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading....</div>
const EventList =  lazy(() => import("../pages/event/ListPage"))

const EventAdd = lazy(() => import("../pages/event/AddPage"))

const EventRead = lazy(() => import("../pages/event/ReadPage"))

const EventModify = lazy(() => import("../pages/event/ModifyPage"))

const eventRouter = () => {

  return [
    {
      path: "list",
      element: <Suspense fallback={Loading}><EventList/></Suspense>
    },
    {
      path: "",
      element: <Navigate replace to="/event/list"/>
    },
    {
      path: "add",
      element: <Suspense fallback={Loading}><EventAdd/></Suspense>
    },
    {
      path: "read/:eno",
      element: <Suspense fallback={Loading}><EventRead/></Suspense>
    },
    {
      path: "modify/:eno",
      element: <Suspense fallback={Loading}><EventModify/></Suspense>
    }

 
  ]
}

export default eventRouter;
