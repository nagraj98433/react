import React from "react";
import { themeColor } from "../../../utilis/constants";
import { MdDelete, MdEdit } from "react-icons/md";

function TaxCard() {
  return (
    <div className="col-12 col-lg-4 col-md-6 col-xl-4 p-2">
      <div className="rounded border p-3 position-relative">
        <div className="taxName primary-text fw-medium">GST</div>
        {/* delete button */}
        <div className="d-flex gap-2 align-items-center position-absolute top-0 end-0 m-1">
          <MdEdit color={themeColor.primary} />
          <MdDelete color={themeColor.primary} />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div
            style={{ fontWeight: "700", color: themeColor.primary }}
            className="taxPercentage fs-5"
          >
            18%
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxCard;
