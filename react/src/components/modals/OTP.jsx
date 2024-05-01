import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomButton from "../buttons/CustomButton";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { themeColor } from "../../utilis/constants";
import { FaCircleCheck } from "react-icons/fa6";
import Spinner from "../loaders/Spinner";

function OTP({ show, handleToggle, email }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [otp, setOTP] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const otpVerification_url = BASE_URL + "authentication/";

  const handleOTP = async () => {
    setIsLoading(true);
    let data = new FormData();

    data.append("email", email);
    data.append("code", otp);

    await axios
      .post(otpVerification_url, data)
      .then((res) => {
        setIsLoading(false);
        if (res.data.success) {
          handleClose();
          navigate("/login");
        } else {
          setIsValid(false);
        }
      })
      .catch(() => {
        setIsValid(false);
        setIsLoading(false);
      });
  };

  const handleSubmit = () => {
    if (!otp.length) {
      return setIsValid(false);
    }
    handleOTP();
  };

  const handleClose = () => {
    setIsValid(true);
    setOTP("");
    handleToggle();
  };

  return (
    <Modal show={show} onHide={handleToggle} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Enter OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Enter OTP"
            required
            isInvalid={!isValid}
            name="otp"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            OTP is incorrect.
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <div className="row justify-content-center p-2">
        <div className="col-12 col-md-6 col-lg-6">
          <div className="me-lg-2 me-md-2 me-0 mb-2">
            <CustomButton
              name={"Verify"}
              bgColor={themeColor.primary}
              handleClick={handleSubmit}
              preIcon={isLoading ? <Spinner /> : <FaCircleCheck />}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default OTP;
