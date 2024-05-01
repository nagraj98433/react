import { useDispatch } from "react-redux";
import { useAmazonUrl } from "./useAmazonUrl";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import { useSessionChecker } from "./useSessionChecker";
import { useFetchAmazonBucketUrls } from "./useFetchAmazonBucketUrls";
import axios from "axios";
import { handlePaymentModeList } from "../store/paymentSlice";

export const usePayment = () => {
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const globalApiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  return async function () {
    let savePayment = null;
    savePayment = getAmazonUrl("payments");
    const isNotExpired = amazonUrlExpiryChecker(savePayment?.expiry);

    if (!isNotExpired) {
      savePayment = await fetchAmazonBucketUrls("payments");
    }
    if (!savePayment) {
      return console.log("url not found");
    }
    try {
      const response = await axios.get(savePayment?.url?.get_url);

      if (response?.status === 200) {
        dispatch(handlePaymentModeList(response?.data));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};
