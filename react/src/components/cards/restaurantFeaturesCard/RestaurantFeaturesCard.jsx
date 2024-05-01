import React from "react";
import "./RestaurantFeaturesCard.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RestaurantFeaturesCard({ data }) {
  const restaurantId = useSelector(
    (state) => state.activeItemData.restaurantId
  );

  const navigate = useNavigate();
  return (
    <div className="col-6 col-lg-2 col-md-2 col-xl-2">
      <div
        onClick={() =>
          !data?.isDisabled &&
          navigate(`/main/outlet/${restaurantId}${data?.navigate}`)
        }
        className={`text-center p-2 rounded ${
          !data?.isDisabled && "cursor-pointer featuresCard"
        }`}
      >
        <div
          className={`${data?.icon} ${data?.isDisabled && "opacity-50"}`}
        ></div>
        <div
          className={`${
            data?.isDisabled ? "secondary-text" : "primary-text"
          } fw-medium featureText`}
        >
          {data?.name}
        </div>
      </div>
    </div>
  );
}

export default RestaurantFeaturesCard;
