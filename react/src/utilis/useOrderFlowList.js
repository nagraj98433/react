import { useDispatch } from "react-redux";
import { useAmazonUrl } from "./useAmazonUrl";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import { orderFlowList } from "../store/orderFlowSlice";
import { useSessionChecker } from "./useSessionChecker";
import { useFetchAmazonBucketUrls } from "./useFetchAmazonBucketUrls";

export const useOrderFlowList = () => {
  const globalApiHandler = useGlobalApiHandler();
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  return async function (setIsLoading) {
    setIsLoading && setIsLoading(true);
    let amazonUrl = null;
    amazonUrl = getAmazonUrl("orderflow");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrl?.expiry);

    if (!isNotExpired) {
      amazonUrl = await fetchAmazonBucketUrls("orderflow");
    }
    const apiData = {
      method: "get",
      url: amazonUrl?.url?.get_url,
    };
    const response = await globalApiHandler(apiData);

    if (response?.length) {
      dispatch(orderFlowList(response));
    } else {
      dispatch(orderFlowList([]));
    }
    setIsLoading && setIsLoading(false);
  };
};
