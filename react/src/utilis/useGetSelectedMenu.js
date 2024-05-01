import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import { handleMenuData } from "../store/menuSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "./constants";

export const useGetSelectedMenu = () => {
  const userDetails = useSelector((state) => state.userData.data);

  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const params = useParams();

  return async function (id) {
    const presignedUrlGenerator = async () => {
      const apiPayload = {
        method: "get",
        url:
          BASE_URL +
          "api/outlets/catlog/" +
          userDetails?.owner_id +
          "/" +
          params?.outletId +
          "/" +
          id +
          "/",
      };

      const response = await globalApiHandler(apiPayload);
      if (!response?.success) {
        return;
      } else {
        return response?.data;
      }
    };
    const getUrl = await presignedUrlGenerator();

    const payload = {
      method: "get",
      url: getUrl,
    };
    const response = await globalApiHandler(payload);

    if (response) {
      dispatch(handleMenuData(response));
      return true;
    }
  };
};
