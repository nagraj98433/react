import React, { useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import Restaurants from "../../herosection/Restaurants";

function CustomOffCanvas({ show, setShow, handleClose }) {
  useEffect(() => {
    return () => {
      setShow(false);
    };
  }, []);
  return (
    <Offcanvas placement="end" show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton></Offcanvas.Header>
      <Restaurants />
    </Offcanvas>
  );
}

export default CustomOffCanvas;
