import React, { useEffect } from "react";
import CustomHeading from "../components/heading/CustomHeading";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { Toaster } from "react-hot-toast";
import CustomTabs from "../components/Tabs/CustomTabs";
import { taxTabs } from "../utilis/constants";
import { Outlet } from "react-router-dom";

function TaxAndAdditionalCharges() {
  const breadcrumb = useBreadcrumbData();

  useEffect(() => {
    breadcrumb("taxAndOther");
  }, []);
  return (
    <div className="overflow-auto customscrollbar h-100 pb-5">
      <CustomBreadCrumb />
      <Toaster />
      <CustomHeading heading={"Taxes & Others Charges"} />
      <div className="heroContainerMargin">
        <CustomTabs data={taxTabs} />
        <Outlet />
      </div>
    </div>
  );
}

export default TaxAndAdditionalCharges;
