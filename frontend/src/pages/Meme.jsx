import React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Line } from 'react-chartjs-2';
import { COLOUR_PALETTE } from '../assets/constants';
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

const TopFlexDiv = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '40px',
  margin: '3vh 3vw 30px 3vw',
});

const PopularityGraphDiv = styled('div')({
  width: '50vw',
  height: '420px',
  backgroundColor: 'white',
  justifyContent: 'center',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
});

const TextBoxDiv = styled('div')({
  width: '40vw',
  height: '440px',
  borderRadius: '12px',
  padding: '10px 30px',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
});

function MemePage() {
  const { id } = useParams();
  const [memeName, setMemeName] = React.useState("");
  const [chartData, setChartData] = React.useState({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = React.useState({});
  const [totalPosts, setTotalPosts] = React.useState(0);
  const [totalMutations, setTotalMutations] = React.useState(0);
  const [largestMutation, setLargestMutation] = React.useState("");
  const [largestMutAmount, setlargestMutAmount] = React.useState(0);

  // load up meme
  React.useEffect(() => {
    let filename = 'cluster_' + id;
    fetch((process.env.REACT_APP_BACKEND_URL ||
      'http://localhost:5000') + '/clusters/sample1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(data => {
        const dataset = data.popularityCurve;
        setMemeName('\"' + dataset.label + '\"');
        setTotalPosts(Math.max(dataset.data.reduce((sum, current) =>
          sum + current, 0)));
        setTotalMutations(data.clusterList.length);
        setLargestMutation(data.clusterList[0].phrase);
        setlargestMutAmount(data.clusterList[0].count);
        createGraph(dataset);
      })
      .catch(err => {
        console.log(err);
      });
  },[]);

  const createGraph = (dataset) => {
    dataset.borderColor = COLOUR_PALETTE[0];
    dataset.backgroundColor = COLOUR_PALETTE[0] + 'E6';
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
            text: 'Time (H:MM)',
            font: { size: 12, weight: 'bold' }
          },
          ticks: {
            maxTicksLimit: 10,
          }
        },
        y: {
          title: {
            display: true,
            text: 'Volume',
            font: { size: 12, weight: 'bold' }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Meme Popularity",
          font: { size: 14 }
        },
        legend: { display: false },
        tooltip: {
          intersect: false,
          mode: 'nearest',
          axis: 'xy',
          padding: 5,
          caretPadding: 10,
          caretSize: 5,
          yAlign: 'bottom',
        },
      },
      hover: {
        intersect: false,
      },
    });
  };

  // You can now use the id to fetch data or perform any other action
  return (
    <>
      <h2 style={{marginLeft: '3vw', color: '#0D2633'}}>{memeName}</h2>
      <TopFlexDiv>
        <PopularityGraphDiv>
          {
            chartData.datasets.length > 0 ? (
              <div>
                <Line options={chartOptions} data={chartData}
                style={{ height: '400px'}}/>
              </div>
            ) : (
              <div>
                Loading chart data...
              </div>
            )
          }
        </PopularityGraphDiv>
        <TextBoxDiv>
          {
            memeName === "" ? (<></>) : (
              <div>
                <h3>About</h3>
                <b>{memeName}</b> is a meme that has gained over {totalPosts} posts
                and reposts over a span of 24 hours.
                <h3>Spread</h3>
                Our database and clustering algorithm have detected at
                least {totalMutations} variants of this meme.
                <br/>
                The most popular variant was "<i>{largestMutation}</i>" which was
                detected within {largestMutAmount} posts.
                {/* TODO: More information to be added in the future */}
              </div>
            )
          }
        </TextBoxDiv>
      </TopFlexDiv>
    </>
  );
}

export default MemePage;