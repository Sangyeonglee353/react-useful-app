/* 기본 기능 나열 소개 페이지 */
import { Link } from "react-router-dom";
import homeImg from "../../assets/images/ai_bg_2.jpg";
import transferIcon from "../../assets/images/Transfer_icon.png";
import entypoAddressIcon from "../../assets/images/EntypoAddress_icon.png";
import coordinateIcon from "../../assets/images/Coordinatemap_icon.png";
import mapIcon from "../../assets/images/Map_icon.png";
import weatherIcon from "../../assets/images/Weather_icon.png";

const HomePage = () => {
  return (
    <section name="home" className="flex w-full h-screen">
      <div className="w-full h-full relative">
        <img
          src={homeImg}
          alt="homtImg"
          className="object-none w-full h-full opacity-70 absolute z-[-1]"
        />
      </div>
      <div className="absolute top-20 z-10">
        <ul className="flex flex-wrap justify-center p-4 m-auto">
          <li className="square bg-blue-500 text-center relative">
            <img
              src={transferIcon}
              alt="transferIcon"
              className="w-[70%] h-[70%] absolute z-[1] hover:hidden"
            />
            <Link
              to="transfer"
              className="z-[2] inset-0 justify-center items-center text-white text-lg"
            >
              Transfer <br /> Excel to JSON
            </Link>
          </li>
          <li className="square bg-green-500 text-center relative">
            <img
              src={entypoAddressIcon}
              alt="entypoAddressIcon"
              className="w-[70%] h-[70%] absolute z-[1] hover:hidden"
            />
            <Link
              to="findcoordinatev1"
              className="z-[2] inset-0 justify-center items-center text-white text-lg"
            >
              Find <br /> Coordinate Version 1
            </Link>
          </li>
          <li className="square bg-red-500 text-center relative">
            <img
              src={coordinateIcon}
              alt="coordinateIcon"
              className="w-[70%] h-[70%] absolute z[1] hover:hidden"
            />
            <Link
              to="findcoordinatev2"
              className="z-[2] inset-0 justify-center items-center text-white text-lg"
            >
              Find <br /> Coordinate Version 2
            </Link>
          </li>
          <li className="square bg-yellow-500 text-center relative">
            <img
              src={mapIcon}
              alt="mapIcon"
              className="w-[70%] h-[70%] absolute z-[1] hover:hidden"
            />
            <Link
              to="kakaomap"
              className="z-[2] inset-0 justify-center items-center text-white text-lg"
            >
              Kakao Map
            </Link>
          </li>
          <li className="square bg-[#85c6f8] text-center relative">
            <img
              src={weatherIcon}
              alt="weatherIcon"
              className="w-[70%] h-[70%] absolute z-[1] hover:hidden"
            />
            <Link
              to="weatherinfo"
              className="z-[2] inset-0 justify-center items-center text-white text-lg"
            >
              Weather Info
            </Link>
          </li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
          <li className="square bg-indigo-500">6</li>
        </ul>
      </div>
    </section>
  );
};

export default HomePage;
