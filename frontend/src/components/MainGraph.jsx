import React from 'react';
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MainGraph () {
  const [chartData, setChartData] = React.useState({
    datasets: []
  });
  const [chartOptions, setChartOptions] = React.useState({});

  React.useEffect(() => {
    fetch('http://localhost:5000/dashboard/overview_data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(data => {
        // console.log(data.xLabels);
        // console.log(data.entries);
        // set colors
        let datasets = data.entries;
        for (const entry of datasets) {
          const randomColor = Math.floor(Math.random()*16777215).toString(16);
          entry.borderColor = '#' + randomColor;
          entry.backgroundColor = '#' + randomColor + 'E6';
        }
        // set chart data and options
        setChartData({
          labels: data.xLabels,
          datasets: datasets
        })
        setChartOptions({
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time (H:MM)',
                font: { size: 14, weight: 'bold' }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Volume',
                font: { size: 14, weight: 'bold' }
              }
            }
          },
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Top \'meme\' phrases during 1/08/2008",
              font: { size: 16 }
            },
            legend: { display: false },
          }
        })
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <>
    <div style={{ width: '80%' }}>
      {
        chartData.datasets.length > 0 ? (
          <div>
            <Line options={chartOptions} data={chartData}/>
          </div>
        ) : (
          <div>
            Loading...
          </div>
        )
      }
    </div>
    </>
  )
}