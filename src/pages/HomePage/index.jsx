import { Link } from "react-router-dom";

/* 기본 기능 나열 소개 페이지 */

const HomePage = () => {
  return (
    <section name="home" className="flex w-full h-screen bg-zinc-200">
      <ul className="flex flex-wrap justify-center p-4 m-auto">
        <li className="square bg-blue-500">
          <Link to="transfer">Excel to JSON</Link>
        </li>
        <li className="square bg-green-500">Count type length</li>
        <li className="square bg-red-500">3</li>
        <li className="square bg-yellow-500">4</li>
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
