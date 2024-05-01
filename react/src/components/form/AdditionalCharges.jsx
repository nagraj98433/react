import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";

function AdditionalCharges() {
  const [isPercentage, setIsPercentage] = useState(true);
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <div
              style={{
                color: themeColor.textPrimary,
                fontSize: "15px",
              }}
              className="primary-text fw-medium"
            >
              Create Additional charges in
            </div>
            <div className="mb-auto">
              <Form.Check
                className="fw-medium formHeadingText"
                type="radio"
                name="taxType"
                label="Flat"
                onClick={() => setIsPercentage(false)}
              />
            </div>
            <div className="fw-medium formHeadingText mb-auto">or</div>
            <div className="mb-auto">
              <Form.Check
                className="fw-medium formHeadingText"
                type="radio"
                defaultChecked
                name="taxType"
                label="Percentage"
                onClick={() => setIsPercentage(true)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-2">
              <Form.Group>
                <Form.Label className="formLabelText">Name</Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  placeholder="Enter name"
                />
              </Form.Group>
            </div>
            <div className="col-12 mb-3">
              <Form.Group>
                <Form.Label className="formLabelText">Charge</Form.Label>
                <InputGroup>
                  <Form.Control
                    className="customInputBoxText"
                    placeholder="Enter Charges"
                  />
                  <InputGroup.Text>{isPercentage ? "%" : "€"}</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-12 mb-3">
              <div className="fw-medium primary-text mb-2 formLabelText">
                Do you want to apply this charge to all bills?
              </div>
              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  type="radio"
                  name={"foodTax"}
                  label="Yes"
                  defaultChecked
                  className="formHeadingText"
                />
                <Form.Check
                  type="radio"
                  className="formHeadingText"
                  name={"foodTax"}
                  label="No"
                />
              </div>
            </div>
            <div className="col-4">
              <CustomButton name={"Save"} bgColor={themeColor.primary} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdditionalCharges;
