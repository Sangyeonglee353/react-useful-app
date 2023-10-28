import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  plugins,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  plugins
);

// const data = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // fcstTime
//   datasets: [
//     {
//       type: "line", // temperature
//       label: "Dataset 1",
//       borderColor: "rgb(54, 162, 235)",
//       borderWidth: 2,
//       data: [1, 2, 3, 4, 5, 6],
//     },
//     {
//       type: "bar", // watervalue
//       label: "Dataset 2",
//       bordergroundColor: "rgb(255, 99, 132)",
//       data: [1, 2, 3, 4, 5, 6],
//       borderColor: "red",
//       borderWidth: 2,
//     },
//   ],
// };

const Chart = (props) => {
  const [data, setData] = useState({
    labels: ["0800", "0900", "1000", "1100", "1200", "1300"],
    datasets: [
      {
        type: "line",
        label: "temperatureData",
        yAxisID: "y1",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 2,
        data: [1, 2, 3, 4, 5, 6],
        fill: false,
      },
      {
        type: "bar",
        label: "humidityData",
        yAxisID: "y2",
        backgroundColor: "rgb(255, 99, 132)",
        data: [60, 70, 30, 40, 50, 70],
        borderColor: "red",
        borderWidth: 2,
        // showLine: false,
      },
    ],
  });

  const options = {
    responsive: true,
    scales: {
      y1: {
        type: "linear",
        position: "left",
        grid: { display: false },
      },
      y2: {
        type: "linear",
        position: "right",
        grid: { display: false },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    // 그래프 위에 데이터 표시
    plugins: {
      datalabels: {
        display: true,
        align: "top",
        formatter: (value, context) => value,
      },
    },
  };

  return (
    <div className="w-full h-full">
      {/* {console.log("test")} */}
      {console.log("weatherData: ", props.weatherData)}
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart;
