import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAmazonUrl } from "./useAmazonUrl";
import { useSessionChecker } from "./useSessionChecker";
import { useFetchAmazonBucketUrls } from "./useFetchAmazonBucketUrls";
import { useQrList } from "../global_apis/useQrList";
import {
  handleActiveTheme,
  handleQRUrl,
  handleQrTheme,
} from "../store/qrThemeSlice";
import toast from "react-hot-toast";
import axios from "axios";

export const useFetchTheme = () => {
  const qrList = useSelector((state) => state.qrThemeData?.qrList);

  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getQrList = useQrList();

  return async function (updatedQrThemes) {
    const amazonUrlResult = getAmazonUrl("qrcode");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

    if (!isNotExpired) {
      const requiredUrl = await fetchAmazonBucketUrls("qrcode");
      dispatch(handleQRUrl(requiredUrl));

      const createQR = await axios.put(requiredUrl?.put_url, updatedQrThemes);
      if (createQR?.status === 200) {
        // toast.success("QR Updated successfully!");
        dispatch(handleQrTheme(updatedQrThemes));
        dispatch(handleActiveTheme(""));
        getQrList(requiredUrl?.get_url);
      } else {
        toast.error("QR Updation failed!");
      }
    } else {
      const amazonUrlResult = getAmazonUrl("qrcode")?.url;
      const createQR = await axios.put(
        amazonUrlResult?.put_url,
        updatedQrThemes
      );
      if (createQR?.status === 200) {
        //  toast.success("QR Updated successfully!");
        dispatch(handleQrTheme(updatedQrThemes));
        dispatch(handleActiveTheme(""));
        getQrList(amazonUrlResult?.get_url);
      } else {
        toast.error("QR Updation failed!");
      }
    }
  };
};
