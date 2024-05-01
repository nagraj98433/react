import React, { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { handleChangeAddOn } from "../../store/addOnCatalogSlice";
import { useDispatch } from "react-redux";
import { handleActiveItem } from "../../store/activeItemSlice";
import { handleChangeMenu } from "../../store/menuSlice";
import toast from "react-hot-toast";

function SubcatEditableText({ data }) {
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

  const handleDispatch = () => {
    if (!name.trim().length) {
      toast.error("Subcategory name cannot be empty");
      return setName(data?.data?.name);
    }
    const postData = {
      code: data?.code,
      type: "subcategory",
      idKey: "subcategory_id",
      idValue: data?.data?.subcategory_id,
      valueKey: "name",
      value: name.trim(),
    };
    dispatch(handleChangeMenu(postData));
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsReadonly(false);
  };

  useEffect(() => {
    setName(data?.data ? data?.data?.name : "");
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
            onFocus={() =>
              dispatch(
                handleActiveItem({
                  name: "isMenuEdit",
                  value: true,
                })
              )
            }
            onChange={(e) => {
              setName(e.target.value);
            }}
            readOnly={isReadOnly}
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

export default SubcatEditableText;
