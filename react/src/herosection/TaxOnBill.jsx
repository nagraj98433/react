import React from "react";
import TaxOnBillForm from "../components/form/TaxOnBillForm";
import TaxOnBillList from "../components/list/TaxOnBillList";

function TaxOnBill() {
  return (
    <div className="row mt-3 g-0">
      <div className="col-6">
        <TaxOnBillForm />
      </div>
      <div className="col-6">
        <TaxOnBillList />
      </div>
    </div>
  );
}

export default TaxOnBill;
