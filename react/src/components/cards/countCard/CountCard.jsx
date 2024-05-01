import React from "react";
import { themeColor } from "../../../utilis/constants";
import QuoteSvg from "../../../assets/svg/quote.svg";

function CountCard({ data }) {
  return (
    <div className="col-12 col-md-4 col-lg-4 p-2">
      <div
        style={{ height: "120px", backgroundColor: themeColor.accent }}
        className="rounded position-relative overflow-hidden countCard d-flex justify-content-evenly align-items-center p-2"
      >
        <div className="countCardBackgroundSvg">
          <img src={QuoteSvg} alt="svg" />
        </div>
        <div
          style={{ color: themeColor.primary }}
          className="fw-bolder fs-1 z-1"
        >
          {data?.count}
        </div>
        <div className="text-center fw-medium z-1">
          <div>{data?.name?.split(" ")[0]}</div>
          <div>{data?.name?.split(" ")[1]}</div>
        </div>
      </div>
    </div>
  );
}

export default CountCard;
