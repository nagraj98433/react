import React from "react";
import CustomTitle from "../heading/CustomTitle";
import QRCodeCard from "../cards/QRCodeCard/QRCodeCard";

function TablesList() {
  return (
    <>
      <CustomTitle heading={"QR list"} />
      <div className="row animeBottomToTop">
        <QRCodeCard />
        <QRCodeCard />
        <QRCodeCard />
        <QRCodeCard />
      </div>
    </>
  );
}

export default TablesList;
