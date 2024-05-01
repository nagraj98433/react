import React from "react";
import ItemOffersForm from "../components/form/ItemOffersForm";
import ItemOffersList from "../components/list/ItemOffersList";

function OfferOnItem() {
  return (
    <div className="row mt-3 g-0">
      <div className="col-6">
        <ItemOffersForm />
      </div>
      <div className="col-6">
        <ItemOffersList />
      </div>
    </div>
  );
}

export default OfferOnItem;
