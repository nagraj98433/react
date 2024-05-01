import React, { useEffect, useState } from "react";
import { Form, InputGroup, Nav } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { FaSignInAlt } from "react-icons/fa";
import {
  BASE_URL,
  regexPatternForEmail,
  regexPatternForPassword,
  themeColor,
} from "../../utilis/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../loaders/Spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { userInfo } from "../../store/userSlice";
import { handleUserCredentials } from "../../store/userCredentialsSlice";
import CryptoJS from "crypto-js";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { handleActiveItem } from "../../store/activeItemSlice";
import { usePageLanguage } from "../../utilis/usePageLanguage";
import { handleActiveOutlet } from "../../store/activeOutletSlice";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import useIdGenerator from "../../utilis/useIdGenerator";

function LoginForm() {
  const outletDetails = useSelector((state) => state.activeOutletData.data);
  const userDetails = useSelector((state) => state.userData.data);

  const query = new URLSearchParams(window.location.search);
  const myParam = query.get("success");

  const globalApiHandler = useGlobalApiHandler();
  const pageStaticContent = usePageLanguage("login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionChecker = useSessionChecker();

  const [showPassword, setShowPassword] = useState({
    password: false,
  });
  const [isInvalid, setIsInValid] = useState({
    restoId: false,
    email: false,
    password: false,
  });
  const [form, setForm] = useState({
    restoId: "",
    email: "",
    password: "",
    staffUserName: "",
    staffPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState({
    admin: true,
    staff: false,
  });
  const [sessionId, setSessionId] = useIdGenerator();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = () => {
    const adminLoginValidation = {
      email: !regexPatternForEmail.test(form.email),
      password: !regexPatternForPassword.test(form.password),
    };

    const staffLoginValidation = {
      restoId: !form.restoId.length,
      email: !form.staffUserName.length,
      password: !regexPatternForPassword.test(form.staffPassword),
    };

    if (activeTab.admin) {
      setIsInValid((prev) => ({
        ...prev,
        email: adminLoginValidation.email,
        password: adminLoginValidation.password,
      }));
      return Object.values(adminLoginValidation).every((isValid) => !isValid);
    } else {
      setIsInValid((prev) => ({
        ...prev,
        ...staffLoginValidation,
      }));
      return Object.values(staffLoginValidation).every((isValid) => !isValid);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const encryptedPassword = CryptoJS.SHA256(form.password).toString(
      CryptoJS.enc.Hex
    );
    let data = new FormData();

    data.append("username", form.email.toLowerCase());
    data.append("password", encryptedPassword);
    data.append("session_key", sessionId);

    const loginData = {
      method: "post",
      url: BASE_URL + "api/login/",
      data: data,
    };

    const response = await globalApiHandler(loginData);

    if (!response?.success) {
      setIsLoading(false);
      return toast.error(response?.message);
    }

    if (response?.session_active) {
      setIsLoading(false);
      return toast.error(response?.message);
    }

    if (response && response?.status_code !== 400) {
      if (response?.verified === false) {
        handleResendOTP();
        dispatch(userInfo(response?.data));
      } else {
        dispatch(handleActiveOutlet(null));
        dispatch(userInfo(response?.data));
        setIsLoading(false);
        if (response?.data?.profile) {
          navigate("/main/dashboard");
        } else {
          navigate("/registration/newbusiness");
        }
      }
    } else {
      response?.message && toast.error(response?.message);
    }

    setIsLoading(false);
    setSessionId();
  };
  const handleResendOTP = async () => {
    const data = new FormData();

    data.append("username_or_email", form.email);

    const resetOtpData = {
      method: "post",
      url: BASE_URL + "api/resend/confirmation/code/",
      data: data,
    };

    const response = await globalApiHandler(resetOtpData);

    if (response.success) {
      dispatch(
        handleUserCredentials({
          email: form.email,
        })
      );
      setIsLoading(false);
      navigate("/registration/verify");
    }
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    if (frontendValidation) {
      handleLogin();
    }
  };
  const handleSubmitStaff = async () => {
    if (outletDetails?.session_expires_at) {
      const isExpired = sessionChecker(outletDetails?.session_expires_at);
      if (isExpired) {
        dispatch(
          handleActiveItem({
            name: "restaurantName",
            value: outletDetails?.outlets[0]?.outlet_name,
          })
        );
        dispatch(
          handleActiveItem({
            name: "restaurantId",
            value: outletDetails?.outlets[0]?.outlet_id,
          })
        );
        return navigate(`/main/outlet/${outletDetails?.outlets[0]?.outlet_id}`);
      }
    }
    setIsLoading(true);
    const encryptedPassword = CryptoJS.SHA256(form.staffPassword).toString(
      CryptoJS.enc.Hex
    );

    let data = new FormData();
    data.append("password", encryptedPassword);
    data.append("username", form.staffUserName);
    data.append("session_key", sessionId);

    const loginStaffData = {
      method: "post",
      url: BASE_URL + "api/staff/login/",
      data: data,
    };

    const response = await globalApiHandler(loginStaffData);

    if (
      (response && response?.session_active) ||
      response?.data?.session_active ||
      response?.success !== true
    ) {
      setIsLoading(false);
      return toast.error(response?.message);
    }
    dispatch(userInfo(null));
    dispatch(
      handleActiveItem({
        name: "restaurantName",
        value: response?.data?.outlets[0]?.outlet_name,
      })
    );
    dispatch(
      handleActiveItem({
        name: "restaurantId",
        value: response?.data?.outlets[0]?.outlet_id,
      })
    );
    dispatch(handleActiveOutlet(response?.data));
    navigate(`/main/outlet/${response?.data?.outlets[0]?.outlet_id}`);

    setIsLoading(false);
    setSessionId();
  };

  useEffect(() => {
    if (myParam === "true") {
      toast.success("Registration is successful. Please login to continue");
    } else if (myParam === "sessionexpired") {
      toast.error("Session expired. Please login again.");
    }
  }, []);
  return (
    <>
      <Toaster />
      <div className="row g-0 px-4 my-3 animeRightToLeft">
        <div className="col-12 mb-2">
          <div className="registerHeading primary-text">
            <div>{pageStaticContent?.["00014"]}</div>
            <div
              style={{ fontWeight: "500", fontSize: "15px" }}
              className="secondary-text"
            >
              {pageStaticContent?.["00015"]}
            </div>
          </div>
        </div>
        <hr />
        <div className="col-12">
          <Nav className="mb-2" fill variant="tabs">
            <Nav.Item>
              <Nav.Link
                className="primary-text fw-medium formLabelText"
                active={activeTab.admin}
                style={{ color: !activeTab.admin ? themeColor.primary : "" }}
                onClick={() =>
                  setActiveTab((prev) => ({
                    ...prev,
                    admin: true,
                    staff: false,
                  }))
                }
              >
                {pageStaticContent?.["00016"]}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                style={{ color: !activeTab.staff ? themeColor.primary : "" }}
                active={activeTab.staff}
                className="primary-text fw-medium formLabelText"
                onClick={() =>
                  setActiveTab((prev) => ({
                    ...prev,
                    admin: false,
                    staff: true,
                  }))
                }
              >
                {pageStaticContent?.["00017"]}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        {activeTab.staff ? (
          <>
            <div className="col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  {pageStaticContent?.["00030"]}
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  type="email"
                  placeholder={pageStaticContent?.["00031"]}
                  required
                  name="staffUserName"
                  onChange={handleFormChange}
                  value={form.staffUserName}
                  isInvalid={isInvalid.email}
                />
                <Form.Control.Feedback type="invalid" className="formLabelText">
                  Please enter user id.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group className="mb-3">
                <Form.Label className="primary-text fw-medium formLabelText">
                  {pageStaticContent?.["00021"]}
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    className="customInputBoxText"
                    type={showPassword.password ? "text" : "password"}
                    placeholder={pageStaticContent?.["00022"]}
                    required
                    name="staffPassword"
                    onChange={handleFormChange}
                    value={form.staffPassword}
                    isInvalid={isInvalid.password}
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
                  <Form.Control.Feedback
                    type="invalid"
                    className="formLabelText"
                  >
                    {pageStaticContent?.["00023"]}
                  </Form.Control.Feedback>
                </InputGroup>{" "}
              </Form.Group>
            </div>
            <div className="row g-0 px-3 mb-3 justify-content-center">
              <div className="col-12 col-lg-6 mb-2">
                <CustomButton
                  name={pageStaticContent?.["00027"]}
                  bgColor={themeColor.primary}
                  preIcon={
                    isLoading ? <Spinner /> : <FaSignInAlt size={"20px"} />
                  }
                  handleClick={handleSubmitStaff}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  {pageStaticContent?.["00018"]}
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  type="email"
                  placeholder={pageStaticContent?.["00019"]}
                  required
                  isInvalid={isInvalid.email}
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                />
                <Form.Control.Feedback type="invalid" className="formLabelText">
                  {pageStaticContent?.["00020"]}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group className="mb-3">
                <Form.Label className="primary-text fw-medium formLabelText">
                  {pageStaticContent?.["00021"]}
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    className="customInputBoxText"
                    type={showPassword.password ? "text" : "password"}
                    placeholder={pageStaticContent?.["00022"]}
                    required
                    isInvalid={isInvalid.password}
                    name="password"
                    value={form.password}
                    onChange={handleFormChange}
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
                  <Form.Control.Feedback
                    type="invalid"
                    className="formLabelText"
                  >
                    {pageStaticContent?.["00023"]}
                  </Form.Control.Feedback>
                </InputGroup>{" "}
              </Form.Group>
            </div>
            {activeTab.admin && (
              <>
                <div className="col-12 mb-3">
                  <div
                    onClick={() => navigate("/registration/forgetpassword")}
                    className="cursor-pointer primary-text formLabelText"
                  >
                    {pageStaticContent?.["00024"]}
                  </div>
                </div>
                <div className="col-12">
                  <h6 className="cursor-pointer primary-text mb-3 formLabelText">
                    {pageStaticContent?.["00025"]}{" "}
                    <span
                      onClick={() => navigate("/registration/new")}
                      className="cursor-pointer formLabelText"
                      style={{ color: themeColor.primary }}
                    >
                      {pageStaticContent?.["00026"]}
                    </span>
                  </h6>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {activeTab.admin && (
        <div className="row g-0 px-3 mb-3 justify-content-center">
          <div className="col-12 col-lg-6 mb-2">
            <CustomButton
              name={pageStaticContent?.["00027"]}
              bgColor={themeColor.primary}
              preIcon={isLoading ? <Spinner /> : <FaSignInAlt size={"20px"} />}
              handleClick={handleSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;
