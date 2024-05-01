import { useSelector } from "react-redux";

export const usePageLanguage = (pageName) => {
  const languageContent = useSelector(
    (state) => state.languageData.selectedData
  );

  return languageContent ? languageContent[pageName]?.content : null;
};
