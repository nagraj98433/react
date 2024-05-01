import { useDispatch } from "react-redux";
import { handleActiveItem } from "../store/activeItemSlice";

export const useLanguageChange = () => {
  const dispatch = useDispatch();

  return function (name, value) {
    dispatch(
      handleActiveItem({
        name: name,
        value: value,
      })
    );
  };
};
