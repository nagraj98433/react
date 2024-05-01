import React, { useEffect, useRef, useState } from "react";
import { themeColor } from "../../utilis/constants";
import { MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { handleCatalogChange } from "../../store/menuSlice";
import { handleUpdateCatalogList } from "../../store/menuCatalogSlice";
import { useSelector } from "react-redux";
import { handleActiveItem } from "../../store/activeItemSlice";
import toast from "react-hot-toast";

function MenuTitle({ data, code }) {
  const menuLanguages = useSelector(
    (state) => state.activeItemData.selectedMenuLanguages
  );

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

  const handleClick = () => {
    setIsReadonly(false);
  };

  const handleDispatch = () => {
    if (!name.trim().length) {
      toast.error("Menu title cannot be empty");
      return setName(data?.catalog_name);
    }
    const postData = {
      code: code,
      value: name.trim(),
    };
    dispatch(handleCatalogChange(postData));
    menuLanguages[0] === code &&
      dispatch(
        handleUpdateCatalogList({
          id: data?.catalog_id,
          value: name,
        })
      );
  };

  useEffect(() => {
    setName(data?.catalog_name ? data?.catalog_name : "");
  }, [data]);
  return (
    <div className="catSubcatEditableTextContainer d-flex align-items-center">
      <div className="languageTextLabel">{code} - </div>
      <div className="d-flex gap-2 align-items-center">
        {isReadOnly ? (
          <div style={{ color: themeColor.primary }}>{name}</div>
        ) : (
          <input
            style={!isReadOnly ? activeStyle : notActiveStyle}
            ref={inputRef}
            autoFocus
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

export default MenuTitle;
