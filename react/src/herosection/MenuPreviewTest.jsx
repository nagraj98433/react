import React, { Fragment, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import CategoryAccordianHeader from "../components/accordion/CategoryAccordianHeader";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useDispatch } from "react-redux";
import { handleAddSelectedMenuData, handleMenuData } from "../store/menuSlice";
import { useSelector } from "react-redux";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import MenuTitle from "../components/accordion/MenuTitle";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import { LuLanguages } from "react-icons/lu";
import { BASE_URL, themeColor } from "../utilis/constants";
import { useParams } from "react-router-dom";
import Spinner from "../components/loaders/Spinner";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { useLanguageCode } from "../utilis/useLanguageCode";
import toast, { Toaster } from "react-hot-toast";
import MenuShimmer from "../components/shimmers/menu/MenuShimmer";
import MenuUpdateModal from "../components/modals/MenuUpdateModal";
import { useUpdateMenu } from "../utilis/useUpdateMenu";
import NewCatEditableText from "../components/accordion/NewCatEditableText";
import { MdAdd, MdCheckCircle } from "react-icons/md";
import { handleActiveItem } from "../store/activeItemSlice";
import { handleNewLanguage } from "../store/menuCatalogSlice";
import axios from "axios";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import {
  handleAddonData,
  handleEmptyAddonList,
} from "../store/addOnCatalogSlice";
import { HiMinusSm } from "react-icons/hi";

