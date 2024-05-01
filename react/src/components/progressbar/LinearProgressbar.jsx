import React from "react";
import { themeColor } from "../../utilis/constants";

function LinearProgressbar({ progress, size }) {
  return (
    <div
      className="linearProgressbarMainContainer"
      style={{ backgroundColor: themeColor.accent, height: `${size}px` }}
    >
      <div
        style={{ backgroundColor: themeColor.primary, width: `${progress}%` }}
        className="linearProgress"
      ></div>
    </div>
  );
}

export default LinearProgressbar;
