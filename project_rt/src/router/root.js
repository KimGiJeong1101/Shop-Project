import { Suspense, lazy } from "react";
import eventRouter from "./eventRouter";
import productRouter from "./productRouter";
import memberRouter from "./memberRouter";
import noticeRouter from "./noticeRouter";
import askRouter from "./askRouter";
import cartRouter from "./cartRouter";
import orderRouter from "./orderRouter";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const Brand = lazy(() => import("../pages/Brandpage"))
const EventIndex = lazy(() => import("../pages/event/IndexPage"))
const ProductsIndex = lazy(() => import("../pages/products/IndexPage"))
const Ask = lazy(() => import("../pages/ask/IndexPage"))
const NoticeIndex = lazy(() => import("../pages/notice/IndexPage"))

const Search = lazy(() => import("../pages/search/SearchModal"))


const root = createBrowserRouter([

  {
    path: "",
    element: <Suspense fallback={Loading}><Main /></Suspense>
  },
  {
    path: "brand",
    element: <Suspense fallback={Loading}><Brand/></Suspense>
  },
  {
    path : "products",
    element : <Suspense fallback={Loading}><ProductsIndex/></Suspense>,
    children : productRouter()

  },
  {
    path: "event",
    element: <Suspense fallback={Loading}><EventIndex /></Suspense>,
    children: eventRouter()
  },
  {
    path: "cart",
    children: cartRouter()
  },
  {
    path: "member",
    children: memberRouter()
  },

  {
    path : "notice",
    element : <Suspense fallback={Loading}><NoticeIndex/></Suspense>,
    children: noticeRouter()
  },
  {
    path: "ask",
    element: <Suspense fallback={Loading}><Ask /></Suspense>,
    children: askRouter()
  },
  {
    path : "order",
    children : orderRouter()
  },

  {
    path: "search",
    element: <Suspense fallback={Loading}><Search/></Suspense>,
  }

])

export default root;