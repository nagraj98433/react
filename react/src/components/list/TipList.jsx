import React from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { themeColor } from "../../utilis/constants";

function TipList() {
  return (
    <>
      <CustomTitle heading={"Tip list"} />
      <ListGroup>
        <ListGroup.Item className="d-flex align-items-center gap-4">
          <div className="primary-text listNameText">€100</div>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <MdDelete color={themeColor.primary} size={"20px"} />
          </div>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex align-items-center gap-4">
          <div className="primary-text listNameText">€100</div>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <MdDelete color={themeColor.primary} size={"20px"} />
          </div>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex align-items-center gap-4">
          <div className="primary-text listNameText">€100</div>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <MdDelete color={themeColor.primary} size={"20px"} />
          </div>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

export default TipList;
