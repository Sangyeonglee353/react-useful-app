import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TransferPage from "./pages/TransferPage";
import FindCoordinateV1Page from "./pages/FindCoordinateV1Page";
import FindCoordinateV2Page from "./pages/FindCoordinateV2Page";
import TestPage from "./pages/TestPage";

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
          <Route path="findcoordinatev2" element={<FindCoordinateV2Page />} />
          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
