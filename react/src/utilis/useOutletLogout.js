import { BASE_URL } from "./constants";
import { useEmptyOutletStore } from "./useEmptyOutletStore";
import { useGlobalApiHandler } from "./useGlobalApiHandler";

export const useOutletLogout = () => {
  const apiHandler = useGlobalApiHandler();
  const emptyOutletStore = useEmptyOutletStore();

  return async function (id, sessionKey) {
    const data = new FormData();

    data.append("sessionid", id);
    data.append("session_key", sessionKey);
    const apiData = {
      method: "post",
      url: BASE_URL + "api/session/logout/",
      data: data,
    };
    await apiHandler(apiData);
    emptyOutletStore();
  };
};
