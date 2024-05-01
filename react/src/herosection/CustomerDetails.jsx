import React from "react";
import { Form, ListGroup } from "react-bootstrap";
import CustomTitle from "../components/heading/CustomTitle";

function CustomerDetails() {
  return (
    <>
      <CustomTitle
        heading={
          "To get customer contact information during order, enable below options."
        }
      />
      <ListGroup horizontal>
        <ListGroup.Item>
          <div className="d-grid">
            <div
              style={{ fontSize: "13px" }}
              className="fw-medium primary-text"
            >
              Dine-in
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="d-grid">
                <Form.Check type="switch" />
                <div
                  className="fw-medium secondary-text"
                  style={{ fontSize: "10px" }}
                >
                  Email
                </div>
              </div>
              <div className="d-grid">
                <Form.Check type="switch" />
                <div
                  className="fw-medium secondary-text"
                  style={{ fontSize: "10px" }}
                >
                  Phone No.
                </div>
              </div>
            </div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-grid">
            <div
              style={{ fontSize: "13px" }}
              className="fw-medium primary-text"
            >
              Online Order
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="d-grid">
                <Form.Check type="switch" />
                <div
                  className="fw-medium secondary-text"
                  style={{ fontSize: "10px" }}
                >
                  Email
                </div>
              </div>
              <div className="d-grid">
                <Form.Check type="switch" />
                <div
                  className="fw-medium secondary-text"
                  style={{ fontSize: "10px" }}
                >
                  Phone No.
                </div>
              </div>
            </div>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

export default CustomerDetails;
