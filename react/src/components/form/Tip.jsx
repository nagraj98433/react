import React, { useState } from "react";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import CustomTitle from "../heading/CustomTitle";

function Tip() {
  const [isPercenatge, setIsPercentage] = useState(false);
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center gap-2">
            <CustomTitle heading={"Create Tip in"} />
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
            <div className="col-12 mb-3">
              <Form.Group>
                <Form.Label className="formLabelText">
                  Tip {isPercenatge ? "percentage" : "amount"}
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  placeholder={
                    isPercenatge ? "Enter tip percentage" : "Enter tip amount"
                  }
                />
              </Form.Group>
            </div>
            <div className="col-3">
              <CustomButton name={"Save"} bgColor={themeColor.primary} />
            </div>
          </div>
          <div className="row"></div>
        </div>
      </div>
    </div>
  );
}

export default Tip;
