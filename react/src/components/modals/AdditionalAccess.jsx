import React from "react";
import { Form, Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import { FaCircleCheck } from "react-icons/fa6";
import { RiCloseCircleFill } from "react-icons/ri";

function AdditionalAccess({ show, handleToggle }) {
  return (
    <Modal show={show} onHide={handleToggle}>
      <h5 className="p-3 primary-text">You can change access here</h5>
      <div className="row px-3">
        <div className="col-12 col-lg-6 col-md-6 col-xl-6 px-4 py-2">
          <Form.Check type="checkbox" label="Basic Details" />
        </div>
        <div className="col-12 col-lg-6 col-md-6 col-xl-6 px-4 py-2">
          <Form.Check type="checkbox" label="Manage Menu" />
        </div>
        <div className="col-12 col-lg-6 col-md-6 col-xl-6 px-4 py-2">
          <Form.Check type="checkbox" label="Manage Tables" />
        </div>
        <div className="col-12 col-lg-6 col-md-6 col-xl-6 px-4 py-2">
          <Form.Check type="checkbox" label="Manage Staffs" />
        </div>
        <div className="col-12 col-lg-6 col-md-6 col-xl-6 px-4 py-2">
          <Form.Check type="checkbox" label="Order Settings" />
        </div>
        <div className="col-12 col-lg-6 col-md-6 col-xl-6 px-4 py-2">
          <Form.Check type="checkbox" label="Discount Approval" />
        </div>
      </div>
      <div className="row justify-content-center p-3">
        <div className="col-6 col-lg-3 col-md-4 col-xl-3 px-2">
          <CustomButton
            name={"Update"}
            bgColor={themeColor.primary}
            preIcon={<FaCircleCheck />}
          />
        </div>
        <div className="col-6 col-lg-3 col-md-4 col-xl-3 px-2">
          <CustomButton
            name={"Close"}
            color={themeColor.textSecondary}
            bgColor={themeColor.secondary}
            preIcon={<RiCloseCircleFill />}
            handleClick={handleToggle}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AdditionalAccess;
