import { useSelector } from "react-redux";
import { BASE_URL } from "./constants";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handleActiveItem } from "../store/activeItemSlice";
import { useParams } from "react-router-dom";

export const useUpdateMenu = () => {
  const userDetails = useSelector((state) => state.userData.data);
  const menuDetails = useSelector((state) => state.menuData.overallData);
  const menuCatalogList = useSelector((state) => state.catlogData?.data);

  const apiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const params = useParams();

  return async function (payload) {
    dispatch(
      handleActiveItem({
        name: "isMenuUpdating",
        value: true,
      })
    );
    const presignedUrlGenerator = async () => {
      const apiPayload = {
        method: "get",
        url:
          BASE_URL +
          "api/update/catlog/" +
          userDetails?.owner_id +
          "/" +
          params?.outletId +
          "/" +
          payload?.catalogId +
          "/",
      };

      const response = await apiHandler(apiPayload);

      if (!response?.status) {
        return;
      } else {
        return response?.data;
      }
    };

    const updateMenu = async (url, newMenu) => {
      await axios.put(url, newMenu);
    };

    if (!menuDetails) {
      return;
    }

    const presignedUrls = await presignedUrlGenerator();
    let upateMenupayload = payload?.newMenuData
      ? payload?.newMenuData
      : menuDetails;

    await updateMenu(presignedUrls?.menu_update, upateMenupayload);

    payload?.isCatalogChange &&
      (await updateMenu(
        presignedUrls?.catalog_name_update,
        payload?.newCatalogList ? payload?.newCatalogList : menuCatalogList
      ));

    dispatch(
      handleActiveItem({
        name: "isMenuUpdating",
        value: false,
      })
    );
  };
};
