import React from "react";
import ReactApexChart from "react-apexcharts";
import { themeColor } from "../../utilis/constants";
import { Dropdown } from "react-bootstrap";
import { usePageLanguage } from "../../utilis/usePageLanguage";

function AreaChart() {
  const pageStaticContent = usePageLanguage("dashboard");
  const chartData = {
    series: [
      {
        name: "Hotel Romania",
        data: [10000, 15000, 50000, 20000, 30000, 35000],
      },
    ],
    options: {
      chart: {
        type: "area",
        toolbar: {
          show: false,
        },
        fontFamily: "Poppins",
      },
      xaxis: {
        categories: ["01", "06", "12", "18", "24", "30"],
      },
      yaxis: {
        title: {
          text: pageStaticContent?.["00082"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      colors: [themeColor.primary],
    },
  };
  return (
    <div className="col-12 col-md-6 col-lg-6 p-2">
      <div className="rounded border">
        <div className="d-flex align-items-center justify-content-end gap-2">
          <Dropdown>
            <Dropdown.Toggle
              className="fw-medium"
              style={{ fontSize: "12px" }}
              variant="white"
            >
              Hotel Romania
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Hotel Romania</Dropdown.Item>
              <Dropdown.Item>Hotel Ukraine</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle
              className="fw-medium"
              style={{ fontSize: "12px" }}
              variant="white"
            >
              Jan
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Jan</Dropdown.Item>
              <Dropdown.Item>Feb</Dropdown.Item>
              <Dropdown.Item>Mar</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={360}
        />
      </div>
    </div>
  );
}

export default AreaChart;
