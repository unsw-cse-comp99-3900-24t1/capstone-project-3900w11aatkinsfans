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
  const isHovering = React.useRef(false);
  const [cursorType, setCursorType] = React.useState('default')
  const defaultLineWidth = 3;
  const hoverLineWidth = 7;

  React.useEffect(() => {
    fetch('http://localhost:5000/dashboard/overview_data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(data => {
        // set colors
        let datasets = data.entries;
        for (const entry of datasets) {
          // console.log(entry);
          const randomColor = Math.floor(Math.random()*16777215).toString(16);
          entry.borderColor = '#' + randomColor;
          entry.backgroundColor = '#' + randomColor + 'E6';
          entry.hoverBorderWidth = 10;
          entry.tension = 0.1;
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
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Top \'meme\' phrases during 1/08/2008",
              font: { size: 16 }
            },
            legend: { display: false },
            tooltip: {
              intersect: false,
              mode: 'nearest',
              axis: 'xy',
              padding: 10,
              caretPadding: 20,
              caretSize: 10,
              yAlign: 'bottom',
            },
          },
          hover: {
            intersect: true,
          },
          // highlighting when hovering on line
          onHover: onHover,
          // onclick functionality
          onClick: (event, chartElements) => {
            if (chartElements && chartElements.length > 0) {
              const chart = event.chart;
              const datasetIndex = chartElements[0].datasetIndex;
              const datasetItem = chart.data.datasets[datasetIndex];
              console.log("Clicked dataset: " + datasetItem.label);
            }
          }
        })
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const onHover = (event, chartElement) => {
    const chart = event.chart;
    if (!isHovering.current) {
      isHovering.current = true;
      if (chartElement && chartElement.length > 0) {
        setCursorType('pointer');
        const datasetIndex = chartElement[0].datasetIndex;
        chart.data.datasets.forEach(function(dataset, index) {
          if (index === datasetIndex) {
            dataset.borderWidth = hoverLineWidth; // highlighted width
          } else {
            dataset.borderWidth = defaultLineWidth; // default width
          }
        });
        chart.update();
      } else {
        setCursorType('default');
        chart.data.datasets.forEach(function(dataset) {
          dataset.borderWidth = defaultLineWidth; // Reset all datasets to default width
        });
        chart.update();
      }
      // throttle so only sets new line thickness every 100ms
      setTimeout(() => {
        isHovering.current = false;
      }, 100)
    }
  }

  return (
    <>
    <div>
      {
        chartData.datasets.length > 0 ? (
          <div>
            <Line options={chartOptions} data={chartData}
            style={{ height: '600px', cursor: cursorType }}/>
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