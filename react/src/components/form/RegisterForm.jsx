import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import {
  BASE_URL,
  regexPatternForEmail,
  regexPatternForPassword,
  themeColor,
} from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { FaSignInAlt } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { handleUserCredentials } from "../../store/userCredentialsSlice";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import CryptoJS from "crypto-js";
import { usePageLanguage } from "../../utilis/usePageLanguage";

function RegisterForm() {
  const pageStaticContent = usePageLanguage("register");
  const navigate = useNavigate();
  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    tnc: false,
  });
  const [isInvalid, setIsInValid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    tnc: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmpassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = () => {
    const validations = {
      email: !regexPatternForEmail.test(form.email),
      password: !regexPatternForPassword.test(form.password),
      confirmPassword: form.password !== form.confirmPassword,
      tnc: !form.tnc,
    };
    setIsInValid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    const encryptedPassword = CryptoJS.SHA256(form.password).toString(
      CryptoJS.enc.Hex
    );

    let data = new FormData();

    data.append("email", form.email);
    data.append("password", encryptedPassword);

    const registerData = {
      method: "post",
      url: BASE_URL + "api/profile/creation/",
      data: data,
    };

    const response = await globalApiHandler(registerData);

    if (response.success) {
      dispatch(
        handleUserCredentials({
          email: form.email,
          owner_id: response?.data?.owner_id,
        })
      );
      setIsLoading(false);
      navigate("/registration/verify");
    } else {
      toast.error(response.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    if (frontendValidation) {
      handleRegistration();
    }
  };

  return (
    <>
      <Toaster />
      <div className="row g-0 px-4 animeLeftToRight">
        <div className="col-12 my-3">
          <div className="registerHeading primary-text">
            <div>{pageStaticContent?.["00035"]}</div>
          </div>
        </div>
        <hr />
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00036"]}
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              type="email"
              placeholder={pageStaticContent?.["00037"]}
              required
              isInvalid={isInvalid.email}
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid" className="formLabelText">
              {pageStaticContent?.["00038"]}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00039"]}
            </Form.Label>
            <InputGroup>
              <Form.Control
                className="customInputBoxText"
                type={showPassword.password ? "text" : "password"}
                placeholder={pageStaticContent?.["00040"]}
                required
                isInvalid={isInvalid.password}
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <InputGroup.Text
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    password: !showPassword.password,
                  }))
                }
              >
                {showPassword.password ? (
                  <FaEyeSlash style={{ color: themeColor.primary }} />
                ) : (
                  <FaEye style={{ color: themeColor.primary }} />
                )}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid" className="formLabelText">
                {pageStaticContent?.["00041"]}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </div>
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00042"]}
            </Form.Label>
            <InputGroup>
              <Form.Control
                className="customInputBoxText"
                type={showPassword.confirmpassword ? "text" : "password"}
                placeholder={pageStaticContent?.["00042"]}
                required
                isInvalid={isInvalid.confirmPassword}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <InputGroup.Text
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirmpassword: !showPassword.confirmpassword,
                  }))
                }
              >
                {showPassword.confirmpassword ? (
                  <FaEyeSlash style={{ color: themeColor.primary }} />
                ) : (
                  <FaEye style={{ color: themeColor.primary }} />
                )}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid" className="formLabelText">
                {pageStaticContent?.["00044"]}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </div>
        <div className="col-12">
          <Form.Check
            style={{ fontSize: "13px" }}
            className="mb-3 primary-text"
            defaultChecked={form.tnc}
            onClick={() => setForm((prev) => ({ ...prev, tnc: !form.tnc }))}
            type={"checkbox"}
            label={pageStaticContent?.["00045"]}
          />
          {isInvalid.tnc && (
            <p className="text-danger formLabelText">
              {pageStaticContent?.["00046"]}
            </p>
          )}
        </div>
        <div className="col-12 mb-2">
          <h6 className="mb-3 formLabelText">
            {pageStaticContent?.["00047"]}{" "}
            <span
              className="cursor-pointer formLabelText"
              style={{ color: themeColor.primary }}
              onClick={() => navigate("/registration/login")}
            >
              {pageStaticContent?.["00048"]}
            </span>
          </h6>
        </div>
      </div>
      <div className="row g-0 px-3 mb-3">
        <div className="col-12 col-lg-6 pe-0 pe-lg-2 mb-2">
          <CustomButton
            name={pageStaticContent?.["00049"]}
            bgColor={themeColor.accent}
            color={themeColor.primary}
            postIcon={<IoChevronBackCircle size={"20px"} />}
            handleClick={() => navigate("/")}
          />
        </div>
        <div className="col-12 col-lg-6 ps-0 ps-lg-2 mb-2">
          <CustomButton
            name={pageStaticContent?.["00050"]}
            bgColor={themeColor.primary}
            preIcon={isLoading ? <Spinner /> : <FaSignInAlt size={"20px"} />}
            handleClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
