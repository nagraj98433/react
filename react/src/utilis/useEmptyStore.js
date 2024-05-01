import { useDispatch } from "react-redux";
import { userInfo } from "../store/userSlice";
import { handleUserCredentials } from "../store/userCredentialsSlice";
import { getRestaurantList } from "../store/restoSlice";
import { handleActiveItem } from "../store/activeItemSlice";
import { orderFlowList } from "../store/orderFlowSlice";
import { removeAmazonUrls } from "../store/amazonBucketUrlSlice";
import { handleMenuCatalogList } from "../store/menuCatalogSlice";
import { handleStaffList, handleUrl } from "../store/staffSlice";
import { handleGroupList, handleGroupUrl } from "../store/groupSlice";
import { getRestaurantData } from "../store/restoProfileSlice";
import { handleEmptyAddonList } from "../store/addOnCatalogSlice";
import { handleEmptyTheme } from "../store/qrThemeSlice";
import { handleTaxList } from "../store/taxSlice";
import { handleOfferList } from "../store/offerSlice";
import { handlePaymentModeList } from "../store/paymentSlice";
export const useEmptyStore = () => {
  const dispatch = useDispatch();
  return function () {
    dispatch(userInfo(null));
    dispatch(handleUserCredentials(null));
    dispatch(getRestaurantList([]));
    dispatch(
      handleActiveItem({
        name: "restaurantName",
        value: null,
      })
    );
    dispatch(
      handleActiveItem({
        name: "restaurantId",
        value: null,
      })
    );
    dispatch(handleStaffList([]));
    dispatch(handleGroupList([]));
    dispatch(handleEmptyTheme());
    dispatch(handleUrl([]));
    dispatch(handleGroupUrl([]));
    dispatch(orderFlowList([]));
    dispatch(removeAmazonUrls({}));
    dispatch(handleMenuCatalogList([]));
    dispatch(getRestaurantData([]));
    dispatch(handleEmptyAddonList());
    dispatch(handleTaxList([]));
    dispatch(handleOfferList([]));
    dispatch(handlePaymentModeList({}));
  };
};
