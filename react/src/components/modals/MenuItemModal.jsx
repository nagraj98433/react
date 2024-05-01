import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { handleAddNewAddon } from "../../store/menuSlice";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";
import { useParams } from "react-router";

function MenuItemModal({ show, handleToggle, data, code }) {
  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );
  const menuOverallDetails = useSelector((state) => state.menuData.overallData);

  const dispatch = useDispatch();
  const updateMenu = useUpdateMenu();
  const param = useParams();

  const [addonGroupList, setAddonGroupList] = useState([]);
  const [addonList, setAddonList] = useState([]);
  const [selectedAddonType, setSelectedAddonType] = useState("addon");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedAddonGroup, setSelectedAddonGroup] = useState([]);

  const sortAddonGroups = () => {
    if (!addonOverallDetails[code]) {
      return;
    }
    let groupArray = [];
    for (let i = 0; i < addonOverallDetails[code].group_list.length; i++) {
      let newObj = {
        label: addonOverallDetails[code]?.group_list[i]?.addon_group,
        value: addonOverallDetails[code]?.group_list[i]?.addon_group_id,
      };
      groupArray.push(newObj);
    }
    setAddonGroupList(groupArray);
  };

  const sortAddons = () => {
    if (!addonOverallDetails[code]) {
      return;
    }
    let groupArray = [];
    for (let i = 0; i < addonOverallDetails[code].add_on.length; i++) {
      let newObj = {
        label: `${addonOverallDetails[code]?.add_on[i]?.addon_name} | ${addonOverallDetails[code]?.add_on[i]?.addon_price}`,
        value: addonOverallDetails[code]?.add_on[i]?.addon_name_id,
      };
      groupArray.push(newObj);
    }
    setAddonList(groupArray);
  };

  const handleExistingAddons = () => {
    if (!data?.addons) {
      return setSelectedAddons([]);
    }

    let addonsArray = [];
    for (let i = 0; i < data?.addons.length; i++) {
      const filteredAddon = addonOverallDetails[code]?.add_on?.find(
        (item) => item?.addon_name_id === data?.addons[i]
      );
      let newObj = {
        label: `${filteredAddon?.addon_name} | ${filteredAddon?.addon_price}`,
        value: filteredAddon?.addon_name_id,
      };
      addonsArray.push(newObj);
    }
    setSelectedAddons(addonsArray);
  };

  const handleChangeAddon = (e) => {
    let addonArray = [];
    for (let i = 0; i < e.length; i++) {
      addonArray.push(e[i]?.value);
    }
    dispatch(
      handleAddNewAddon({
        itemId: data?.product_id,
        addons: addonArray,
      })
    );
  };

  const handleChangeAddonGroup = (e) => {
    if (!e.length) {
      return dispatch(
        handleAddNewAddon({
          itemId: data?.product_id,
          addons: [],
        })
      );
    }

    const addonsArray = [];
    for (let i = 0; i < e.length; i++) {
      const filteredAddons = addonOverallDetails[code]?.add_on?.filter(
        (item) => {
          return item?.addon_name_id?.includes(e[i].value);
        }
      );
      if (!filteredAddons.length) {
        return;
      }

      for (let j = 0; j < filteredAddons.length; j++) {
        addonsArray.push(filteredAddons[j]?.addon_name_id);
      }
    }

    for (let k = 0; k < data?.addons.length; k++) {
      !addonsArray.includes(data?.addons[k]) &&
        addonsArray.push(data?.addons[k]);
    }

    dispatch(
      handleAddNewAddon({
        itemId: data?.product_id,
        addons: addonsArray,
      })
    );
  };

  const handleSave = async () => {
    handleToggle();
    const payload = {
      catalogId: param.menuId,
      isCatalogChange: false,
    };
    await updateMenu(payload);
  };

  useEffect(() => {
    setSelectedAddonGroup([]);
    setSelectedAddonType("addon");
    sortAddonGroups();
    sortAddons();
    handleExistingAddons();
  }, [data]);

  return (
    <Modal show={show} onHide={handleToggle} keyboard={false}>
      <Modal.Body>
        {Object.keys(menuOverallDetails)[0] !== code ? (
          <>
            {data?.addons?.length ? (
              <Form.Group className="mb-2">
                <Form.Label
                  style={{ color: themeColor.primary }}
                  className="fw-medium formLabelText"
                >
                  Addons
                </Form.Label>
                {data?.addons?.length
                  ? selectedAddons?.map((item) => (
                      <div
                        key={item?.value}
                        style={{ fontSize: "14px" }}
                        className="d-flex gap-1"
                      >
                        <div className="d-flex">
                          <div>{item?.label}</div>
                          <div>,</div>
                        </div>
                      </div>
                    ))
                  : ""}
              </Form.Group>
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            <div className="d-flex gap-3">
              {/* <Form.Check
                className="formLabelText fw-medium"
                type="radio"
                label="Group"
                name="addon"
                checked={selectedAddonType === "group"}
                onClick={(e) => {
                  e.target.checked && setSelectedAddonType("group");
                }}
                onChange={() => {}}
              /> */}
            </div>

            <Form.Group className="mb-2">
              <Form.Label className="fw-medium formLabelText">
                Add Addons Groups
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select addons groups"
                options={addonGroupList}
                isMulti
                value={selectedAddonGroup}
                onChange={(e) => {
                  handleChangeAddonGroup(e);
                  setSelectedAddonGroup(e);
                }}
              />
            </Form.Group>

            <div className="row justify-content-center">
              <div className="col-3">
                <CustomButton
                  name={"Save"}
                  bgColor={themeColor.primary}
                  handleClick={handleSave}
                />
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default MenuItemModal;
