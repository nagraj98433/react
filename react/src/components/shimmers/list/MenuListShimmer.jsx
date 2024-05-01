import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

function MenuListShimmer() {
  return (
    <ListGroup className="ms-3">
      <ListGroupItem style={{ height: "40px", backgroundColor: "#dfdfdf" }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "25px", width: "90%" }}
            className="shimmerBG rounded"
          ></div>
          <div
            style={{ fontSize: "11px" }}
            className="bi bi-chevron-down"
          ></div>
        </div>
      </ListGroupItem>
      <ListGroupItem style={{ height: "40px", backgroundColor: "#dfdfdf" }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "25px", width: "90%" }}
            className="shimmerBG rounded"
          ></div>
          <div
            style={{ fontSize: "11px" }}
            className="bi bi-chevron-down"
          ></div>
        </div>
      </ListGroupItem>
      <ListGroupItem style={{ height: "40px", backgroundColor: "#dfdfdf" }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "25px", width: "90%" }}
            className="shimmerBG rounded"
          ></div>
          <div
            style={{ fontSize: "11px" }}
            className="bi bi-chevron-down"
          ></div>
        </div>
      </ListGroupItem>
      <ListGroupItem style={{ height: "40px", backgroundColor: "#dfdfdf" }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "25px", width: "90%" }}
            className="shimmerBG rounded"
          ></div>
          <div
            style={{ fontSize: "11px" }}
            className="bi bi-chevron-down"
          ></div>
        </div>
      </ListGroupItem>
    </ListGroup>
  );
}

export default MenuListShimmer;
