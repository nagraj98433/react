import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleChangeMenu } from "../../store/menuSlice";
import { handleActiveItem } from "../../store/activeItemSlice";

function MenuTextBox({ name, code, valueKey, id }) {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const handleDispatch = () => {
    const postData = {
      code: code,
      type: "product",
      idKey: "product_id",
      idValue: id,
      valueKey: valueKey,
      value: text,
    };
    dispatch(handleChangeMenu(postData));
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

export default MenuTextBox;
