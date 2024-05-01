import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { themeColor } from "../../../utilis/constants";
import { RiEyeFill } from "react-icons/ri";
import QRCodeModal from "../../modals/QRCodeModal";
import { checkedStyle } from "../../../utilis/styles";

function QRCodeCard({ handleModal }) {
  const [showModal, setShowModal] = useState(false);

  const [isChecked, setIsChecked] = useState({
    pin: true,
    multiBill: false,
  });

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="col-12 col-sm-6 col-lg-6 col-md-6 p-1">
      <div className="qrCodeCard position-relative rounded border cursor-pointer p-2">
        <div className="position-absolute top-0 end-0 me-2">
          <RiEyeFill onClick={toggleModal} color={themeColor.primary} />
        </div>
        <div className="qr-heading">Table 1</div>
        <div className="linkItemName secondary-text ms-2">
          Linked Menus :{" "}
          <span className="linkItemCount" style={{ color: themeColor.primary }}>
            02
          </span>
        </div>
        <div className="linkItemName secondary-text ms-2 mb-2">
          Assigned Groups :{" "}
          <span className="linkItemCount" style={{ color: themeColor.primary }}>
            03
          </span>
        </div>
        <div className="d-flex justify-content-center text-nowrap">
          <ListGroup horizontal>
            <ListGroup.Item className="text-center">
              <div className="bi bi-qr-code"></div>
              <div className="switchLabel primary-text">Download QR</div>
            </ListGroup.Item>
            <ListGroup.Item className="text-center">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked
                value={isChecked.pin}
                onClick={() =>
                  setIsChecked((prev) => ({ ...prev, pin: !isChecked.pin }))
                }
                style={isChecked.pin ? checkedStyle : {}}
              />
              <div className="switchLabel primary-text">Pin lock</div>
            </ListGroup.Item>
            <ListGroup.Item className="text-center">
              <input
                className="form-check-input"
                type="checkbox"
                value={isChecked.multiBill}
                onClick={() =>
                  setIsChecked((prev) => ({
                    ...prev,
                    multiBill: !isChecked.multiBill,
                  }))
                }
                style={isChecked.multiBill ? checkedStyle : {}}
              />
              <div className="switchLabel primary-text">Multiple Bills</div>
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>
      <QRCodeModal show={showModal} handleToggle={toggleModal} />
    </div>
  );
}

export default QRCodeCard;
