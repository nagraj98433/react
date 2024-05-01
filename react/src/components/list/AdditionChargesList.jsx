import React from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { themeColor } from "../../utilis/constants";
import { MdDelete, MdEdit } from "react-icons/md";

function AdditionChargesList() {
  return (
    <>
      <CustomTitle heading={"Additional charge list"} />

      <ListGroup as={"ol"} numbered>
        <ListGroup.Item
          as={"li"}
          className="d-flex align-items-center gap-3 formLabelText"
        >
          <div className="d-grid">
            <div
              style={{ fontSize: "13px" }}
              className="primary-text fw-medium"
            >
              Service charge
            </div>
            <div style={{ fontSize: "12px" }} className="secondary-text">
              5%
            </div>
          </div>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <MdEdit color={themeColor.primary} size={"20px"} />
            <MdDelete color={themeColor.primary} size={"20px"} />
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as={"li"}
          className="d-flex align-items-center gap-3 formLabelText"
        >
          <div className="d-grid">
            <div
              style={{ fontSize: "13px" }}
              className="primary-text fw-medium"
            >
              Delivery charge
            </div>
            <div style={{ fontSize: "12px" }} className="secondary-text">
              2%
            </div>
          </div>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <MdEdit color={themeColor.primary} size={"20px"} />
            <MdDelete color={themeColor.primary} size={"20px"} />
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as={"li"}
          className="d-flex align-items-center gap-3 formLabelText"
        >
          <div className="d-grid">
            <div
              style={{ fontSize: "13px" }}
              className="primary-text fw-medium"
            >
              Process charge
            </div>
            <div style={{ fontSize: "12px" }} className="secondary-text">
              1%
            </div>
          </div>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <MdEdit color={themeColor.primary} size={"20px"} />
            <MdDelete color={themeColor.primary} size={"20px"} />
          </div>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

export default AdditionChargesList;
