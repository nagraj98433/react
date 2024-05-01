import React from "react";
import MenuForm from "../components/form/MenuForm";
import MenuList from "../components/list/MenuList";

function ManageMenu() {
  return (
    <div className="row">
      <div className="col-12 col-lg-6 col-md-6 mt-4">
        <MenuForm />
      </div>
      <div className="col-1 d-none d-lg-block d-md-block border-end"></div>
      <div className="col-12 d-block d-lg-none d-md-none"></div>
      <div className="col-12 col-lg-5 col-md-5 mt-5">
        <MenuList />
      </div>
    </div>
  );
}

export default ManageMenu;
