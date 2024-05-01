import React, { useRef, useState } from "react";
import { themeColor } from "../../utilis/constants";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import useIdGenerator from "../../utilis/useIdGenerator";
import { useParams } from "react-router-dom";
import { handleActiveItem } from "../../store/activeItemSlice";
import { handleAddOnNewItem } from "../../store/addOnCatalogSlice";

function NewAddOnCatEditable({ toggle }) {
  const addOnOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );

  const [name, setName] = useState("");
  const [generateId, setGenerateId] = useIdGenerator();

  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const params = useParams();

  const activeStyle = {
    border: `1px solid ${themeColor.primary}`,
    borderRadius: "4px",
  };

  const handleSubmit = () => {
    if (!name.length) {
      return false;
    }
    const payload = {
      type: "group_list",
      value: {
        addon_group_id: params?.outletId + "_" + `${generateId}`,
        addon_group: name,
      },
    };

    dispatch(handleAddOnNewItem(payload));
    setName("");
    toggle();
  };
  return (
    <div className="catSubcatEditableTextContainer col-2 d-flex align-items-center gap-2">
      <div className="languageTextLabel text-nowrap">
        {Object.keys(addOnOverallDetails)[0]} -{" "}
      </div>
      <div className="d-flex gap-2 align-items-center">
        <input
          style={activeStyle}
          ref={inputRef}
          type="text"
          className="catSubcatInputbox"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onFocus={() =>
            dispatch(
              handleActiveItem({
                name: "isAddOnEdit",
                value: true,
              })
            )
          }
          onBlur={() => {
            setGenerateId();
            handleSubmit();
          }}
          autoFocus
        />
      </div>
    </div>
  );
}

export default NewAddOnCatEditable;
