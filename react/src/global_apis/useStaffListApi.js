import { useSelector } from "react-redux";
import { BASE_URL } from "../utilis/constants";
import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { handleStaffList } from "../store/staffSlice";
import { useParams } from "react-router-dom";

export const useStaffListApi = () => {
  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const params = useParams();

  const data = {
    method: "get",
    url: BASE_URL + `api/outlets/staff/${params?.outletId}/`,
  };

  return async function (setIsLoading) {
    setIsLoading && setIsLoading(true);
    const response = await globalApiHandler(data);

    if (response?.success) {
      dispatch(handleStaffList(response?.data));
      setIsLoading && setIsLoading(false);
    } else {
      dispatch(handleStaffList([]));
      setIsLoading && setIsLoading(false);
    }
  };
};
