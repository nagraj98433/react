import React from "react";
import Restaurants from "./Restaurants";
import { Toaster } from "react-hot-toast";
import DashboardStatistics from "./DashboardStatistics";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Toaster />
      <div className="statistics-container hidescrollbar">
        <DashboardStatistics />
      </div>
      <div className="restaurantList-container d-none d-lg-block d-xl-block">
        <Restaurants />
      </div>
    </div>
  );
}

export default Dashboard;
