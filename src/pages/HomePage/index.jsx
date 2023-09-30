import { Link } from "react-router-dom";

/* 기본 기능 나열 소개 페이지 */

const HomePage = () => {
  return (
    <section name="home" className="flex w-full h-screen bg-zinc-200">
      <ul className="flex flex-wrap justify-center p-4 m-auto">
        <li className="square bg-blue-500 text-center">
          <Link to="transfer">
            Transfer <br /> Excel to JSON
          </Link>
        </li>
        <li className="square bg-green-500 text-center">
          <Link to="findcoordinatev1">
            Find <br /> Coordinate Version 1
          </Link>
        </li>
        <li className="square bg-red-500 text-center">
          <Link to="findcoordinatev2">
            Find <br /> Coordinate Version 2
          </Link>
        </li>
        <li className="square bg-yellow-500 text-center">
          <Link to="kakaomap">Kakao Map</Link>
        </li>
        <li className="square bg-purple-500">5</li>
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
    </section>
  );
};

export default HomePage;
