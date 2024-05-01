import { useSelector } from "react-redux";

export const useTranslation = () => {
  const selectedLang = useSelector((state) => state.activeItemData.language);
  const englishData = useSelector((state) => state.languageData.en);
  const translatedData = useSelector((state) => state.languageData.transLang);

  return function (key) {
    let text;
    if (selectedLang.code === "en") {
      text = englishData[key];
    } else {
      text = translatedData[key];
    }

    return text ? text : key;
  };
};
