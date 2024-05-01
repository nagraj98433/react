import React from "react";

function QRCardShimmer() {
  return (
    <div className="col-12 col-sm-6 col-lg-6 col-md-6 p-1">
      <div
        style={{ height: "150px", backgroundColor: "#dfdfdf" }}
        className="rounded position-relative p-2 border border-dark-subtle"
      >
        <div
          style={{ height: "20px", width: "20px" }}
          className="shimmerBG rounded position-absolute end-0 me-2"
        ></div>
        <div
          style={{ height: "25px", width: "180px" }}
          className="shimmerBG rounded"
        ></div>
        <div
          style={{ height: "12px", width: "200px" }}
          className="shimmerBG rounded-1 m-2"
        ></div>
        <div
          style={{ height: "12px", width: "200px" }}
          className="shimmerBG rounded-1 m-2"
        ></div>
        <div className="d-flex justify-content-center mt-3">
          <div className="p-2 border border-dark-subtle rounded-start">
            <div
              style={{ height: "20px", width: "20px" }}
              className="shimmerBG rounded m-auto"
            ></div>
            <div
              style={{ height: "8px", width: "50px" }}
              className="shimmerBG rounded-1 mt-1"
            ></div>
          </div>
          <div className="p-2 border border-dark-subtle">
            <div
              style={{ height: "20px", width: "20px" }}
              className="shimmerBG rounded m-auto"
            ></div>
            <div
              style={{ height: "8px", width: "50px" }}
              className="shimmerBG rounded-1 mt-1"
            ></div>
          </div>
          <div className="p-2 border border-dark-subtle rounded-end">
            <div
              style={{ height: "20px", width: "20px" }}
              className="shimmerBG rounded m-auto"
            ></div>
            <div
              style={{ height: "8px", width: "50px" }}
              className="shimmerBG rounded-1 mt-1"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCardShimmer;
