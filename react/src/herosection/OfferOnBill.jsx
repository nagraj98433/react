import React from "react";
import OfferOnBillForm from "../components/form/OfferOnBillForm";
import OfferOnBillList from "../components/list/OfferOnBillList";

function OfferOnBill() {
  return (
    <div className="row mt-3 g-0">
      <div className="col-6">
        <OfferOnBillForm />
      </div>
      <div className="col-6">
        <OfferOnBillList />
      </div>
    </div>
  );
}

export default OfferOnBill;
