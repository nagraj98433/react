import React from "react";
import { Form } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import CustomInput from "../buttons/CustomInput";

const CustomizeQrForm = (props) => {
  const selectBtnStyle = {
    lineHeight: 1.3,
    fontSize: "0.9rem",
  };

  return (
    <div
      className="col-12 col-lg-6 col-md-6 overflow-auto customscrollbar"
      style={{ height: "100vh" }}
    >
      <div className="row pb-3 m-0">
        <CustomTitle heading={"Customize QR"} />
        <div className="row mb-2">
          <div className="col-12">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                QR Theme Name
              </Form.Label>
              <Form.Control
                value={props.qr.themeName}
                name="themeName"
                placeholder="Enter QR Theme Name"
                className="customInputBoxText form-control"
                onChange={props.handleQrDesign}
                onKeyPress={props.keyEnter}
                type="text"
                required
                isInvalid={props.isInvalid}
              />
              <Form.Control.Feedback type="invalid">
                Please enter name of QR Theme.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-lg-4 col-md-6 col-7">
            <CustomInput
              label="QR Background Color"
              onChange={props.handleQrDesign}
              type="color"
              value={props.qr.qrBgClr}
              name="qrBgClr"
            />
          </div>
          <div className="col-12 col-lg-8 col-md-6 ">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                QR Background Image
              </Form.Label>
              <Form.Control
                type="file"
                name="qrFullImg"
                className="customInputBoxText"
                onChange={props.value[2]}
              />
            </Form.Group>
          </div>

          <div className="col-12 col-lg-4 col-md-6 mt-2">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                QR Code Size
              </Form.Label>
              <select
                className="form-select "
                style={selectBtnStyle}
                name="qrCodeSize"
                defaultValue={props.qr.qrCodeSize}
                onChange={props.handleQrDesign}
              >
                <option value="200">Small</option>
                <option value="250">Medium</option>
                <option value="300">Large</option>
              </select>
            </Form.Group>
          </div>
        </div>
      </div>
      <div className="row pb-3 m-0">
        <div className="d-flex gap-3">
          <CustomTitle heading={"Display Logo"} />
          <div>
            {" "}
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              onChange={props.toggleLogoDisplay}
            />
          </div>
        </div>
        {props.showLogo && (
          <div className="row mb-2">
            <div className="col-12 col-lg-8 col-md-6 ">
              <Form.Group>
                <Form.Label className="primary-text fw-medium formLabelText">
                  Logo
                </Form.Label>
                <Form.Control
                  type="file"
                  name="logo"
                  className="customInputBoxText"
                  onChange={props.value[1]}
                />
              </Form.Group>
            </div>
            <div className="col-12 col-lg-4 col-md-6 ">
              <Form.Group>
                <Form.Label className="primary-text fw-medium formLabelText">
                  Logo Position
                </Form.Label>
                <select
                  className="form-select "
                  style={selectBtnStyle}
                  name="logoPosition"
                  defaultValue={props.qr.logoPosition}
                  onChange={props.handleQrDesign}
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </Form.Group>
            </div>

            <div className="col-12 col-lg-4 col-md-6 mt-2">
              <Form.Group>
                <Form.Label className="primary-text fw-medium formLabelText">
                  Logo Alignment
                </Form.Label>
                <select
                  className="form-select "
                  style={selectBtnStyle}
                  name="logoAlign"
                  defaultValue={props.qr.logoAlign}
                  onChange={props.handleQrDesign}
                >
                  <option value="5%">Left</option>
                  <option value="30%">Center</option>
                  <option value="55%">Right</option>
                </select>
              </Form.Group>
            </div>
            <div className="col-12 col-lg-4 col-md-6 mt-2">
              <Form.Group>
                <Form.Label className="primary-text fw-medium formLabelText">
                  Logo Size
                </Form.Label>
                <select
                  className="form-select "
                  style={selectBtnStyle}
                  name="logoSize"
                  defaultValue={props.qr.logoSize}
                  onChange={props.handleQrDesign}
                >
                  <option value="20%">Small</option>
                  <option value="30%">Medium</option>
                  <option value="40%">Large</option>
                </select>
              </Form.Group>
            </div>
          </div>
        )}
      </div>

      <div className="row pb-3 m-0">
        <CustomTitle heading={"Customize Header content"} />
        <div className="row mb-2">
          <div className="col-12">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Header Text
              </Form.Label>
              <textarea
                type="textarea"
                value={props.qr.headerText}
                name="headerText"
                placeholder="Enter Header Text"
                rows="3"
                className="customInputBoxText form-control"
                onChange={props.handleQrDesign}
                onKeyPress={props.keyEnter}
              />
            </Form.Group>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-lg-4 col-md-6 col-12 mb-2">
            <CustomInput
              label="Font Size"
              onChange={props.handleQrDesign}
              type="number"
              value={props.qr.headerFs}
              name="headerFs"
            />
          </div>
          <div className="col-lg-4 col-md-6 col-5 mb-2">
            <CustomInput
              label="Text Color"
              onChange={props.handleQrDesign}
              type="color"
              value={props.qr.headerTxtClr}
              name="headerTxtClr"
            />
          </div>

          <div className="col-12 col-lg-4 col-md-6">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Font Family
              </Form.Label>
              <select
                className="form-select "
                style={selectBtnStyle}
                name="headerFontFamily"
                defaultValue={props.qr.headerFontFamily}
                onChange={props.handleQrDesign}
              >
                <option value="Poppins">Poppins</option>
                <option value="Arial">Arial</option>
                <option value="fantasy">Fantasy</option>
                <option value="cursive">cursive</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-12 col-lg-4 col-md-6 ">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Font Style
              </Form.Label>
              <select
                className="form-select "
                style={selectBtnStyle}
                defaultValue={props.qr.headerFontStyle}
                name="headerFontStyle"
                onChange={props.handleQrDesign}
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                <option value="oblique">Oblique</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-12 col-lg-4 col-md-6 ">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Font Align
              </Form.Label>
              <select
                className="form-select "
                style={selectBtnStyle}
                name="headerFontAlign"
                defaultValue={props.qr.headerFontAlign}
                onChange={props.handleQrDesign}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </Form.Group>
          </div>
        </div>
      </div>
      <div className="row m-0">
        <CustomTitle heading={"Customise Footer content"} />
        <div className="row mb-2">
          <div className="col-12">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Footer Text
              </Form.Label>
              <textarea
                type="text"
                value={props.qr.footerText}
                name="footerText"
                rows="3"
                placeholder="Enter Footer Text"
                className="customInputBoxText form-control"
                onChange={props.handleQrDesign}
                onKeyPress={props.keyEnter}
              />
            </Form.Group>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-lg-4 col-md-6 col-12 mb-2">
            <CustomInput
              label="Font Size"
              onChange={props.handleQrDesign}
              type="number"
              value={props.qr.footerFs}
              name="footerFs"
            />
          </div>
          <div className="col-lg-4 col-md-6 col-5 mb-2">
            <CustomInput
              label="Text Color"
              onChange={props.handleQrDesign}
              type="color"
              value={props.qr.footerTxtClr}
              name="footerTxtClr"
            />
          </div>

          <div className="col-12 col-lg-4 col-md-6">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Font Family
              </Form.Label>
              <select
                className="form-select "
                style={selectBtnStyle}
                defaultValue={props.qr.footerFontFamily}
                name="footerFontFamily"
                onChange={props.handleQrDesign}
              >
                <option value="Poppins">Poppins</option>
                <option value="Arial">Arial</option>
                <option value="fantasy">Fantasy</option>
                <option value="cursive">cursive</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-12 col-lg-4 col-md-6 ">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Font Style
              </Form.Label>
              <select
                className="form-select "
                style={selectBtnStyle}
                name="footerFontStyle"
                defaultValue={props.qr.footerFontStyle}
                onChange={props.handleQrDesign}
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                <option value="oblique">Oblique</option>
              </select>
            </Form.Group>
          </div>
          <div className="col-12 col-lg-4 col-md-6 ">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Font Align
              </Form.Label>
              <select
                className="form-select "
                style={selectBtnStyle}
                name="footerFontAlign"
                defaultValue={props.qr.footerFontAlign}
                onChange={props.handleQrDesign}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </Form.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeQrForm;
