import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { MdCheck, MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  handleCategoryLevelAddons,
  removeCategoryLevelAddons,
} from "../../store/menuSlice";
import { useDispatch } from "react-redux";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";
import { useParams } from "react-router-dom";

function CategoryLevelAddonSelectionDropdown({
  handleClose,
  catId,
  catAddons,
}) {
  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );

  const [addonGroup, setAddonGroup] = useState([]);
  const [isMenuChange, setIsMenuChange] = useState(false);

  const dispatch = useDispatch();
  const updateMenu = useUpdateMenu();
  const param = useParams();

  const getAddonGroups = () => {
    const firstkey = Object.keys(addonOverallDetails)[0];

    setAddonGroup(addonOverallDetails[firstkey]?.group_list);
  };

  const handleDispatchAddon = (e, id) => {
    if (!e.target.checked) {
      return dispatch(
        removeCategoryLevelAddons({
          catId: catId,
          removeaddonId: id,
        })
      );
    }
    dispatch(
      handleCategoryLevelAddons({
        catId: catId,
        addonId: id,
      })
    );
  };

  const handleSaveMenu = async () => {
    const payload = {
      catalogId: param.menuId,
      isCatalogChange: false,
    };
    await updateMenu(payload);
    handleClose();
  };

  useEffect(() => {
    getAddonGroups();

    return () => {
      setAddonGroup([]);
    };
  }, []);

  useEffect(() => {
    return () => {
      isMenuChange && handleSaveMenu();
    };
  }, [isMenuChange]);
  return (
    <div className="addonGroupSelectContainer animeFadeIn px-3 py-2 rounded bg-white border">
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="text-nowrap fw-medium">Add Addon Groups</div>
        {isMenuChange ? (
          <MdCheck
            color="green"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
        ) : (
          <MdClose
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
        )}
      </div>
      <div className="border-top my-2"></div>
      {addonGroup?.length ? (
        addonGroup.map((addon) => (
          <Form.Check
            key={addon?.addon_group_id}
            label={addon?.addon_group}
            className="text-nowrap text-start"
            defaultChecked={catAddons.includes(addon?.addon_group_id)}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuChange(true);
              handleDispatchAddon(e, addon?.addon_group_id);
            }}
          />
        ))
      ) : (
        <div className="text-danger">No addon group found</div>
      )}
    </div>
  );
}

export default CategoryLevelAddonSelectionDropdown;
