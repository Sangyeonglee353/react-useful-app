import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TransferPage from "./pages/TransferPage";
import FindCoordinateV1Page from "./pages/FindCoordinateV1Page";
import FindCoordinateV2Page from "./pages/FindCoordinateV2Page";
import TestPage from "./pages/TestPage";
import KakaoMapPage from "./pages/KakaoMapPage";
import WeatherInfoPage from "./pages/WeatherInfoPage";

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
          <Route path="kakaomap" element={<KakaoMapPage />} />
          <Route path="weatherinfo" element={<WeatherInfoPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
