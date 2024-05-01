import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

function HorizontalListShimmer() {
  return (
    <ListGroup horizontal>
      <ListGroupItem
        style={{ width: "190px", height: "40px", backgroundColor: "#dfdfdf" }}
      >
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "25px", width: "80px" }}
            className="shimmerBG rounded"
          ></div>
          <div className="d-flex align-items-center gap-2">
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
          </div>
        </div>
      </ListGroupItem>
      <ListGroupItem
        style={{ width: "190px", height: "40px", backgroundColor: "#dfdfdf" }}
      >
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "25px", width: "80px" }}
            className="shimmerBG rounded"
          ></div>
          <div className="d-flex align-items-center gap-2">
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
          </div>
        </div>
      </ListGroupItem>
      <ListGroupItem
        style={{ width: "190px", height: "40px", backgroundColor: "#dfdfdf" }}
      >
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "25px", width: "80px" }}
            className="shimmerBG rounded"
          ></div>
          <div className="d-flex align-items-center gap-2">
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
          </div>
        </div>
      </ListGroupItem>
    </ListGroup>
  );
}

export default HorizontalListShimmer;
