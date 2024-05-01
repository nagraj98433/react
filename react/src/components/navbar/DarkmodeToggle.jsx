import React from "react";
import { useDispatch } from "react-redux";
import { handleActiveItem } from "../../store/activeItemSlice";
import { useDarkModeToggle } from "../../utilis/useDarkMode";

function DarkmodeToggle() {
  const isDarkModeEnable = useDarkModeToggle();
  const dispatch = useDispatch();

  const handleCheck = () => {
    dispatch(
      handleActiveItem({
        name: "isDarkMode",
        value: isDarkModeEnable ? false : true,
      })
    );
  };

  return (
    <>
      {!isDarkModeEnable ? (
        <div
          onClick={handleCheck}
          className="bi bi-moon-stars-fill text-color-light cursor-pointer"
        ></div>
      ) : (
        <div
          onClick={handleCheck}
          className="bi bi-sun-fill text-white cursor-pointer"
        ></div>
      )}
    </>
  );
}

export default DarkmodeToggle;
