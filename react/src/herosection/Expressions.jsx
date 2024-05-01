import React from "react";
import ExpressionForm from "../components/form/ExpressionForm";
import ExpressionList from "../components/list/ExpressionsList";

function Expressions() {
  return (
    <div className="row mt-3 pb-5 mb-5 g-0">
      <div className="col-6">
        <ExpressionForm />
      </div>
      <div className="col-6">
        <ExpressionList />
      </div>
    </div>
  );
}

export default Expressions;
