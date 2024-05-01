import React from "react";
import { themeColor } from "../../utilis/constants";

function ProfileCard({ data }) {
  return (
    <div className="mb-4">
      <div className="d-grid border rounded p-4 p-lg-5 text-center">
        <h1 style={{ fontSize: "2em", color: themeColor.primary }}>{data?.count ? data?.count : data?.icon}</h1>
        <div className="fw-medium">{data?.name}</div>
      </div>
    </div>
  );
}

export default ProfileCard;
