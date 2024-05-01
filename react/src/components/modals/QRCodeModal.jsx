import React from "react";
import { Form, ListGroup, Modal } from "react-bootstrap";
import Select from "react-select";
import CustomTitle from "../heading/CustomTitle";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";

function QRCodeModal({ show, handleToggle }) {
  const menus = [
    { value: "Menu 1", label: "Menu 1" },
    { value: "Menu 2", label: "Menu 2" },
    { value: "Menu 3", label: "Menu 3" },
  ];
  const groups = [
    { value: "Group 1", label: "Group 1" },
    { value: "Group 2", label: "Group 2" },
    { value: "Group 3", label: "Group 3" },
    { value: "Group 4", label: "Group 4" },
    { value: "Group 5", label: "Group 5" },
  ];
  return (
    <Modal show={show} onHide={handleToggle}>
      <Modal.Body>
        <div className="row px-2">
          <div className="col-12 d-flex align-items-start">
            <CustomTitle heading={"QR Details"} />
            <div className="ms-auto">
              <CustomButton name={"Update"} bgColor={themeColor.primary} />
            </div>
          </div>
          <div className="col-12 px-2">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                QR name
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder="Enter QR name"
              />
            </Form.Group>
          </div>
          <div className="col-12 px-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Linked Menus
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select menus"
                options={menus}
                isMulti
                defaultValue={[menus[0], menus[2]]}
              />
            </Form.Group>
          </div>
          <div className="col-12 px-2 mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Assigned Groups
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select groups"
                options={groups}
                isMulti
                defaultValue={[groups[0]]}
              />
            </Form.Group>
          </div>
          <div className="col-12 px-2 text-nowrap">
            <ListGroup horizontal>
              <ListGroup.Item className="text-center">
                <div className="bi bi-qr-code"></div>
                <div className="switchLabel primary-text">Download QR</div>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                <Form.Check type="checkbox" defaultChecked />
                <div className="switchLabel primary-text">Pin lock</div>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                <Form.Check type="checkbox" />
                <div className="switchLabel primary-text">Multiple Bills</div>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default QRCodeModal;
