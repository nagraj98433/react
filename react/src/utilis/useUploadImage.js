import { BASE_URL } from "./constants";
import { useGlobalApiHandler } from "./useGlobalApiHandler";

export const useUploadImage = () => {
  const globalApiHandler = useGlobalApiHandler();

  return async function (outletId, file) {
    if (!file) {
      return;
    }
    const data = new FormData();
    data.append("outlet_id", outletId);
    data.append("image", file);
    const apiData = {
      method: "post",
      url: BASE_URL + "api/outlets/upload/image/",
      data: data,
    };

    const response = await globalApiHandler(apiData);
    return response;
  };
};
