import { createBrowserRouter } from "react-router-dom";

import MobileContainer from "@/layouts/MobileContainer.tsx";
import WithBackLayout from "@/layouts/WithBackLayout.tsx";
import OAuthCallback from "@/features/auth/OAuthCallback.tsx";
import Login from "@/features/auth/Login.tsx";
import Shop from "@/features/shop/Shop.tsx";
import SubmitOrder from "@/features/order/SubmitOrder.tsx";
import ManageAddress from "@/features/user/ManageAddress.tsx";
import AddAddress from "@/features/user/AddAddress.tsx";
import Payment from "@/features/order/Payment.tsx";
import OrderDetail from "@/features/order/OrderDetail.tsx";
import Profile from "@/features/user/Profile.tsx";
import OrderHistory from "@/features/order/OrderHistory.tsx";

export const router = createBrowserRouter([
  {
    element: <MobileContainer />,
    children: [
      {
        path: "/",
        element: <Shop />,
        // children: [
        //     { index: true, element: <App /> },
        // ]
      },
      {
        element: <WithBackLayout />,
        children: [
          { path: "/submit", element: <SubmitOrder />, handle: { title: "headBar.submitOrder" } },
          { path: "/payment/:orderNumber", element: <Payment />, handle: { title: "headBar.payment" } },
          { path: "/order/:orderNumber", element: <OrderDetail />, handle: { title: "headBar.orderDetail" } },
          { path: "/me", element: <Profile />, handle: { title: "headBar.profile" } },
          { path: "/history", element: <OrderHistory />, handle: { title: "headBar.orderHistory" } },
          { path: "/addresses", element: <ManageAddress />, handle: { title: "headBar.manageAddress" } },
          { path: "/addresses/add", element: <AddAddress />, handle: { title: "headBar.addAddress" } },
          { path: "/addresses/edit/:id", element: <AddAddress />, handle: { title: "headBar.editAddress" } },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/oauth/callback",
        element: <OAuthCallback />,
      },
    ],
    // ErrorBoundary: RootErrorBoundary,
  },
]);
