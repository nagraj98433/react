import React from "react";
import CustomTitle from "../components/heading/CustomTitle";
import { Form } from "react-bootstrap";
import Select from "react-select";

function MenuItemDetails() {
  return (
    <>
      <CustomTitle heading={"Item Details"} />
      <div className="row">
        <div className="col-4 mb-3">
          <Form.Group>
            <Form.Label className="primary-text fw-medium formLabelText">
              Name
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              placeholder="Enter item name"
            />
          </Form.Group>
        </div>
        <div className="col-6 mb-3">
          <Form.Group>
            <Form.Label className="primary-text fw-medium formLabelText">
              Description
            </Form.Label>
            <Form.Control
              as={"textarea"}
              className="customInputBoxText"
              placeholder="Enter item description"
            />
          </Form.Group>
        </div>
        <div className="col-4 mb-3">
          <Form.Group>
            <Form.Label className="primary-text fw-medium formLabelText">
              Price
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              placeholder="Enter item price"
              type="number"
            />
          </Form.Group>
        </div>
        <div className="col-4 mb-3">
          <Form.Group>
            <Form.Label className="primary-text fw-medium formLabelText">
              Image
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              placeholder="Upload img of item"
              type="file"
            />
          </Form.Group>
        </div>
        <div className="col-4 mb-3">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Add taxes and other charges
            </Form.Label>
            <Select
              className="customInputBoxText"
              placeholder="Select charges"
              isMulti
            />
          </Form.Group>
        </div>
        <div className="col-3 gap-3">
          <Form.Switch className="formLabelText" label={"Status"} />
          <Form.Switch className="formLabelText" label={"Kitchen"} />
          <Form.Switch className="formLabelText" label={"Out of stock"} />
        </div>
        <div className="col-9 mb-3">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Select Addons
            </Form.Label>
            <Select
              className="customInputBoxText"
              placeholder="Select addons"
              isMulti
            />
          </Form.Group>
        </div>
      </div>
    </>
  );
}

export default MenuItemDetails;
