import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { handleStaffList } from "../store/staffSlice";

export const useStaffList = () => {
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
        url: getAmazonUrl("users")?.url?.get_url,
      };
    }

    const response = await globalApiHandler(data);
    if (response) {
      dispatch(handleStaffList(response));
    } else {
      dispatch(handleStaffList([]));
    }
  };
};