function MenuPreviewTest() {
  const menuDetails = useSelector((state) => state.menuData.data);
  const menuOverallDetails = useSelector((state) => state.menuData.overallData);
  const isMenuUpdating = useSelector(
    (state) => state.activeItemData.isMenuUpdating
  );
  const isMenuEdit = useSelector((state) => state.activeItemData.isMenuEdit);
  const menuCatalogList = useSelector((state) => state.catlogData?.data);

  const dispatch = useDispatch();
  const param = useParams();
  const breadcrumb = useBreadcrumbData();
  const getLanguage = useLanguageCode();
  const updateMenu = useUpdateMenu();
  const getAmazonUrl = useAmazonUrl();
  const apiHandler = useGlobalApiHandler();

  const [categoryList, setCategoryList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [newLanguages, setNewLanguages] = useState([]);
  const [menuLanguages, setMenuLanguages] = useState([]);
  const [languageLoading, setLanguageLoading] = useState(false);
  const [isMenuUpdate, setIsMenuUpdate] = useState(false);
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);

  const toggleNewCategoryField = () =>
    setShowNewCategoryField(!showNewCategoryField);

  const handleSortCategory = () => {
    let sortedCaregory = [];

    if (!Object.keys(menuDetails).length) return;

    const firstKey = Object.keys(menuDetails)[0];

    for (let i = 0; i < menuDetails[firstKey].category.length; i++) {
      let intendedCategory = [];

      Object.keys(menuDetails).map((titleKey) => {
        let newObj = {
          ...menuDetails[titleKey].category[i],
          code: titleKey,
        };
        intendedCategory.push(newObj);
      });
      sortedCaregory.push(intendedCategory);
    }
    setCategoryList(sortedCaregory);
  };

  const HandleMenuTranslate = async (code) => {
    setLanguageLoading(true);
    const firstKey = Object.keys(menuOverallDetails)[0];

    let languageReplica = {
      [code]: menuOverallDetails[firstKey],
    };

    let finalObject = {
      ...menuOverallDetails,
      ...languageReplica,
    };

    dispatch(handleMenuData(finalObject));

    // Catalog list dispatch
    const clonedObject = JSON.parse(JSON.stringify(menuCatalogList));

    if (!clonedObject.response.language.includes(code)) {
      clonedObject.response.language.push(code);
    }

    dispatch(handleNewLanguage(code));
    const payload = {
      catalogId: param.menuId,
      newMenuData: finalObject,
      isCatalogChange: true,
      newCatalogList: clonedObject,
    };
    await updateMenu(payload);

    setLanguageLoading(false);
  };

  const handleSaveChanges = async () => {
    dispatch(
      handleActiveItem({
        name: "isMenuEdit",
        value: false,
      })
    );
    const payload = {
      catalogId: param.menuId,
      isCatalogChange: true,
    };

    await updateMenu(payload);
  };

  const getNonUniqueLanguages = () => {
    const menuLangs = Object.keys(menuOverallDetails);
    if (!menuLangs?.length) {
      return setNewLanguages([
        { lang: "English", code: "en" },
        { lang: "Romania", code: "ro" },
        { lang: "Ukraine", code: "uk" },
        { lang: "Thai", code: "th" },
        { lang: "Vietnamese", code: "vi" },
      ]);
    }
    let nonUniqueLanguages = [];
    let languageList = [
      { lang: "English", code: "en" },
      { lang: "Romania", code: "ro" },
      { lang: "Ukraine", code: "uk" },
      { lang: "Thai", code: "th" },
      { lang: "Vietnamese", code: "vi" },
    ];
    for (let i = 0; i < languageList.length; i++) {
      if (!menuLangs.includes(languageList[i].code)) {
        nonUniqueLanguages.push(languageList[i]);
      }
    }
    setNewLanguages(nonUniqueLanguages);
  };

  const getAddon = async () => {
    const payload = {
      method: "get",
      url: getAmazonUrl("addons")?.url?.get_url,
    };
    const response = await apiHandler(payload);

    if (response) {
      dispatch(handleAddonData(response));
    } else {
      dispatch(handleEmptyAddonList());
    }
  };

  useEffect(() => {
    breadcrumb("menupreview");
    getAddon();
  }, []);

  useEffect(() => {
    handleSortCategory();
    setMenuLanguages(Object.keys(menuDetails));
  }, [menuDetails]);

  useEffect(() => {
    setIsMenuUpdate(isMenuUpdating);
  }, [isMenuUpdating]);

  return (
    <div className="overflow-scroll h-100 customscrollbar ">
      <CustomBreadCrumb />
      <Toaster />
      <MenuUpdateModal show={isMenuUpdate} />
      <div className="mx-5">
        <div className="fw-medium mb-2">Menu Languages</div>
        <div className="d-flex justify-content-start align-items-center gap-4 flex-wrap mb-3">
          {menuOverallDetails
            ? Object.keys(menuOverallDetails).map((langKey, i) => (
                <Fragment key={langKey}>
                  {i === 0 ? (
                    <div
                      style={{
                        backgroundColor: themeColor.accent,
                        fontSize: "12px",
                      }}
                      className="border px-3 rounded"
                    >
                      {getLanguage(langKey).lang}
                    </div>
                  ) : (
                    <div
                      style={{ fontSize: "12px" }}
                      className="border px-3 rounded"
                    >
                      <Form.Check
                        disabled={isDisabled}
                        onClick={() =>
                          dispatch(handleAddSelectedMenuData(langKey))
                        }
                        checked={menuLanguages.includes(langKey)}
                        onChange={() => {}}
                        className="mt-1"
                        label={getLanguage(langKey).lang}
                      />
                    </div>
                  )}
                </Fragment>
              ))
            : ""}
          <div>
            {!languageLoading ? (
              <DropdownButton
                variant="white"
                title={<LuLanguages />}
                align={"end"}
                onClick={getNonUniqueLanguages}
              >
                {newLanguages.length ? (
                  newLanguages.map((lang) => (
                    <Dropdown.Item
                      key={lang.code}
                      onClick={() => {
                        HandleMenuTranslate(lang.code);
                      }}
                      style={{ fontSize: "12px" }}
                    >
                      {lang?.lang}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item style={{ fontSize: "12px", color: "tomato" }}>
                    No language available
                  </Dropdown.Item>
                )}
              </DropdownButton>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <div className="fw-medium mx-4">Menu Title</div>
          {isMenuEdit && (
            <div
              onClick={handleSaveChanges}
              className="fw-medium cursor-pointer animeShaker menuUpdateButton"
              style={{ color: themeColor.primary, zIndex: "100000" }}
            >
              <div className="text-center">
                <MdCheckCircle size={"40px"} />
              </div>
              <div style={{ fontSize: "10px" }} className="text-center">
                Save Changes
              </div>
            </div>
          )}
        </div>
        <div className="d-flex align-items-center flex-wrap gap-4 ms-5">
          {menuDetails &&
            Object.keys(menuDetails).map((titleKey) => (
              <MenuTitle
                key={titleKey}
                data={menuDetails[titleKey].catalog}
                code={titleKey}
              />
            ))}
        </div>
      </div>
      <div className="heroContainerMargin">
        {categoryList.length ? (
          <>
            <div
              className="text-end mb-2 fw-medium cursor-pointer"
              style={{ fontSize: "12px", color: themeColor.primary }}
            >
              {showNewCategoryField ? (
                <div onClick={toggleNewCategoryField}>
                  <HiMinusSm /> new category
                </div>
              ) : (
                <div onClick={toggleNewCategoryField}>
                  <MdAdd /> new category
                </div>
              )}
            </div>
            <Accordion defaultActiveKey="0" className="pb-5">
              <>
                {showNewCategoryField && (
                  <Accordion.Item className="animeBottomToTop">
                    <Accordion.Header>
                      <NewCatEditableText toggle={toggleNewCategoryField} />
                    </Accordion.Header>
                  </Accordion.Item>
                )}
                {categoryList &&
                  categoryList.map((category, i) => {
                    return <CategoryAccordianHeader key={i} data={category} />;
                  })}
              </>
            </Accordion>
          </>
        ) : (
          <MenuShimmer />
        )}
      </div>
    </div>
  );
}

export default MenuPreviewTest;
