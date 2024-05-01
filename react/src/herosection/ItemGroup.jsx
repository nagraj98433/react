import React from "react";
import ItemGroupForm from "../components/form/ItemGroupForm";
import ItemGroupList from "../components/list/ItemGroupList";

function ItemGroup() {
  return (
    <div className="row mt-3 pb-5 g-0">
      <div className="col-6">
        <ItemGroupForm />
      </div>
      <div className="col-6">
        <ItemGroupList />
      </div>
    </div>
  );
}

export default ItemGroup;
