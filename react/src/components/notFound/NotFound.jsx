import React from "react";

function NotFound() {
  return (
    <div className="row">
      <div className="col-12">
        <div
          style={{ height: "140px" }}
          className="border rounded position-relative"
        >
          <div className="getCentered fw-medium text-danger">
            List not found
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
