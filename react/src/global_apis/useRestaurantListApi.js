import { useSelector } from "react-redux";
import { BASE_URL } from "../utilis/constants";
import { useDispatch } from "react-redux";
import { getRestaurantList } from "../store/restoSlice";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";

export const useRestaurantListApi = () => {
  const userDetails = useSelector((state) => state.userData.data);
  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();

  const data = {
    method: "get",
    url: BASE_URL + `api/outlets/list/${userDetails?.owner_id}/`,
  };

  return async function (setIsLoading) {
    setIsLoading && setIsLoading(true);
    const response = await globalApiHandler(data);

    if (response?.success) {
      dispatch(getRestaurantList(response?.data));
      setIsLoading && setIsLoading(false);
    }
  };
};
