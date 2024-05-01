import React from "react";
import { Form } from "react-bootstrap";

const CustomInput = ({ label, onChange, type, name, value }) => {
  return (
    <Form.Group>
      <Form.Label className="primary-text fw-medium formLabelText">
        {label}
      </Form.Label>
      <Form.Control
        type={type}
        value={value}
        name={name}
        className="customInputBoxText"
        onChange={onChange}
      />
    </Form.Group>
  );
};

export default CustomInput;
