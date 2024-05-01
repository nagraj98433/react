import { useSelector } from "react-redux";
import { BASE_URL } from "./constants";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import { useDispatch } from "react-redux";
import { handleAmazonUrls } from "../store/amazonBucketUrlSlice";
import { useParams } from "react-router-dom";

export const useFetchAmazonBucketUrls = () => {
  const userDetails = useSelector((state) => state.userData.data);

  const apiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const params = useParams();

  return async function (requireUrlName) {
    const apiData = {
      method: "get",
      url:
        BASE_URL +
        "api/outlets/" +
        userDetails?.owner_id +
        "/" +
        params?.outletId +
        "/",
    };

    const response = await apiHandler(apiData);
    if (!response?.success) return false;

    for (let i = 0; i < response?.data.length; i++) {
      let newObj = {
        name: response?.data[i]?.name,
        url: response?.data[i]?.url,
        expiry: response?.data[i]?.expiration_time,
      };

      dispatch(handleAmazonUrls(newObj));
    }

    if (requireUrlName) {
      const filteredUrlData = response?.data.filter((content) => {
        return content?.name === requireUrlName;
      });

      return filteredUrlData[0]?.url;
    }
    return true;
  };
};
