import React from "react";

function CustomButton({
  name,
  preIcon,
  postIcon,
  bgColor,
  color,
  handleClick,
  isDisable,
}) {
  return (
    <div
      style={{ backgroundColor: bgColor, color: color ? color : "#fff" }}
      className="py-1 px-2 rounded cursor-pointer"
      onClick={
        isDisable
          ? () => {
              return false;
            }
          : handleClick
      }
    >
      <div className="d-flex align-items-center justify-content-center gap-2 fw-medium">
        {preIcon && <div>{preIcon}</div>}
        {name && <div className="buttonText">{name}</div>}
        {postIcon && <div>{postIcon}</div>}
      </div>
    </div>
  );
}

export default CustomButton;
