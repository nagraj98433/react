import React from "react";
import ReactApexChart from "react-apexcharts";

function CustomPieChart() {
  const chartData = {
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["A", "B", "C", "D", "E"],
      colors: ["#FF4560", "#008FFB", "#FEB019", "#00E396", "#775DD0"],
      responsive: [
        {
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  return (
    <div className="col-12 col-md-6 col-lg-6">
      <div className="border rounded">
        <div id="chart">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomPieChart;
