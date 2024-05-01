import React from "react";
import { themeColor } from "../../utilis/constants";

function ProfileCircle({ size, name }) {
  return (
    <div
      className="position-relative"
      style={{
        border: `1px solid ${themeColor.primary}`,
        backgroundColor: themeColor.accent,
        borderRadius: "50%",
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      <div
        className="getCentered fw-bold"
        style={{
          fontSize: `${size / 2}px`,
          color: themeColor.primary,
        }}
      >
        {name}
      </div>
    </div>
  );
}

export default ProfileCircle;
