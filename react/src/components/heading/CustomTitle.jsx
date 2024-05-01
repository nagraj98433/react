import React from "react";
import { themeColor } from "../../utilis/constants";

function CustomTitle({ heading }) {
  return (
    <div
      className="mb-3 primary-text fw-medium"
      style={{
        color: themeColor.textPrimary,
        fontSize: "15px",
      }}
    >
      {heading}
    </div>
  );
}

export default CustomTitle;
