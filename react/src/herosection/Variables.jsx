import React from "react";
import VariableList from "../components/list/VariableList";
import VariableForm from "../components/form/VariableForm";

function Variables() {
  return (
    <div className="row mt-3 g-0">
      <div className="col-6">
        <VariableForm />
      </div>
      <div className="col-6">
        <VariableList />
      </div>
    </div>
  );
}

export default Variables;
