import { useNavigate } from "react-router-dom";
import { useEmptyStore } from "./useEmptyStore";
import { BASE_URL } from "./constants";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handleUserAccessToken } from "../store/userSlice";

export const useGlobalApiHandler = () => {
  const userDetails = useSelector((state) => state.userData.data);

  const navigate = useNavigate();
  const emptyStore = useEmptyStore();
  const dispatch = useDispatch();

  return async function (data) {
    if (!data?.url) {
      return false;
    }
    const apiHandler = async (token) => {
      // access-token
      const Header = {
        headers: {
          "Cache-Control": "no-cache",
        },
      };

      try {
        let response;
        if (data?.method === "get" || data?.method === "delete") {
          response = await axios[data?.method](data?.url, Header);
        } else {
          response = await axios[data?.method](data?.url, data?.data, Header);
        }

        return response.data;
      } catch (error) {
        if (!error?.response) {
          toast.error(error?.message);
        } else {
          let errorCode = error?.response?.status;
          if (errorCode === 408) {
            return errorCode;
          }
        }
      }
    };

    const refreshTokenHandler = async () => {
      const refreshToken_url =
        BASE_URL + `api/refresh/token/${userDetails.refresh_token}`;

      try {
        const response = await axios.get(refreshToken_url);
        if (response?.data?.success === false) {
          emptyStore();
          navigate("/registration/login");
        } else if (response?.data?.success) {
          dispatch(
            handleUserAccessToken({
              name: "access_token",
              value: response?.data?.data?.access_token,
            })
          );
          return response?.data?.data?.access_token;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const response = await apiHandler(userDetails?.access_token);

    if (response === 408) {
      let newToken = await refreshTokenHandler();
      if (newToken) {
        const newResponse = await apiHandler(newToken);
        return newResponse;
      }
    } else {
      return response;
    }
  };
};
