import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "../buttons/CustomButton";
import { FaSignInAlt } from "react-icons/fa";
import { themeColor } from "../../utilis/constants";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CryptoJS from "crypto-js";
import Spinner from "../loaders/Spinner";
import {
  BASE_URL,
  regexPatternForVerificationCode,
  regexPatternForPassword,
} from "../../utilis/constants";
import { usePageLanguage } from "../../utilis/usePageLanguage";

const ChangePassword = () => {
  const pageStaticContent = usePageLanguage("changepassword");
  const navigate = useNavigate();
  const globalApiHandler = useGlobalApiHandler();
  const userEmail = useSelector((state) => state.userCredentialData.data);
  const [showPassword, setShowPassword] = useState({
    password: false,
  });
  const [changeData, setChangeData] = useState({
    verificationCode: "",
    changePassword: "",
  });
  const [isInvalid, setIsInValid] = useState({
    changePassword: false,
    verificationCode: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setChangeData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleValidation = () => {
    const validations = {
      changePassword: !regexPatternForPassword.test(changeData.changePassword),
      verificationCode: !regexPatternForVerificationCode.test(
        changeData.verificationCode
      ),
    };
    setIsInValid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    const encryptedPassword = CryptoJS.SHA256(
      changeData.changePassword
    ).toString(CryptoJS.enc.Hex);
    let data = new FormData();
    data.append("email", userEmail.email.toLowerCase());
    data.append("confirmation_code", changeData.verificationCode);
    data.append("new_password", encryptedPassword);
    const forgetData = {
      method: "put",
      url: BASE_URL + "api/update/password/",
      data: data,
    };
    const response = await globalApiHandler(forgetData);
    console.log(response);
    if (response.success) {
      response?.message && toast.success(response?.success);
      setIsLoading(false);
      navigate("/registration/login");
    } else {
      response?.message && toast.error(response?.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    if (frontendValidation) {
      handleChangePassword();
    }
  };
  return (
    <>
      <Toaster />
      <div className="row g-0 px-4 mt-3 animeRightToLeft">
        <div className="col-12 mb-2">
          <div className="registerHeading primary-text">
            <div>{pageStaticContent?.["00057"]}</div>
          </div>
        </div>
        <hr />
        <div className="col-12">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00058"]}
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              type="email"
              placeholder={"Enter email"}
              required
              name="email"
              readOnly
              value={userEmail.email}
            />
          </Form.Group>
        </div>
        <div className="col-12">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00059"]}
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              type="number"
              placeholder={pageStaticContent?.["00060"]}
              required
              name="verificationCode"
              isInvalid={isInvalid.verificationCode}
              value={changeData.verificationCode}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid" className="formLabelText">
              {pageStaticContent?.["00061"]}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-12">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              {pageStaticContent?.["00062"]}
            </Form.Label>
            <InputGroup>
              <Form.Control
                className="customInputBoxText"
                type={showPassword.password ? "text" : "password"}
                placeholder={pageStaticContent?.["00063"]}
                required
                name="changePassword"
                isInvalid={isInvalid.changePassword}
                value={changeData.changePassword}
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
                {pageStaticContent?.["00064"]}
              </Form.Control.Feedback>
            </InputGroup>{" "}
          </Form.Group>
        </div>
      </div>
      <div className="row g-0 px-3 mb-3 mt-2 justify-content-center">
        <div className="col-12 col-lg-6 ps-0 ps-lg-2 mb-2">
          <CustomButton
            name={pageStaticContent?.["00065"]}
            bgColor={themeColor.primary}
            preIcon={isLoading ? <Spinner /> : <FaSignInAlt size={"20px"} />}
            handleClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
