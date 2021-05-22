export const barChart = {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            { 
                data: [],
                label: "Time Spent in Minutes",
                fillColor: "red",
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2
            },
            // { 
            //     data: [65, 59, 80, 81, 56, 55, 40],
            //     label: "Failed",
            //     fillColor: "green",
            //     backgroundColor: 'rgba(255, 205, 86, 0.2)',
            //     borderColor: 'rgb(255, 205, 86)',
            //     borderWidth: 2           
            // },
            // {
            // label: 'My First Dataset',
            // data: [65, 59, 80, 81, 56, 55, 40],
            // backgroundColor: 'rgba(75, 192, 192, 0.2)',
            // borderColor: 'rgb(255, 205, 86)',
            // borderWidth: 2
            // }
        ]
    },
    options: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                padding: 1
              }
            }
          ]
        }
      }
  };

export default barChart;