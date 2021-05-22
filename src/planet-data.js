export const planetChartData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Event Count (Frequency)",
        data: [],
        backgroundColor: "rgba(54,73,93,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
        hoverOffset: 4
      }
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

export default planetChartData;