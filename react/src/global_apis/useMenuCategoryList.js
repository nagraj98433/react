import { useSelector } from "react-redux";
import { BASE_URL } from "../utilis/constants";
import { useDispatch } from "react-redux";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useParams } from "react-router-dom";
import { handleCategoryList } from "../utilis/useCategorySlice";

export const useMenuCategoryList = () => {
  const menuLanguageCode = useSelector(
    (state) => state.activeItemData.menuLanguage
  );

  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const params = useParams();

  const catelogIdArray = params?.menuId.split("_");

  const catelogId = catelogIdArray[1] + "_" + catelogIdArray[2];

  return async function (setIsLoading, code) {
    const data = {
      method: "get",
      url:
        BASE_URL +
        `api/menu/search/${params?.outletId}/${catelogId}/category/${
          code ? code : menuLanguageCode
        }/`,
    };

    setIsLoading && setIsLoading(true);
    const response = await globalApiHandler(data);

    if (response?.success && response?.data?.category?.length) {
      dispatch(handleCategoryList(response?.data?.category));
      setIsLoading && setIsLoading(false);
      return response?.data?.category;
    } else {
      dispatch(handleCategoryList([]));
      setIsLoading && setIsLoading(false);
      return response?.data;
    }
  };
};
