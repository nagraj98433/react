import React, { useEffect } from "react";
import CustomHeading from "../components/heading/CustomHeading";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { Toaster } from "react-hot-toast";
import CustomTabs from "../components/Tabs/CustomTabs";
import { operationsTabs } from "../utilis/constants";
import { Outlet } from "react-router-dom";

function Operations() {
  const breadcrumb = useBreadcrumbData();

  useEffect(() => {
    breadcrumb("operations");
  }, []);
  return (
    <div className="overflow-auto customscrollbar h-100 pb-5">
      <CustomBreadCrumb />
      <Toaster />
      <CustomHeading heading={"Variables & Expressions"} />
      <div className="heroContainerMargin">
        <CustomTabs data={operationsTabs} />
        <Outlet />
      </div>
    </div>
  );
}

export default Operations;
