import React, { Fragment, useEffect, useState } from "react";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { useParams } from "react-router-dom";
import Spinner from "../components/loaders/Spinner";
import { useSelector } from "react-redux";
import { Accordion, Form } from "react-bootstrap";
import { BASE_URL, themeColor } from "../utilis/constants";
import { useLanguageCode } from "../utilis/useLanguageCode";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";

import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { useDispatch } from "react-redux";
import MenuShimmer from "../components/shimmers/menu/MenuShimmer";
import AddonGroupAccordionHeader from "../components/accordion/AddonGroupAccordionHeader";
import {
  handleAddSelectedAddonData,
  handleAddonData,
} from "../store/addOnCatalogSlice";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { MdAdd, MdCheckCircle } from "react-icons/md";

import AddOnUpdateModal from "../components/modals/AddOnUpdateModal";
import { handleActiveItem } from "../store/activeItemSlice";

import NewAddOnCatEditable from "../components/accordion/NewAddOnCatEditable";
import { useSessionChecker } from "../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../utilis/useFetchAmazonBucketUrls";

function AddOnPreview() {
  const isAddonEdit = useSelector((state) => state.activeItemData.isAddOnEdit);
  const userDetails = useSelector((state) => state.userData.data);
  const menuCatalogList = useSelector((state) => state.catlogData?.data);

  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );
  const params = useParams();
  const dispatch = useDispatch();
  const breadcrumb = useBreadcrumbData();
  const getLanguage = useLanguageCode();
  const getAmazonUrl = useAmazonUrl();
  const apiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const [groupList, setGroupList] = useState([]);
  const [isAddOnUpdate, setAddOnUpdate] = useState(false);
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  const [isUpdateAddon, setIsUpdateAddon] = useState(false);

  const toggleNewCategoryField = () =>
    setShowNewCategoryField(!showNewCategoryField);

  const handleSortAddonGroup = (addonNewData) => {
    let sortedGroups = [];
    if (!Object.keys(addonNewData).length) return;

    const firstKey = Object.keys(addonNewData)[0];

    for (let i = 0; i < addonNewData[firstKey].group_list?.length; i++) {
      let intendedGroups = [];

      Object.keys(addonNewData).map((titleKey) => {
        let newObj = {
          ...addonNewData[titleKey].group_list[i],
          code: titleKey,
        };
        intendedGroups.push(newObj);
      });
      sortedGroups.push(intendedGroups);
    }

    setGroupList(sortedGroups);
  };

  const handleTranslation = async (newData) => {
    const menuLanguages = menuCatalogList?.response?.language;

    const addonLanguages = Object.keys(newData);

    const remainingTranslationLanguages = [];
    menuLanguages?.forEach((lang) => {
      if (!addonLanguages.includes(lang)) {
        remainingTranslationLanguages.push(lang);
      }
    });

    if (!remainingTranslationLanguages.length) {
      return false;
    }

    let finalObject = {
      ...newData,
    };

    for (let i = 0; i < remainingTranslationLanguages.length; i++) {
      let newObj = {
        [remainingTranslationLanguages[i]]: newData[addonLanguages[0]],
      };

      finalObject = {
        ...finalObject,
        ...newObj,
      };
    }
    dispatch(handleAddonData(finalObject));

    const apiData = {
      method: "get",
      url:
        BASE_URL +
        "api/outlets/addon/" +
        userDetails?.owner_id +
        "/" +
        params?.outletId +
        "/",
    };

    const response = await apiHandler(apiData);
    if (!response?.success) {
      return toast.error(response?.message);
    }
    await axios.put(response?.data?.addon_update, finalObject);
    dispatch(handleAddonData(finalObject));
    return true;
  };

  const getAddon = async () => {
    let getAddonData = null;
    getAddonData = getAmazonUrl("addons");
    const isNotExpired = amazonUrlExpiryChecker(getAddonData?.expiry);

    if (!isNotExpired) {
      getAddonData = await fetchAmazonBucketUrls("addons");
    }
    if (!getAddonData) {
      showAddon();
      return false;
    }
    const response = await axios.get(getAddonData?.url?.get_url);

    if (response?.status === 200) {
      dispatch(handleAddonData(response?.data));
      handleSortAddonGroup(response?.data);
      await handleTranslation(response?.data);
      return response?.data;
    }
    return false;
  };

  const saveAddOnChanges = async () => {
    dispatch(
      handleActiveItem({
        name: "isAddOnEdit",
        value: false,
      })
    );
    setAddOnUpdate(true);
    setIsUpdateAddon(true);
  };

  const updateAddOn = async () => {
    const apiData = {
      method: "get",
      url:
        BASE_URL +
        "api/outlets/addon/" +
        userDetails?.owner_id +
        "/" +
        params?.outletId +
        "/",
    };

    const response = await apiHandler(apiData);
    if (!response?.success) {
      return toast.error(response?.message);
    }
    await axios.put(response?.data?.addon_update, addonOverallDetails);
    setAddOnUpdate(false);
    setIsUpdateAddon(false);
    return true;
  };

  const showAddon = () => {
    dispatch(
      handleActiveItem({
        name: "isShowAddon",
        value: false,
      })
    );
  };

  useEffect(() => {
    if (isUpdateAddon) {
      updateAddOn();
    }
  }, [isUpdateAddon]);
  useEffect(() => {
    const fetchData = async () => {
      await getAddon();
    };
    fetchData();
  }, []);
  return (
    <div className="overflow-auto h-100 customscrollbar">
      <Toaster />
      <AddOnUpdateModal show={isAddOnUpdate} />
      <div>
        <div className="d-flex justify-content-between">
          <div className="fw-medium mb-2 mx-4">Add-on Languages</div>
        </div>
        <div className="d-flex justify-content-start align-items-center gap-4 flex-wrap mb-3">
          {addonOverallDetails &&
            Object.keys(addonOverallDetails)?.map((lang, i) => (
              <Fragment key={lang}>
                {i === 0 ? (
                  <div
                    style={{
                      backgroundColor: themeColor.accent,
                      fontSize: "12px",
                    }}
                    className="border px-3 rounded"
                  >
                    {getLanguage(lang).lang}
                  </div>
                ) : (
                  <div
                    style={{ fontSize: "12px" }}
                    className="border px-3 rounded"
                  >
                    <Form.Check
                      label={getLanguage(lang)?.lang}
                      className="mt-1 cursor-pointer"
                      onClick={() => dispatch(handleAddSelectedAddonData(lang))}
                    />
                  </div>
                )}
              </Fragment>
            ))}
        </div>
        <div className="fw-medium mb-2 mx-4">Add-on</div>
        {isAddonEdit && (
          <div
            onClick={saveAddOnChanges}
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
        <div className="heroContainerMargin">
          {groupList?.length ? (
            <>
              <div
                className="text-end mb-2 fw-medium cursor-pointer"
                style={{ fontSize: "12px", color: themeColor.primary }}
              >
                <div onClick={toggleNewCategoryField}>
                  <MdAdd /> new addon group
                </div>
              </div>
              <Accordion defaultActiveKey="0" className="pb-5">
                <>
                  {showNewCategoryField && (
                    <Accordion.Item className="animeBottomToTop">
                      <Accordion.Header>
                        <NewAddOnCatEditable toggle={toggleNewCategoryField} />
                      </Accordion.Header>
                    </Accordion.Item>
                  )}

                  {groupList?.length &&
                    groupList?.map((grp, i) => {
                      return <AddonGroupAccordionHeader key={i} data={grp} />;
                    })}
                </>
              </Accordion>
            </>
          ) : (
            <MenuShimmer />
          )}
        </div>
      </div>
    </div>
  );
}

export default AddOnPreview;
