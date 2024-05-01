import { useSelector } from "react-redux";

export function useDarkModeToggle() {
  return useSelector((state) => state.activeItemData.isDarkMode);
}
