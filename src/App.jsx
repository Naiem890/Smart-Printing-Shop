import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Pages/Home/Home";
import SearchService from "./components/Pages/Search-Shop/SearchService";

import Login from "./components/Pages/Authentication/Login";
import Signup from "./components/Pages/Authentication/Signup";
import NotFound from "./components/Pages/Shared/NotFound";
import Navbar from "./components/UI-elements/Navbar";
import Shop from "./components/Pages/Shop/Shop";
import ShopOwnerLogin from "./components/Pages/Authentication/ShopOwnerLogin";
import ShopOwnerSignUp from "./components/Pages/Authentication/ShopOwnerSignUp";
import CreateShop from "./components/Pages/Shop/CreateShop";
import ShopList from "./components/Pages/Shop/ShopList";
import EditShop from "./components/Pages/Shop/EditShop";
import EditService from "./components/Pages/Shop/EditService";
import OrderService from "./components/Pages/Shop/OrderService";
import OrderList from "./components/Pages/Shop/OrderList";
import MyOrders from "./components/Pages/Shop/MyOrders";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import DashboardShopOwner from "./components/Pages/Shop/DashboardShopOwner";
import DashboardCustomer from "./components/Pages/Shop/DashboardCustomer";

function App() {
  const [reload, setReload] = useState(false);
  const [role, setRole] = useState("");
  const [shopId, setShopId] = useState("");
  const navigate = useNavigate();

  const recheck = () => {
    const data =
      localStorage.getItem("CUST_ID") || localStorage.getItem("SHOP_OWNER_ID");

    setRole(
      data?.includes("SW")
        ? "SHOP_OWNER"
        : data?.includes("CS")
        ? "CUSTOMER"
        : ""
    );

    setShopId(localStorage.getItem("SHOP_ID"));
  };

  useEffect(() => {
    recheck();
  }, [reload]);

  const handleLogout = () => {
    navigate("../..");
    localStorage.clear();
    toast("Logout successful", {
      type: "success",
      theme: "colored",
    });
  };
  return (
    <div onClick={() => setReload((prev) => !prev)}>
      <Navbar handleLogout={handleLogout} role={role} />
      <Routes>
        {/* <Route path="/" element={<SideBar />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchService />} />
        <Route path="/shop/:shopId" element={<Shop />} />

        <Route path="/order-service/:serviceId" element={<OrderService />} />

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />

        <Route path="/shop-owner/login" element={<ShopOwnerLogin />} />
        <Route path="/shop-owner/sign-up" element={<ShopOwnerSignUp />} />

        <Route
          path="/shop-owner/dashboard"
          element={
            <DashboardShopOwner shopId={shopId} handleLogout={handleLogout} />
          }
        >
          <Route index element={<OrderList />} />
          <Route path="create-shop" element={<CreateShop />} />
          <Route path="edit-shop" element={<EditShop />} />
          <Route path="edit-service" element={<EditService />} />
        </Route>
        <Route
          path="/customer/dashboard"
          element={<DashboardCustomer handleLogout={handleLogout} />}
        >
          <Route index element={<MyOrders />} />
        </Route>

        <Route path="/shop-owner/shop/create" element={<CreateShop />} />
        <Route path="/shop-owner/shop/edit/" element={<EditShop />} />
        <Route path="/shop-owner/orders" element={<OrderList />} />
        <Route path="/orders/my-orders" element={<MyOrders />} />
        <Route
          path="/shop-owner/service/edit/:shopId"
          element={<EditService />}
        />

        <Route path="/shop-owner/shop-list" element={<ShopList />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
