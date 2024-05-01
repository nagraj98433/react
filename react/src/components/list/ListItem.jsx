import React from "react";
import { ListGroup } from "react-bootstrap";
import { MdEdit, MdDelete } from "react-icons/md";
import { BASE_URL, themeColor } from "../../utilis/constants";

function CustomListItem({ itemName, onEdit, onDelete }) {
  return (
    <ListGroup.Item
      className="d-flex align-items-center gap-4 mb-2 px-3"
      style={{ backgroundColor: themeColor.accent, padding: "4px" }}
    >
      <div className="primary-text listNameText">{itemName}</div>
      <div className="ms-auto d-flex gap-2 align-items-center">
        <MdEdit color={themeColor.primary} size={"20px"} onClick={onEdit} />
      </div>
    </ListGroup.Item>
  );
}

export default CustomListItem;
