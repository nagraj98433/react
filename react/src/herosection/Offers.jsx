import React, { useEffect } from "react";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { Toaster } from "react-hot-toast";
import CustomHeading from "../components/heading/CustomHeading";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomTabs from "../components/Tabs/CustomTabs";
import { offerTabs } from "../utilis/constants";
import { Outlet } from "react-router-dom";

function Offers() {
  const breadcrumb = useBreadcrumbData();

  useEffect(() => {
    breadcrumb("offer");
  }, []);

  return (
    <div className="overflow-auto customscrollbar h-100 pb-5">
      <CustomBreadCrumb />
      <Toaster />
      <CustomHeading heading={"Offers"} />
      <div className="heroContainerMargin">
        <CustomTabs data={offerTabs} />
        <Outlet />
      </div>
    </div>
  );
}

export default Offers;
