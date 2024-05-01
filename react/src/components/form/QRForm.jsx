import React from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import CustomTitle from "../heading/CustomTitle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function QRForm() {
  const restaurantId = useSelector(
    (state) => state.activeItemData.restaurantId
  );
  const navigate = useNavigate();

  const menuArry = [
    { value: "Pizz Menu", label: "Pizz Menu" },
    { value: "Non Veg Menu", label: "Non Veg Menu" },
    { value: "Veg Menu", label: "Veg Menu" },
  ];
  const groupsArray = [
    { value: "Group 1", label: "Group 1" },
    { value: "Group 2", label: "Group 2" },
    { value: "Group 3", label: "Group 3" },
  ];
  return (
    <>
      <div className="row g-0">
        <div className="col-12">
          <div className="mb-3 primary-text fw-medium">
            <span
              style={{
                color: themeColor.textPrimary,
                fontSize: "15px",
              }}
            >
              Create QR for tables
            </span>{" "}
            /{" "}
            <span
              className="cursor-pointer customizeQr text-decoration-underline"
              onClick={() =>
                navigate("/main/outlet/" + restaurantId + "/customizeqr")
              }
              style={{
                color: themeColor.primary,
                fontSize: "15px",
              }}
            >
              Customize QR Code
            </span>
          </div>
        </div>
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              Link Menus
            </Form.Label>
            <Select
              className="customInputBoxText"
              placeholder="Select menus"
              options={menuArry}
              isMulti
              defaultValue={[menuArry[0], menuArry[1]]}
            />
          </Form.Group>
        </div>
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              Assign Staff Groups
            </Form.Label>
            <Select
              className="customInputBoxText"
              placeholder="Select staff groups"
              options={groupsArray}
              isMulti
              defaultValue={[groupsArray[0], groupsArray[1]]}
            />
          </Form.Group>
        </div>
        <div className="col-3">
          <CustomButton name={"Save"} bgColor={themeColor.primary} />
        </div>
      </div>
    </>
  );
}

export default QRForm;
