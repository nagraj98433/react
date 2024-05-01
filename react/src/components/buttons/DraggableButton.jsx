import React from "react";
import { MdDelete, MdDragIndicator, MdEdit } from "react-icons/md";

function DraggableButton({ name, bgColor, color, isUpdate }) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: color ? color : "#fff",
      }}
      className="py-1 px-2 rounded"
    >
      <div className="d-flex align-items-center justify-content-start gap-2 fw-medium">
        <MdDragIndicator color={color} />
        <div className="buttonText">{name}</div>
        {isUpdate && (
          <>
            <MdEdit color={color} className="ms-auto" />
            <MdDelete color={color} />
          </>
        )}
      </div>
    </div>
  );
}

export default DraggableButton;
