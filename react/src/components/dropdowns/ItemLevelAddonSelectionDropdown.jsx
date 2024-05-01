import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { MdCheck, MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { handleAddNewAddon } from "../../store/menuSlice";
import { useDispatch } from "react-redux";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";
import { useParams } from "react-router-dom";

function ItemLevelAddonSelectionDropdown({ handleClose, itemId, itemAddons }) {
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
    let newArray = [...itemAddons];
    if (e.target.checked) {
      newArray.push(id);
    } else {
      newArray = newArray.filter((item) => {
        return item !== id;
      });
    }
    dispatch(
      handleAddNewAddon({
        itemId: itemId,
        addons: newArray,
      })
    );
  };

  const handleSaveMenu = async () => {
    const payload = {
      catalogId: param.menuId,
      isCatalogChange: false,
    };
    await updateMenu(payload);
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
    <div className="itemLevelAddonGroupSelectContainer animeFadeIn px-3 py-2 rounded bg-white border">
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="text-nowrap fw-medium">Addon Groups</div>
        {isMenuChange ? (
          <MdCheck color="green" onClick={() => handleClose(null)} />
        ) : (
          <MdClose color="red" onClick={() => handleClose(null)} />
        )}
      </div>
      <div className="border-top my-2"></div>
      {addonGroup?.length ? (
        addonGroup.map((addon) => (
          <Form.Check
            key={addon?.addon_group_id}
            label={addon?.addon_group}
            defaultChecked={itemAddons?.includes(addon?.addon_group_id)}
            className="text-nowrap text-start"
            onClick={(e) => {
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

export default ItemLevelAddonSelectionDropdown;
