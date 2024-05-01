import React from "react";
import { Modal } from "react-bootstrap";
import Spinner from "../loaders/Spinner";

function MenuUpdateModal({ show }) {
  return (
    <Modal show={show} backdrop="static" centered>
      <Modal.Body>
        <div className="py-5">
          <div className="text-center">
            <Spinner />
          </div>
          <div className="text-center">Menu is updating...</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default MenuUpdateModal;
