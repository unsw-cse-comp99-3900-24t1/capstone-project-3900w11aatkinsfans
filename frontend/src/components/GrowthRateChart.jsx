import React from "react";
import { Line } from "react-chartjs-2";
import { COLOUR_PALETTE } from "../assets/constants";
import QuestionButton from "./QuestionButton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/** Growth rate chart takes in props.data = 
 * {
 *  data: [numbers], 
    xLabels: [strings], 
    label: string,
 * }
**/
export default function GrowthRateChart(props) {
  const [chartData, setChartData] = React.useState({});
  const [chartOptions, setChartOptions] = React.useState({});

  React.useEffect(() => {
    const dataset = props.data;
    dataset.borderColor = COLOUR_PALETTE[6];
    dataset.backgroundColor = COLOUR_PALETTE[6] + "E6";
    dataset.hoverBorderWidth = 10;
    dataset.tension = 0.1;
    setChartData({
      labels: dataset.xLabels,
      datasets: [dataset],
    });
    setChartOptions({
      scales: {
        x: {
          title: {
            display: true,
            text: "TODO: X-axis label",
            font: { size: 12, weight: "bold" },
          },
          ticks: {
            maxTicksLimit: 10,
          },
        },
        y: {
          title: {
            display: true,
            text: "TODO: Growth Rate label",
            font: { size: 12, weight: "bold" },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Growth Rate",
          font: { size: 18 },
        },
        legend: { display: false },
        tooltip: {
          intersect: false,
          mode: "nearest",
          axis: "xy",
          padding: 5,
          caretPadding: 10,
          caretSize: 5,
          callbacks: {
            title: (context) => {
              let label = context[0].dataset.label;
              if (label.length > 100) {
                label = label.slice(0, 100) + "...";
              }
              return label;
            },
            label: (context) => {
              return "TODO: x: " + context.label + ", y: " + context.raw;
            },
          },
        },
      },
      hover: {
        intersect: false,
      },
    });
  }, []);

  return (
    <>
      {chartData.datasets ? (
        <div style={{ position: "relative" }}>
          <Line
            options={chartOptions}
            data={chartData}
            style={{ height: "400px" }}
          />
          <QuestionButton
            title="Growth Rate"
            text="TODO: This graph shows how likely the meme will grow for a given x value..."
            style={{ position: "absolute", top: "-10px", right: "0" }}
          />
        </div>
      ) : (
        <div>Loading chart data...</div>
      )}
    </>
  );
}
