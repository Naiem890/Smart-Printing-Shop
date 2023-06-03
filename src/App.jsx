import { Route, Routes } from "react-router-dom";
import Home from "./components/Pages/Home/Home";
import SearchService from "./components/Pages/Search-Shop/SearchService";

import Login from "./components/Pages/Authentication/Login";
import Signup from "./components/Pages/Authentication/Signup";
import NotFound from "./components/Pages/Shared/NotFound";
import Navbar from "./components/UI-elements/Navbar";
import Shop from "./components/Pages/Shop/Shop";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<SideBar />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchService />} />
        <Route path="/shop/:shopId" element={<Shop />} />

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
