import { useDispatch } from "react-redux";
import { handleActiveOutlet } from "../store/activeOutletSlice";
import { removeAmazonUrls } from "../store/amazonBucketUrlSlice";
import { handleStaffList } from "../store/staffSlice";
import { handleGroupList } from "../store/groupSlice";
import { handleEmptyAddonList } from "../store/addOnCatalogSlice";
import { handleEmptyTheme } from "../store/qrThemeSlice";
import { handleTaxList } from "../store/taxSlice";
import { handleOfferList } from "../store/offerSlice";
import { handlePaymentModeList } from "../store/paymentSlice";

export const useEmptyOutletStore = () => {
  const dispatch = useDispatch();
  return function () {
    dispatch(handleActiveOutlet(null));
    dispatch(removeAmazonUrls({}));
    dispatch(handleStaffList([]));
    dispatch(handleGroupList([]));
    dispatch(handleEmptyTheme());
    dispatch(handleEmptyAddonList());
    dispatch(handleTaxList([]));
    dispatch(handleOfferList([]));
    dispatch(handlePaymentModeList({}));
  };
};
