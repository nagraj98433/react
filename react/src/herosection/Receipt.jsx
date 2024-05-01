import React, { useEffect } from "react";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomHeading from "../components/heading/CustomHeading";
import ReceiptPreview from "../components/preview/ReceiptPreview";
import ReceiptForm from "../components/form/ReceiptForm";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";

function Receipt() {
  const breadcrumb = useBreadcrumbData();

  useEffect(() => {
    breadcrumb("receipt");
  }, []);

  return (
    <div className="overflow-auto customscrollbar h-100">
      <CustomBreadCrumb />
      <CustomHeading heading={"Manage Receipt Format"} />
      <div className="heroContainerMargin">
        <div className="row g-0 mb-5 pb-5">
          <div className="col-12 col-lg-8 col-md-7">
            <ReceiptForm />
          </div>
          <div className="col-12 col-lg-4 col-md-5 border-start ps-3 d-none d-lg-block d-md-block">
            <ReceiptPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
