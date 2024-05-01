import React, { useEffect, useState } from "react";
import RestaurantFeaturesCard from "../components/cards/restaurantFeaturesCard/RestaurantFeaturesCard";
import { restaurantFeacturesArray } from "../utilis/constants";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { handleMenuCatalogList } from "../store/menuCatalogSlice";
import { useDispatch } from "react-redux";
import { orderFlowList } from "../store/orderFlowSlice";
import { handleTaxList } from "../store/taxSlice";
import { handleOfferList } from "../store/offerSlice";
import { handleActiveTab } from "../store/qrThemeSlice";

function RestaurantFeatures() {
  const handleBreadcrumb = useBreadcrumbData();
  const dispatch = useDispatch();

  const [features, setFeatures] = useState([]);

  const handleAccess = () => {
    setFeatures(restaurantFeacturesArray);
  };

  useEffect(() => {
    handleBreadcrumb("features");
    handleAccess();
    dispatch(handleActiveTab("orderFlow"));
    dispatch(handleMenuCatalogList([]));
    dispatch(orderFlowList([]));
    dispatch(handleTaxList([]));
    dispatch(handleOfferList([]));
  }, []);
  return (
    <>
      <CustomBreadCrumb />
      <div className="row g-0 my-5 justify-content-center">
        <div className="col-9">
          <div className="row">
            {features &&
              features.map((feature) => {
                return (
                  <RestaurantFeaturesCard key={feature.id} data={feature} />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default RestaurantFeatures;
