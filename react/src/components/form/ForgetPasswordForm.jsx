import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "../buttons/CustomButton";
import { FaSignInAlt } from "react-icons/fa";
import { themeColor } from "../../utilis/constants";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { handleUserCredentials } from "../../store/userCredentialsSlice";
import Spinner from "../loaders/Spinner";
import { BASE_URL, regexPatternForEmail } from "../../utilis/constants";

function ForgetPasswordForm() {
  const navigate = useNavigate();
  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();

  const [forgetCredentails, setForgetCredentials] = useState({
    email: "",
  });
  const [isInvalid, setIsInValid] = useState({
    email: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    setForgetCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleValidation = () => {
    const LoginValidation = {
      email: !regexPatternForEmail.test(forgetCredentails.email),
    };

    setIsInValid((prev) => ({
      ...prev,
      ...LoginValidation,
    }));
    return Object.values(LoginValidation).every((isValid) => !isValid);
  };
  const handleLogin = async () => {
    setIsLoading(true);
    let data = new FormData();
    data.append("email", forgetCredentails.email.toLowerCase());
    const forgetData = {
      method: "post",
      url: BASE_URL + "api/forgot/password/",
      data: data,
    };
    const response = await globalApiHandler(forgetData);
    console.log(response);
    if (response.success) {
      dispatch(
        handleUserCredentials({
          email: forgetCredentails.email,
        })
      );
      setIsLoading(false);
      navigate("/registration/forgetpassword/changepassword");
    } else {
      response?.message && toast.error(response?.message);
      setIsLoading(false);
    }
  };
  const handleSave = () => {
    let frontendValidation = handleValidation();
    if (frontendValidation) {
      handleLogin();
    }
  };
  return (
    <>
      <Toaster />
      <div className="row g-0 px-4 mt-3 animeRightToLeft">
        <div className="col-12 mb-2">
          <div className="registerHeading primary-text">
            <div>Enter your registered email</div>
          </div>
        </div>
        <hr />
        <div className="col-12">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Email
            </Form.Label>
            <Form.Control
              className="customInputBoxText"
              type="email"
              placeholder={"Enter email"}
              required
              name="email"
              isInvalid={isInvalid.email}
              value={forgetCredentails.email}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid" className="formLabelText">
              Please enter registered email.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-12 mt-3">
          <h6 className="mb-3 formLabelText">
            Back to{" "}
            <span
              className="cursor-pointer formLabelText"
              style={{ color: themeColor.primary }}
              onClick={() => navigate("/registration/login")}
            >
              Login
            </span>
          </h6>
        </div>
      </div>
      <div className="row g-0 px-3 mb-3 justify-content-center">
        <div className="col-12 col-lg-6 ps-0 ps-lg-2 mb-2">
          <CustomButton
            name={"Save"}
            bgColor={themeColor.primary}
            preIcon={isLoading ? <Spinner /> : <FaSignInAlt size={"20px"} />}
            handleClick={handleSave}
          />
        </div>
      </div>
    </>
  );
}

export default ForgetPasswordForm;
