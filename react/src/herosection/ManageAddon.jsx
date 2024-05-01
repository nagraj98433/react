import React, { useState, useEffect } from "react";
import MenuAddOn from "../components/form/MenuAddOn";
import AddOnPreviewTest from "./AddonPreviewTest";
import { useSelector } from "react-redux";
import Spinner from "../components/loaders/Spinner";

function ManageAddon() {
  const isAddonShow = useSelector((state) => state.activeItemData.isShowAddon);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="row">
      <div className="col-12 col-lg-6 col-md-6 mt-4">
        <MenuAddOn />
      </div>
      <div className="customDivider">
        <span></span>
      </div>
      <div className="ps-1">
        {isLoading ? (
          <div className="text-center text-lg">
            <Spinner /> {""}
            Loading...
          </div>
        ) : isAddonShow ? (
          <AddOnPreviewTest />
        ) : (
          <div className="text-danger fs-3 text-center">Addon Not Found</div>
        )}
      </div>
    </div>
  );
}

export default ManageAddon;
