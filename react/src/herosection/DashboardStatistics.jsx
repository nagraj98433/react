import React from "react";
import CountCard from "../components/cards/countCard/CountCard";
import AreaChart from "../components/statistics/AreaChart";
import BarChart from "../components/statistics/BarChart";
import { usePageLanguage } from "../utilis/usePageLanguage";

function DashboardStatistics() {
  const pageStaticContent = usePageLanguage("dashboard");
  const countCardData = [
    {
      id: 1,
      count: "20M",
      name: pageStaticContent?.["00079"],
    },
    {
      id: 2,
      count: "100K",
      name: pageStaticContent?.["00080"],
    },
    {
      id: 3,
      count: "55",
      name: pageStaticContent?.["00081"],
    },
  ];
  return (
    <div className="text-center">
      Admin Dashboard
      {/* <div className="row g-0 m-2">
        {countCardData &&
          countCardData.map((cardData) => {
            return <CountCard key={cardData.id} data={cardData} />;
          })}
      </div>
      <div className="row g-0 m-2 pb-5">
        <AreaChart />
        <BarChart />
      </div> */}
    </div>
  );
}

export default DashboardStatistics;
