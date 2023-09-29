import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TransferPage from "./pages/TransferPage";
import FindCoordinateV1Page from "./pages/FindCoordinateV1Page";
import Navbar from "./components/Navbar";
import { Outlet, Route, Routes } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Navbar />

      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="findcoordinatev1" element={<FindCoordinateV1Page />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
