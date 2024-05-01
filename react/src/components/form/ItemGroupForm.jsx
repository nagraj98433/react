import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { Form } from "react-bootstrap";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useGetSelectedMenu } from "../../utilis/useGetSelectedMenu";
import { useSelector } from "react-redux";
import MenuGroup from "../accordion/MenuGroup";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";
import {
  handleAddonData,
  handleEmptyAddonList,
} from "../../store/addOnCatalogSlice";
import { handleEmptyMenu } from "../../store/menuSlice";
import AddonGroup from "../accordion/AddonGroup";
import toast from "react-hot-toast";
import useIdGenerator from "../../utilis/useIdGenerator";
import axios from "axios";
import { useItemGroup } from "../../utilis/useItemGroup";

function ItemGroupForm() {
  const menuOverallDetails = useSelector((state) => state.menuData.overallData);
  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );
  const itemGroupDetails = useSelector((state) => state.itemGroupData.data);

  const getAmazonUrl = useAmazonUrl();
  const globalApiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getSelectedMenu = useGetSelectedMenu();
  const dispatch = useDispatch();
  const getItemGroupList = useItemGroup();

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [menuFirstKey, setMenuFirstKey] = useState("");
  const [addonFirstKey, setAddonFirstKey] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    itemSelectFrom: {},
  });
  const [newId, setNewId] = useIdGenerator();

  const getCatalogList = async () => {
    let catlogUrlData = null;
    catlogUrlData = getAmazonUrl("catalogs");
    const isNotExpired = amazonUrlExpiryChecker(catlogUrlData?.expiry);

    if (!isNotExpired) {
      catlogUrlData = await fetchAmazonBucketUrls("catalogs");
    }

    const payload = {
      method: "get",
      url: catlogUrlData?.url?.get_url,
    };

    const response = await globalApiHandler(payload);

    let tempArray = [];
    if (response?.response?.catalogs?.length) {
      for (let i = 0; i < response?.response?.catalogs.length; i++) {
        let newObj = {
          label: response?.response?.catalogs[i]?.name,
          value: response?.response?.catalogs[i]?.id,
        };
        tempArray.push(newObj);
      }

      let addonObj = {
        label: "Addon",
        value: getAmazonUrl("catalogs")?.url?.get_url,
      };

      tempArray.push(addonObj);
    }

    setOptions(tempArray);
  };

  const handleChange = async (data) => {
    setSelectedItems([]);
    setIsLoading(true);
    if (data?.label !== "Addon") {
      setIsShowMenu(true);
      await getSelectedMenu(data?.value);
      dispatch(handleEmptyAddonList({}));
    } else {
      setIsShowMenu(false);
      const payload = {
        method: "get",
        url: getAmazonUrl("addons")?.url?.get_url,
      };
      const response = await globalApiHandler(payload);

      if (response) {
        dispatch(handleEmptyMenu({}));
        dispatch(handleAddonData(response));
      }
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!form.name.length || !form.itemSelectFrom?.value) {
      return toast.error("All fields are mandatory");
    }

    if (!selectedItems.length) {
      return toast.error("Select atleast one item");
    }

    setIsSubmit(true);

    let newObj = {
      id: newId,
      name: form.name,
      items: selectedItems,
    };

    let groupUrl = null;
    groupUrl = getAmazonUrl("iteamgroup");
    const isNotExpired = amazonUrlExpiryChecker(groupUrl?.expiry);

    if (!isNotExpired) {
      groupUrl = await fetchAmazonBucketUrls("iteamgroup");
    }

    if (!groupUrl) return toast.error("Url not found");

    const copyObj = JSON.parse(JSON.stringify(itemGroupDetails));

    if (copyObj?.itemGroup) {
      copyObj.itemGroup.push(newObj);
    } else {
      copyObj.itemGroup = [newObj];
    }

    const response = await axios.put(groupUrl?.url?.put_url, copyObj);

    if (response?.status === 200) {
      await getItemGroupList();
      setForm({
        name: "",
        itemSelectFrom: {},
      });
      setMenuFirstKey("");
      setAddonFirstKey("");
      dispatch(handleEmptyAddonList({}));
      dispatch(handleEmptyMenu({}));
      setNewId();
    }
    setIsSubmit(false);
  };

  useEffect(() => {
    getCatalogList();
    dispatch(handleEmptyAddonList({}));
    dispatch(handleEmptyMenu({}));
  }, []);

  useEffect(() => {
    if (menuOverallDetails && Object.keys(menuOverallDetails).length) {
      setMenuFirstKey(Object.keys(menuOverallDetails)[0]);
    }
  }, [menuOverallDetails]);

  useEffect(() => {
    if (addonOverallDetails && Object.keys(addonOverallDetails).length) {
      setAddonFirstKey(Object.keys(addonOverallDetails)[0]);
    }
  }, [addonOverallDetails]);
  return (
    <div>
      <CustomTitle heading={"Create item groups for taxes"} />
      <div className="row">
        <div className="col-8">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Group Name
            </Form.Label>
            <Form.Control
              placeholder="Enter group name"
              className="customInputBoxText"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              Select Menu / Addon
            </Form.Label>
            <Select
              options={options}
              className="customInputBoxText"
              value={
                Object.keys(form.itemSelectFrom)?.length
                  ? form.itemSelectFrom
                  : ""
              }
              onChange={(e) => {
                setForm((prev) => ({ ...prev, itemSelectFrom: e }));
                handleChange(e);
              }}
            />
          </Form.Group>
          {!isLoading ? (
            <>
              {isShowMenu ? (
                <div className="mb-3">
                  <MenuGroup
                    data={menuOverallDetails?.[menuFirstKey]}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                </div>
              ) : (
                <div className="mb-3">
                  <AddonGroup
                    data={addonOverallDetails?.[addonFirstKey]}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="mb-2" style={{ fontSize: "12px" }}>
              Data fetching. Please wait..
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <CustomButton
            name={"Save"}
            bgColor={themeColor.primary}
            handleClick={handleSave}
            preIcon={isSubmit && <Spinner />}
          />
        </div>
      </div>
    </div>
  );
}

export default ItemGroupForm;
