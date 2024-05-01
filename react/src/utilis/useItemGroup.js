import { useDispatch } from "react-redux";
import { useAmazonUrl } from "./useAmazonUrl";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import { useSessionChecker } from "./useSessionChecker";
import { useFetchAmazonBucketUrls } from "./useFetchAmazonBucketUrls";
import { getItemGroup } from "../store/itemGroupSlice";

export const useItemGroup = () => {
  const globalApiHandler = useGlobalApiHandler();
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  return async function (setIsLoading) {
    setIsLoading && setIsLoading(true);
    let amazonUrl = null;
    amazonUrl = getAmazonUrl("iteamgroup");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrl?.expiry);

    if (!isNotExpired) {
      amazonUrl = await fetchAmazonBucketUrls("iteamgroup");
    }
    const apiData = {
      method: "get",
      url: amazonUrl?.url?.get_url,
    };
    const response = await globalApiHandler(apiData);

    if (response) {
      dispatch(getItemGroup(response));
    }
    setIsLoading && setIsLoading(false);
  };
};
