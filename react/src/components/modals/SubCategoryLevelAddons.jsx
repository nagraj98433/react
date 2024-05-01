import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import { useDispatch } from "react-redux";
import { handleSubcategoryLevelAddons } from "../../store/menuSlice";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";
import { useParams } from "react-router-dom";

function SubCategoryLevelAddons({ show, handleToggle, subCatId }) {
  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );
  const menuOverallDetails = useSelector((state) => state.menuData.overallData);

  const dispatch = useDispatch();
  const updateMenu = useUpdateMenu();
  const param = useParams();

  const [isAddonGroupSelected, setIsAddonGroupSelected] = useState(false);
  const [addonGroupList, setAddonGroupList] = useState([]);
  const [addonList, setAddonList] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedAddonGroup, setSelectedAddonGroup] = useState([]);

  const sortAddonGroups = () => {
    const firstKey = Object.keys(menuOverallDetails)[0];
    if (!addonOverallDetails[firstKey]) {
      return;
    }
    let groupArray = [];
    for (let i = 0; i < addonOverallDetails[firstKey].group_list.length; i++) {
      let newObj = {
        label: addonOverallDetails[firstKey]?.group_list[i]?.addon_group,
        value: addonOverallDetails[firstKey]?.group_list[i]?.addon_group_id,
      };
      groupArray.push(newObj);
    }
    setAddonGroupList(groupArray);
  };

  const sortAddons = () => {
    const firstKey = Object.keys(menuOverallDetails)[0];
    if (!addonOverallDetails[firstKey]) {
      return;
    }
    let groupArray = [];
    for (let i = 0; i < addonOverallDetails[firstKey].add_on.length; i++) {
      let newObj = {
        label: `${addonOverallDetails[firstKey]?.add_on[i]?.addon_name} | ${addonOverallDetails[firstKey]?.add_on[i]?.addon_price}`,
        value: addonOverallDetails[firstKey]?.add_on[i]?.addon_name_id,
      };
      groupArray.push(newObj);
    }
    setAddonList(groupArray);
  };

  const handleDispatchAddon = () => {
    if (!selectedAddons.length) {
      return dispatch(
        handleSubcategoryLevelAddons({
          subCatId: subCatId,
          addons: [],
        })
      );
    }
    let addonArray = [];
    for (let addon of selectedAddons) {
      addonArray.push(addon?.value);
    }

    dispatch(
      handleSubcategoryLevelAddons({
        subCatId: subCatId,
        addons: addonArray,
      })
    );
  };

  const handleDispatchAddonGroup = () => {
    if (!selectedAddonGroup.length) {
      return dispatch(
        handleSubcategoryLevelAddons({
          subCatId: subCatId,
          addons: [],
        })
      );
    }

    const addonFirstKey = Object.keys(addonOverallDetails)[0];

    const addonsArray = [];
    for (let i = 0; i < selectedAddonGroup.length; i++) {
      const filteredAddons = addonOverallDetails[addonFirstKey]?.add_on?.filter(
        (item) => {
          return item?.addon_name_id?.includes(selectedAddonGroup[i].value);
        }
      );
      if (!filteredAddons.length) {
        return;
      }

      for (let j = 0; j < filteredAddons.length; j++) {
        addonsArray.push(filteredAddons[j]?.addon_name_id);
      }
    }

    dispatch(
      handleSubcategoryLevelAddons({
        subCatId: subCatId,
        addons: addonsArray,
      })
    );
  };

  const handleSave = async () => {
    setSelectedAddons([]);
    handleToggle();
    const payload = {
      catalogId: param.menuId,
      isCatalogChange: false,
    };
    await updateMenu(payload);
  };

  useEffect(() => {
    sortAddonGroups();
    sortAddons();
  }, []);

  return (
    <Modal show={show} onHide={handleToggle} backdrop="static" keyboard={false}>
      <Toaster />
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "14px" }}>Add Addons</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-3 align-items-center mb-3">
          <Form.Check
            type="radio"
            name="addon"
            label="Addon Groups"
            className="fw-medium"
            style={{ fontSize: "13px" }}
            checked={isAddonGroupSelected}
            onChange={(e) => setIsAddonGroupSelected(e.target.checked)}
          />
          <Form.Check
            type="radio"
            name="addon"
            label="Individual Addons"
            className="fw-medium"
            style={{ fontSize: "13px" }}
            checked={!isAddonGroupSelected}
            onChange={(e) => setIsAddonGroupSelected(!e.target.checked)}
          />
        </div>
        {isAddonGroupSelected ? (
          <Select
            className="customInputBoxText"
            placeholder="Select addons groups"
            options={addonGroupList}
            isMulti
            onChange={(e) => {
              setSelectedAddonGroup(e);
            }}
            onBlur={handleDispatchAddonGroup}
          />
        ) : (
          <Select
            className="customInputBoxText"
            placeholder="Select addons"
            options={addonList}
            value={selectedAddons}
            onChange={(e) => setSelectedAddons(e)}
            onBlur={handleDispatchAddon}
            isMulti
          />
        )}
        <div className="row justify-content-center mt-3">
          <div className="col-3">
            <CustomButton
              name={"Save"}
              bgColor={themeColor.primary}
              handleClick={handleSave}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SubCategoryLevelAddons;
