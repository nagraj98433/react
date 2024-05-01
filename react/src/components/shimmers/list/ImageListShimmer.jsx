import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

function VerticalListShimmer() {
  return (
    <ListGroup>
      <ListGroupItem style={{ height: "100%", backgroundColor: "#dfdfdf" }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          <div
            style={{ height: "200px", width: "100%" }}
            className="shimmerBG rounded"
          ></div>
          {/* <div className="d-flex align-items-center gap-2">
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
            <div
              style={{ height: "25px", width: "25px" }}
              className="shimmerBG rounded"
            ></div>
          </div> */}
        </div>
      </ListGroupItem>
    </ListGroup>
  );
}

export default VerticalListShimmer;
