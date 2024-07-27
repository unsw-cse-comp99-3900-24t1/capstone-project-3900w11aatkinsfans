import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2'
import { COLOUR_PALETTE } from '../assets/constants';
import QuestionButton from './QuestionButton';
import Slider from '@mui/material/Slider';
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
  const chartRef = React.useRef(null);
  const [chartData, setChartData] = React.useState({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = React.useState({});
  const isHovering = React.useRef(false);
  const [cursorType, setCursorType] = React.useState('default');
  const defaultLineWidth = 3;
  const hoverLineWidth = 7;
  const [maxTimeRange, setMaxTimeRange] = React.useState([]);
  const [sliderMarks, setSliderMarks] = React.useState([{}]);
  const [sliderValues, setSliderValues] = React.useState([0, 100]);
  const isSliding = React.useRef(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // to avoid double loading in dev mode
    let isMounted = true;
    
    const fetchData = async () => {
      for (let i = 0; i <= 4; i++) {
        let filename = 'cluster_' + i;
        try {
          const response = await fetch((process.env.REACT_APP_BACKEND_URL ||
            'http://localhost:5000') + '/clusters/' + filename);
          if (!response.ok) {
            throw new Error('Bad response');
          }
          const data = await response.json();
          if (isMounted) {
            // set colors and dataset options
            let dataset = data.popularityCurve;
            dataset.borderColor = COLOUR_PALETTE[i-1];
            dataset.backgroundColor = COLOUR_PALETTE[i-1] + 'E6';
            dataset.hoverBorderWidth = 10;
            dataset.tension = 0.1;
            dataset.id = i;
            // set chart data
            // only update xLabels if a dataset with more values are found
            setChartData(prevChartData => ({
              labels: dataset.xLabels.length > prevChartData.labels.length ?
              dataset.xLabels : prevChartData.labels,
              datasets: [...prevChartData.datasets, dataset],
            }));
            setMaxTimeRange(prevTimeRange => {
              return dataset.xLabels.length > prevTimeRange.length ?
              dataset.xLabels : prevTimeRange;
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchData();

    // set chart options
    setChartOptions({
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (H:MM)',
            font: { size: 14, weight: 'bold' }
          },
          ticks: {
            maxTicksLimit: 20,
          }
        },
        y: {
          title: {
            display: true,
            text: 'Volume',
            font: { size: 14, weight: 'bold' }
          },
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Top 'meme' phrases during 1/08/2008",
          font: { size: 16 }
        },
        legend: {
          display: true,
          position: 'right',
          maxWidth: 300,
          title: {
            text: 'Memes Legend',
            display: true,
            font: {
              size: 20
            }
          },
        },
        tooltip: {
          intersect: false,
          mode: 'nearest',
          axis: 'xy',
          padding: 10,
          caretPadding: 20,
          caretSize: 10,
          filter: (tooltipItem) => {
            if (tooltipItem.datasetIndex && tooltipItem.datasetIndex === 1) {
              return tooltipItem;
            }
            return tooltipItem;
          },
          callbacks: {
            title: (context) => {
              let meme = context[0].dataset.label;
              if (meme.length > 100) {
                meme = meme.slice(0, 100) + "..."
              }
              return "\"" + meme + "\"";
            },
            label: (context) => {
              return "Time: " + context.label + ", Count: " + context.raw;
            },
            footer: () => {
              return "Click on chart to goto page"
            }
          }
        },
      },
      hover: {
        intersect: false,
      },
      // highlighting when hovering on line
      onHover: onHover,
      // onclick functionality to navigate to corresponding page
      onClick: onClick
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const onHover = (event, chartElement) => {
    const chart = event.chart;
    if (!isHovering.current) {
      isHovering.current = true;
      if (chartElement && chartElement.length > 0) {
        setCursorType('pointer');
        const datasetIndex = chartElement[0].datasetIndex;
        chart.data.datasets.forEach((dataset, index) => {
          if (index === datasetIndex) {
            dataset.borderWidth = hoverLineWidth; // highlighted width
          } else {
            dataset.borderWidth = defaultLineWidth; // default width
          }
        });
        chart.update();
      } else {
        setCursorType('default');
        chart.data.datasets.forEach((dataset) => {
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

  const onClick = (event, chartElements) => {
    if (chartElements && chartElements.length > 0) {
      const chart = event.chart;
      const datasetIndex = chartElements[0].datasetIndex;
      const datasetItem = chart.data.datasets[datasetIndex];
      navigate(`/meme/${datasetItem.id}`);
    }
  }

  // set time range slider whenever max range changes
  React.useEffect(() => {
    setSliderMarks([
      {
        value: 0,
        label: maxTimeRange[0],
      },
      {
        value: 100,
        label: maxTimeRange[maxTimeRange.length - 1],
      }
    ])
  },[maxTimeRange]);

  // update chart range when time range slider changes
  const onSliderChange = (event, newVals) => {
    if (!isSliding.current) {
      isSliding.current = true;
      const len = maxTimeRange.length;
      const newLow = Math.floor(len * newVals[0] / 100);
      const newHigh = Math.floor(len * newVals[1] /100);
      const newTimeRange = maxTimeRange.slice(newLow, newHigh);

      chartRef.current.data.labels = newTimeRange;
      chartRef.current.data.datasets.forEach(dataset => {
        dataset.data = chartData.datasets[dataset.id].data.slice(newLow, newHigh);
      });
      chartRef.current.update();
    }
    // throttle to only update chart every 100ms
    setTimeout(() => {
      isSliding.current = false;
    }, 100)
  };

  return (
    <>
      {
        chartData.datasets.length > 0 ? (
          <div style={{ position: 'relative' }}>
            <div style={{ height: '600px', margin: '0 10px', cursor: cursorType }}>
              <Line ref={chartRef} options={chartOptions} data={chartData}/>
            </div>
            <QuestionButton title='How To Use'
            text={
            <>
            This graph shoes the popularity of meme clusters (closely related memes) against time. <br/> <br/>
            • Hover cursor on graph. The closest meme will be highlighted. <br/>
            • When a meme is highlighted, click anywhere on the chart area to go to its meme page. <br/>
            • Memes can be filtered out by clicking on the legend entry. <br/>
            • Drag the slider to adjust the time range.
            </>
            }
            style={{ position: 'absolute', top: '5px', right: '5px'}}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
              position: 'absolute', bottom: '5px', right: '40px' }}>
              <span>Time Range</span>
              <Slider
                getAriaLabel={() => 'Time Range Slider'}
                defaultValue={sliderValues}
                marks={sliderMarks}
                onChange={onSliderChange}
                style={{ width: '200px', color: COLOUR_PALETTE[1] }}
              />
            </div>
          </div>
        ) : (
          <div>
            Loading chart data...
          </div>
        )
      }
    </>
  )
}