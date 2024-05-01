import { useDispatch } from "react-redux";
import { handlerLoader } from "../store/loaderSlice";

export const useListLoader = () => {
  const dispatch = useDispatch();

  return function (listName) {
    dispatch(handlerLoader(listName));
  };
};
