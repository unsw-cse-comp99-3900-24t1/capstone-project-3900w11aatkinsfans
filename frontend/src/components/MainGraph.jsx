import React from 'react';
// import Chart from 'chart.js/auto'

export default function MainGraph () {
  const [chartConfig, setChartConfig] = React.useState({
    type: 'scatter',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      showLine: true
    }
  });

  React.useEffect(() => {
    fetch('http://localhost:5000/dashboard/overview_data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);

        // let labels = [];
        // let datasets = [];
        // for (let i = 1; i <= 10; i++) {
        //   let entry = {
        //     label: data[i].Name,
        //     data: 
        //   }
        // }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  // React.useEffect(() => {
    // setChartData({
    //   labels: result.data.map((item, index) => [item[' "Year"']]).filter( String ),
    //   datasets: [
    //     {
    //       label: "OSCAR WINNER",
    //       data: result.data.map((item, index) => [item[' "Age"']]).filter( Number ),
    //       borderColor: "black",
    //       backgroundColor: "red"
    //     }
    //   ]
    // });
    // setChartOptions({
    //   responsive: true,
    //   plugins: {
    //     legend: {
    //       position: 'top'
    //     },
    //     title: {
    //       display: true,
    //       text: "ALL OSCAR WINNERS SINCE 1928"
    //     }
    //   }
    // })
  // }, [])

  return (
    <>
      Sadge graph
    </>
  )
}