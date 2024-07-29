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
            text: "Number of Clusters",
            font: { size: 12, weight: "bold" },
          },
          ticks: {
            maxTicksLimit: 16,
          },
        },
        y: {
          title: {
            display: true,
            text: "Probability",
            font: { size: 12, weight: "bold" },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Growth Rate - Yule Simon Distribution",
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
              return (
                "No. clusters: " +
                context.label +
                ", Probability: " +
                context.raw
              );
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
            title="Yule Simon Distribution"
            text="The growth rate of memes can be modelled using the
            Yule-Simon distribution using a growth rate factor.
            The predict function searches for similar existing memes
            to predict the evolution of unseen memes.
            The graph shows the probability distribution
            of the meme growing to k-sized clusters for k from 1-50."
            style={{ position: "absolute", top: "-10px", right: "0" }}
          />
        </div>
      ) : (
        <div>Loading chart data...</div>
      )}
    </>
  );
}
