import React from "react";
import { useLanguageChange } from "../../utilis/useLanguageChange";
import { useSelector } from "react-redux";
import { languageArray, themeColor } from "../../utilis/constants";
import { useLangauge } from "../../utilis/useLanguage";

function LanguageDropDown() {
  const selectedLang = useSelector((state) => state.activeItemData.language);

  const fetchLanguageApi = useLangauge();

  const handleLanguageChange = useLanguageChange();

  const handleClick = (data) => {
    handleLanguageChange("language", data);
    fetchLanguageApi(data?.code);
  };
  return (
    <>
      <div className="customDropdown cursor-pointer">
        <div className="dropdown-button formLabelText">
          <i className={`flag-icon ${selectedLang?.icon}`}></i>
          <div className="formLabelText">{selectedLang?.name}</div>
          <i className="bi bi-chevron-down dropDownIcon"></i>
        </div>
        <div className="dropdown-menuList dropdown-languageList shadow">
          {languageArray &&
            languageArray.map((item) => (
              <button
                key={item?.code}
                style={{
                  borderLeftColor:
                    selectedLang.code === item.code
                      ? themeColor.primary
                      : "transparent",
                }}
                onClick={() => handleClick(item)}
              >
                <div className="d-flex align-items-center gap-2 cursor-pointer">
                  <i className={`${item?.icon} flag-icon`}></i>
                  <div className="formLabelText">{item?.name}</div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </>
  );
}

export default LanguageDropDown;
