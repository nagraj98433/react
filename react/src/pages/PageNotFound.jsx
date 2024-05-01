import React from "react";
import { useRouteError } from "react-router-dom";
function PageNotFound() {
  const err = useRouteError();
  return (
    <div
      className="container d-flex align-items-center justify-content-center mt-5"
      style={{ marginTop: "80px" }}
    >
      <div
        className="text-center"
        style={{ background: "#fff", borderRadius: "10px", padding: "20px" }}
      >
        <h1 className="display-1 fw-bold">{err?.status}</h1>
        <p className="fs-3">
          <span className="text-danger">Opps! </span>
          {err.data}
        </p>
        <p className="lead">{err?.statusText}</p>
      </div>
    </div>
  );
}

export default PageNotFound;
