import { BASE_URL } from "./constants";
import { useGlobalApiHandler } from "./useGlobalApiHandler";
import CryptoJS from "crypto-js";
import useIdGenerator from "./useIdGenerator";

export const useStaffLogin = () => {
  const apiHandler = useGlobalApiHandler();

  const [sessionId, setSessionId] = useIdGenerator();

  return async function (credentails) {
    const encryptedPassword = CryptoJS.SHA256(credentails?.password).toString(
      CryptoJS.enc.Hex
    );

    const data = new FormData();

    data.append("password", encryptedPassword);
    data.append("username", credentails?.username);
    data.append("session_key", sessionId);

    const apiData = {
      method: "post",
      url: BASE_URL + "api/staff/login/",
      data: data,
    };
    const response = await apiHandler(apiData);

    if (response) {
      return response;
    } else {
      return false;
    }
    setSessionId();
  };
};
