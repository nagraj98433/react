import React from "react";
import "./Layout.css";
import CustomNavbar from "../components/navbar/CustomNavbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="vh-100 vw-100 overflow-hidden">
      <CustomNavbar />
      <Outlet />
    </div>
  );
}

export default Layout;
