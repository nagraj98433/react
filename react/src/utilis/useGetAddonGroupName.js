import { useSelector } from "react-redux";

export const useGetAddonGroupName = () => {
  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );
  return function (id, code) {
    if (!id && !code) {
      return false;
    }
    const addonGroupArray = addonOverallDetails[code]?.group_list;

    if (!addonGroupArray) {
      return false;
    }
    const selectedAddonGroup = addonGroupArray.find(
      (addon) => addon.addon_group_id === id
    );
    return selectedAddonGroup ? selectedAddonGroup : false;
  };
};
