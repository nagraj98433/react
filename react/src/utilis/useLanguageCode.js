import { languagelist } from "./constants";

export const useLanguageCode = () => {
  return function (code) {
    return languagelist[code] ? languagelist[code] : { lang: "", code: "" };
  };
};
