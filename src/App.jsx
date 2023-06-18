import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <div>
      <Navbar />
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

        <Route path="/shop-owner/shop/create" element={<CreateShop />} />
        <Route path="/shop-owner/shop/edit/:shopId" element={<EditShop />} />
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
