import React, { useEffect } from "react";
import CustomHeading from "../components/heading/CustomHeading";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import NotificationsForm from "../components/form/NotificationsForm";
import CustomerDetails from "./CustomerDetails";

function Notifications() {
  const breadcrumb = useBreadcrumbData();

  useEffect(() => {
    breadcrumb("notification");
  }, []);
  return (
    <>
      <div className="overflow-auto customscrollbar h-100 pb-5">
        <CustomBreadCrumb />
        <CustomHeading heading={"Manage Notifications"} />
        <div className="heroContainerMargin">
          <div className="row g-0 mb-5 pb-5">
            <div className="col-12 col-lg-4 col-md-4 border-end">
              <CustomerDetails />
            </div>
            <div className="col-12 col-lg-8 col-md-8">
              <NotificationsForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notifications;
