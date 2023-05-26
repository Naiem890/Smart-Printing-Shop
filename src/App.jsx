import { Route, Routes } from "react-router-dom";
import Home from "./components/Pages/Home/Home";
import SelectService from "./components/Pages/Select-Service/SelectService";
import SearchService from "./components/Pages/Search-Shop/SearchService";

import Login from "./components/Pages/Authentication/Login";
import Signup from "./components/Pages/Authentication/Signup";
import NotFound from "./components/Pages/Shared/NotFound";
import Navbar from "./components/UI-elements/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<SideBar />} /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/select" element={<SelectService />} /> */}
        <Route path="/search" element={<SearchService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
