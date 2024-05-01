import React, { Fragment, useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomButton from "../buttons/CustomButton";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BASE_URL,
  regexPatternForPassword,
  themeColor,
} from "../../utilis/constants";
import { FaCircleCheck } from "react-icons/fa6";
import Spinner from "../loaders/Spinner";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useSelector } from "react-redux";
import { useRestaurantListApi } from "../../global_apis/useRestaurantListApi";
import CryptoJS from "crypto-js";
import toast, { Toaster } from "react-hot-toast";
import { InputGroup } from "react-bootstrap";

function AdministratorCredentialsModal({
  show,
  handleToggle,
  outletForm,
  setOutletForm,
}) {
  const userDetails = useSelector((state) => state.userData.data);

  const apiHandler = useGlobalApiHandler();
  const fetchRestaurantList = useRestaurantListApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    manager_name: "",
    password: "",
  });
  const [isInvalid, setIsInvalid] = useState({
    manager_name: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [usernameInvalidMsg, setUsernameInvalidMsg] = useState(
    "Please enter valid username."
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = () => {
    const validations = {
      manager_name: !form.manager_name.length,
      password: !regexPatternForPassword.test(form.password),
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleOutletCreation = async () => {
    setUsernameInvalidMsg("Please enter valid username.");
    setIsLoading(true);
    const frontendValidation = handleValidation();

    if (!frontendValidation) {
      return setIsLoading(false);
    }

    const encryptedPassword = CryptoJS.SHA256(form.password).toString(
      CryptoJS.enc.Hex
    );

    const data = {
      owner_id: userDetails?.owner_id,
      outlet_name: outletForm.outlet_name,
      description: outletForm.description,
      address: outletForm.address,
      currency: outletForm.currency,
      timezone: outletForm.timezone,
      contact: outletForm.contact,
      manager_name: outletForm?.currency + "." + form.manager_name,
      password: form.password,
      hash_password: encryptedPassword,
    };
    const restoApiData = {
      method: "post",
      url: BASE_URL + "api/outlets/creation/",
      data: data,
    };

    const response = await apiHandler(restoApiData);
    if (response?.success) {
      await fetchRestaurantList();
      setOutletForm({
        outlet_name: "",
        description: "",
        address: "",
        currency: "",
        timezone: "",
        contact: "",
        language: [],
      });
      setForm({
        manager_name: "",
        password: "",
      });
      navigate("/main/dashboard");
      handleToggle();
    } else if (response?.is_exist) {
      setUsernameInvalidMsg("Username already exist.");
      setIsInvalid((prev) => ({ ...prev, manager_name: true }));
    }
    setIsLoading(false);
  };
  return (
    <Modal show={show} onHide={handleToggle} backdrop="static" keyboard={false}>
      <Toaster />
      <Modal.Header closeButton>
        <Modal.Title>Manager Credentials</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label className="primary-text fw-medium formLabelText">
            Manager Username
          </Form.Label>
          <InputGroup>
            <InputGroup.Text className="customInputBoxText">
              {outletForm?.currency}.
            </InputGroup.Text>
            <Form.Control
              placeholder="Enter username"
              className="customInputBoxText"
              name="manager_name"
              isInvalid={isInvalid.manager_name}
              onChange={handleChange}
              value={form.manager_name}
            />
            <Form.Control.Feedback type="invalid">
              {usernameInvalidMsg}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        {form.manager_name.length ? (
          <div className="customInputBoxText animeTopToBottom fw-medium d-flex align-items-center gap-1 mb-2">
            <div>Manager username will be : </div>
            <div
              style={{ color: themeColor.primary, fontSize: "15px" }}
            >{`${outletForm?.currency}.${form.manager_name}`}</div>
          </div>
        ) : (
          ""
        )}
        <Form.Group>
          <Form.Label className="primary-text fw-medium formLabelText">
            Password
          </Form.Label>
          <Form.Control
            className="customInputBoxText"
            type="text"
            placeholder="Enter new password"
            required
            name="password"
            isInvalid={isInvalid.password}
            onChange={handleChange}
            value={form.password}
          />
          <Form.Control.Feedback type="invalid">
            Please enter valid password.
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <div className="row justify-content-center p-2">
        <div className="col-12 col-md-6 col-lg-6">
          <div className="me-lg-2 me-md-2 me-0 mb-2">
            <CustomButton
              name={"Save"}
              bgColor={themeColor.primary}
              preIcon={isLoading ? <Spinner /> : <FaCircleCheck />}
              handleClick={handleOutletCreation}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AdministratorCredentialsModal;
