import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleAddOnPriceChange } from "../../store/addOnCatalogSlice";
import { handleActiveItem } from "../../store/activeItemSlice";

function AddonPriceTextBox({ name, isDisabled, id }) {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const handleDispatch = () => {
    const postData = {
      id: id,
      value: Number(text),
    };
    dispatch(handleAddOnPriceChange(postData));
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
      disabled={isDisabled}
      type="number"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onFocus={() =>
        dispatch(
          handleActiveItem({
            name: "isAddOnEdit",
            value: true,
          })
        )
      }
      onBlur={handleDispatch}
      className="menuItemInputBox w-100"
    />
  );
}

export default AddonPriceTextBox;
