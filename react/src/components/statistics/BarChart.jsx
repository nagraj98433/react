import React from "react";
import ReactApexChart from "react-apexcharts";
import { themeColor } from "../../utilis/constants";
import { usePageLanguage } from "../../utilis/usePageLanguage";

function BarChart() {
  const pageStaticContent = usePageLanguage("dashboard");
  const chartData = {
    series: [
      {
        name: "Dine-In",
        data: [10000, 15000, 19998],
      },
      {
        name: "Online Order",
        data: [30000, 900, 11138],
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
        fontFamily: "Poppins",
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%",
        },
      },
      xaxis: {
        categories: ["Hotel Romania", "Hotel Ukraine", "Fonda Vela"],
        title: {
          text: "Overall Sale",
        },
      },
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      colors: [themeColor.primary, themeColor.accent],
    },
  };
  return (
    <div className="col-12 col-md-6 col-lg-6 p-2">
      <div className="rounded border">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={393}
        />
      </div>
    </div>
  );
}

export default BarChart;
