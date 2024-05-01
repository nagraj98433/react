import React from "react";
import TaxForm from "../components/form/TaxForm";
import TaxList from "../components/list/TaxList";

function TaxOnItem() {
  return (
    <div className="row mt-3 g-0">
      <div className="col-6">
        <TaxForm />
      </div>
      <div className="col-6">
        <TaxList />
      </div>
    </div>
  );
}

export default TaxOnItem;
