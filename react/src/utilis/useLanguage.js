import { useDispatch, useSelector } from "react-redux";
import { handleLanguage, handleSelectedLanguage } from "../store/languageSlice";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import { handleAmazonUrls } from "../store/amazonBucketUrlSlice";
import { useCheckUrlExpiry } from "./useCheckUrlExpiry";

export const useLangauge = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const selectedLang = useSelector((state) => state.activeItemData.language);
  const amazonBucketUrls = useSelector(
    (state) => state.amazonBucketUrlData.data
  );

  const dispatch = useDispatch();
  const apiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useCheckUrlExpiry();

  return async function (code) {
    const getDataUsingUrl = async () => {
      const responseApiData = {
        method: "get",
        url: amazonBucketUrls?.lang,
      };

      const newResponse = await apiHandler(responseApiData);

      if (newResponse) {
        dispatch(handleLanguage(newResponse));
        code
          ? dispatch(handleSelectedLanguage(code))
          : dispatch(handleSelectedLanguage(selectedLang?.code));
      }
    };

    const getUrlByApi = async () => {
      const apiData = {
        method: "get",
        url: BASE_URL + "api/language/list/",
      };
      const response = await apiHandler(apiData);

      if (response) {
        const responseApiData = {
          method: "get",
          url: response?.data,
        };

        dispatch(
          handleAmazonUrls({
            name: "lang",
            url: response?.data,
          })
        );

        const newResponse = await apiHandler(responseApiData);

        if (newResponse) {
          dispatch(handleLanguage(newResponse));
          code
            ? dispatch(handleSelectedLanguage(code))
            : dispatch(handleSelectedLanguage(selectedLang?.code));
        }
      }
    };

    const checkExpiry = amazonUrlExpiryChecker(amazonBucketUrls?.lang);

    if (checkExpiry) {
      getDataUsingUrl();
    } else {
      getUrlByApi();
    }
  };
};
