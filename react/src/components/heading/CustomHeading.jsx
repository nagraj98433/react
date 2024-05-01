import React from "react";
import { themeColor } from "../../utilis/constants";

function CustomHeading({ heading }) {
  return (
    <h5
      className="ms-lg-5 ps-lg-3 ms-md-5 ps-md-3  ms-2 ps-2 my-3"
      style={{
        color: themeColor.textPrimary,
        fontSize: "23px",
      }}
    >
      {heading}
    </h5>
  );
}

export default CustomHeading;
