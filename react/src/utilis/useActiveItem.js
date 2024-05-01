import { useSelector } from "react-redux";

export const useActiveItem = () => {
  const activeItemDetails = useSelector((state) => state.activeItemData);
  return function (name) {
    return activeItemDetails[name];
  };
};
