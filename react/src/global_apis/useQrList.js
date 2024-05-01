import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { handleGroupList } from "../store/groupSlice";
import { handleQrList } from "../store/qrThemeSlice";

export const useQrList = () => {
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
        url: getAmazonUrl("qrcode")?.url?.get_url,
      };
    }

    const response = await globalApiHandler(data);
    if (response) {
      dispatch(handleQrList(response));
    } else {
      dispatch(handleQrList([]));
    }
  };
};
