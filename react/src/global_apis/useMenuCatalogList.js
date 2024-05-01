import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { handleMenuCatalogList } from "../store/menuCatalogSlice";
import { useAmazonUrl } from "../utilis/useAmazonUrl";

export const useMenuCatalogList = () => {
  const getAmazonUrl = useAmazonUrl();
  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();

  return async function (url) {
    let data = {};
    if (url) {
      data = {
        method: "get",
        url: url,
      };
    } else {
      data = {
        method: "get",
        url: getAmazonUrl("catalogs")?.url?.get_url,
      };
    }

    const response = await globalApiHandler(data);
    if (response) {
      dispatch(handleMenuCatalogList(response));
    } else {
      dispatch(handleMenuCatalogList([]));
    }
  };
};
