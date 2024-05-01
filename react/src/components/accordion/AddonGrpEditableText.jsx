import React, { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { useDispatch } from "react-redux";
import { handleChangeMenu } from "../../store/menuSlice";
import { handleChangeAddOn } from "../../store/addOnCatalogSlice";
import { handleActiveItem } from "../../store/activeItemSlice";

function AddonGrpEditableText({ data }) {
  const [isReadOnly, setIsReadonly] = useState(true);
  const [name, setName] = useState("");

  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const activeStyle = {
    border: `1px solid ${themeColor.primary}`,
    borderRadius: "4px",
  };
  const notActiveStyle = {
    cursor: "pointer",
  };
  const handleChange = (e) => {
    setName(e.target.value);
  };
  const handleDispatch = () => {
    const inputValue = inputRef.current.value;
    const postData = {
      code: data?.code,
      type: "group_list",
      idKey: "addon_group_id",
      idValue: data?.addon_group_id,
      valueKey: "addon_group",
      value: name,
    };

    dispatch(handleChangeAddOn(postData));
    dispatch(
      handleActiveItem({
        name: "isAddOnEdit",
        value: true,
      })
    );
  };

  const handleClick = () => {
    setIsReadonly(false);
  };
  useEffect(() => {
    setName(data?.addon_group ? data?.addon_group : "");
  }, [data]);
  return (
    <div className="catSubcatEditableTextContainer col-2 d-flex align-items-center">
      <div className="languageTextLabel">{data?.code} - </div>
      <div className="d-flex gap-2 align-items-center">
        {isReadOnly ? (
          <div style={{ color: themeColor.primary }}>{name}</div>
        ) : (
          <input
            style={!isReadOnly ? activeStyle : notActiveStyle}
            ref={inputRef}
            type="text"
            className="catSubcatInputbox"
            value={name}
            onChange={handleChange}
            readOnly={isReadOnly}
            onFocus={() =>
              dispatch(
                handleActiveItem({
                  name: "isAddOnEdit",
                  value: true,
                })
              )
            }
            onBlur={() => {
              setIsReadonly(true);
              handleDispatch();
            }}
            autoFocus
          />
        )}
        <MdEdit
          color={themeColor.primary}
          size={"15px"}
          onClick={handleClick}
          className="catSubCatEditicon"
        />
      </div>
    </div>
  );
}

export default AddonGrpEditableText;
