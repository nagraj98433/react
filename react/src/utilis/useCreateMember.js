import { useDispatch } from "react-redux";
import { useAmazonUrl } from "./useAmazonUrl";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import { useSessionChecker } from "./useSessionChecker";
import { useFetchAmazonBucketUrls } from "./useFetchAmazonBucketUrls";
import { handleOfferList } from "../store/offerSlice";

export const useOfferList = () => {
  const globalApiHandler = useGlobalApiHandler();
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  return async function (setIsLoading) {
    setIsLoading && setIsLoading(true);
    let amazonUrl = null;
    amazonUrl = getAmazonUrl("offers");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrl?.expiry);

    if (!isNotExpired) {
      amazonUrl = await fetchAmazonBucketUrls("offers");
    }
    const apiData = {
      method: "get",
      url: amazonUrl?.url?.get_url,
    };
    const response = await globalApiHandler(apiData);

    if (response?.length) {
      dispatch(handleOfferList(response));
    } else {
      dispatch(handleOfferList([]));
    }
    setIsLoading && setIsLoading(false);
  };
};
