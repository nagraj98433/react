import React, { useEffect } from "react";
import QRForm from "../components/form/QRForm";
import CustomHeading from "../components/heading/CustomHeading";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import TablesList from "../components/list/TablesList";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";

function Tables() {
  const breadcrumb = useBreadcrumbData();

  useEffect(() => {
    breadcrumb("qr");
  }, []);
  return (
    <div className="overflow-auto h-100 customscrollbar pb-5">
      <CustomBreadCrumb />
      <CustomHeading heading={"Manage QR Code"} />
      <div className="heroContainerMargin">
        <div className="row g-0 gap-5">
          <div className="col">
            <QRForm />
            {/* <div className="customDivider">
              <span></span>
            </div>
            <StaffGroupList /> */}
          </div>
          <div className="vr d-none d-md-block d-lg-block"></div>
          <div className="d-block d-md-none d-lg-none border-bottom"></div>
          <div className="col">
            <TablesList />
            {/* <div className="customDivider">
              <span></span>
            </div>
            <TablesList /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tables;
