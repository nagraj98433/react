import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { handleGroupList } from "../store/groupSlice";
import { handleResLogo } from "../store/qrThemeSlice";

export const useResLogo = () => {
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
        url: getAmazonUrl("profile")?.url?.get_url,
      };
    }

    const response = await globalApiHandler(data);
    if (response) {
      dispatch(handleResLogo(response));
    } else {
      dispatch(handleResLogo([]));
    }
  };
};
