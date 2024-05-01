import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handlePriceChange } from "../../store/menuSlice";

function MenuPriceTextBox({ name, isDisabled, id }) {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const handleDispatch = () => {
    const postData = {
      id: id,
      value: Number(text),
    };
    dispatch(handlePriceChange(postData));
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
      onBlur={handleDispatch}
      className="menuItemInputBox w-100"
    />
  );
}

export default MenuPriceTextBox;
