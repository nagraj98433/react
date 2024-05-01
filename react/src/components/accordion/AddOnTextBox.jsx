import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleChangeMenu } from "../../store/menuSlice";
import { handleActiveItem } from "../../store/activeItemSlice";
import { handleChangeAddOn } from "../../store/addOnCatalogSlice";

function AddOnTextBox({ name, code, valueKey, id }) {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const handleDispatch = () => {
    const postData = {
      code: code,
      type: "add_on",
      idKey: "addon_name_id",
      idValue: id,
      valueKey: valueKey,
      value: text,
    };
    dispatch(handleChangeAddOn(postData));
    dispatch(
      handleActiveItem({
        name: "isAddOnEdit",
        value: true,
      })
    );
  };

  useEffect(() => {
    setText(name ? name : "");
  }, [name]);
  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleDispatch}
      className="menuItemInputBox w-100"
      onFocus={() =>
        dispatch(
          handleActiveItem({
            name: "isAddOnEdit",
            value: true,
          })
        )
      }
      onClick={() =>
        dispatch(
          handleActiveItem({
            name: "isMenuEdit",
            value: true,
          })
        )
      }
    />
  );
}

export default AddOnTextBox;
