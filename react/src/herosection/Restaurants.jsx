import React, { useEffect, useState } from "react";
import CustomButton from "../components/buttons/CustomButton";
import { themeColor } from "../utilis/constants";
import { useNavigate } from "react-router-dom";
import RestaurantDetails from "../components/cards/restaurantDetailsCard/RestaurantDetailsCard";
import { useSelector } from "react-redux";
import RestoCardShimmer from "../components/shimmers/restaurantCard/RestoCardShimmer";
import { MdAddCircle } from "react-icons/md";
import { useRestaurantListApi } from "../global_apis/useRestaurantListApi";
import { usePageLanguage } from "../utilis/usePageLanguage";

function Restaurants() {
  const restoList = useSelector((state) => state.restoListData.data);

  const pageStaticContent = usePageLanguage("dashboard");
  const navigate = useNavigate();
  const fetchRestaurantList = useRestaurantListApi();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    !restoList.length && fetchRestaurantList(setIsLoading);
  }, []);
  return (
    <div
      style={{ height: "89vh" }}
      className="rounded border m-2 overflow-auto hidescrollbar"
    >
      <div className="row g-0 position-relative z-1">
        <div className="col-12 p-1 sticky-top bg-white shadow-sm rounded">
          <CustomButton
            handleClick={() => navigate("/main/outlet/new")}
            name={pageStaticContent?.["00084"]}
            bgColor={themeColor.primary}
            preIcon={<MdAddCircle />}
          />
        </div>
        <div className="col-12 pb-5">
          <div className="fw-medium formLabelText m-2">
            {pageStaticContent?.["00085"]}
          </div>
          <div className="row g-0">
            {isLoading ? (
              <>
                <RestoCardShimmer />
                <RestoCardShimmer />
                <RestoCardShimmer />
              </>
            ) : (
              <>
                {restoList.length ? (
                  restoList.map((resto) => {
                    return (
                      <RestaurantDetails key={resto.outlet_id} data={resto} />
                    );
                  })
                ) : (
                  <div className="text-danger my-4 text-center">
                    {pageStaticContent?.["00086"]}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Restaurants;
