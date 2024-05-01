import React, { useEffect } from "react";
import CustomHeading from "../components/heading/CustomHeading";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import PaymentForm from "../components/form/PaymentForm";
import PaymentList from "../components/list/PaymentList";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";

function Payment() {
  const breadcrumb = useBreadcrumbData();

  useEffect(() => {
    breadcrumb("payment");
  }, []);
  return (
    <div className="overflow-auto customscrollbar h-100 pb-5">
      <CustomBreadCrumb />
      <CustomHeading heading={"Manage Payment"} />
      <div className="heroContainerMargin">
        <div className="row">
          <div className="col-12 col-lg-5 col-md-5">
            <PaymentForm />
          </div>
          <div className="col-1 border-end d-none d-lg-block d-md-block"></div>
          <div className="col-12 mb-3 border-bottom d-block d-lg-none d-md-none"></div>
          <div className="col-12 col-lg-6 col-md-6 ps-4">
            <PaymentList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
