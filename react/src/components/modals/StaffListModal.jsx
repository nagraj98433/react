import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import { InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";
import { useStaffList } from "../../global_apis/useStaffList";
import axios from "axios";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { handleUrl } from "../../store/staffSlice";
import { useDispatch } from "react-redux";
import Spinner from "../loaders/Spinner";

function StaffListModal({
  show,
  handleToggle,
  staffDetail,
  staffList,
  updatePresignedUrl,
}) {
  const dispatch = useDispatch();

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getStaffList = useStaffList();
  const globalApiHandler = useGlobalApiHandler();

  const [form, setForm] = useState({
    name: "",
    password: "",
    username: "",
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    password: false,
    username: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleValidation = () => {
    const validations = {
      name: !form.name.length,
      username: !form.username.length,
      password: form.password.length < 4 || form.password.length > 18,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };
  const handleStaffUpdate = async () => {
    setIsLoading(true);
    const encryptedPassword = CryptoJS.SHA256(form.password).toString(
      CryptoJS.enc.Hex
    );
    const data = {
      username: form.username,
      new_password: encryptedPassword,
    };

    const apiData = {
      method: "put",
      url: BASE_URL + "api/update/staff/password/",
      data: data,
    };

    const response = await globalApiHandler(apiData);
    if (response?.success) {
      const staffArray = staffList?.Users || [];
      const index = staffArray.findIndex(
        (staff) => staff.username === form.username
      );

      if (index !== -1) {
        const updatedStaffList = [...staffList?.Users];
        updatedStaffList[index] = {
          ...updatedStaffList[index],
          name: form.name,
          password: form.password,
        };

        const updatedList = { ...staffList, Users: updatedStaffList };
        if (updatedList) {
          const amazonUrlResult = await getAmazonUrl("users");
          const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

          if (!isNotExpired) {
            const requiredUrl = await fetchAmazonBucketUrls("users");
            dispatch(handleUrl(requiredUrl?.put_url));
            const updateDataurl = await axios.put(
              requiredUrl?.put_url,
              updatedList
            );
            if (updateDataurl?.status === 200) {
              await getStaffList();
              toast.success("User Updated successfully!");
            } else {
              toast.error("User Updation failed!");
            }
          } else {
            const amazonUrlResult = await getAmazonUrl("users")?.url?.put_url;
            dispatch(handleUrl(amazonUrlResult));
            const updateDataurl = await axios.put(amazonUrlResult, updatedList);
            if (updateDataurl?.status === 200) {
              await getStaffList();
              toast.success("User Updated successfully!");
            } else {
              toast.error("User Updation failed!");
            }
          }
        }
      }
      setForm((prev) => ({
        ...prev,
        name: "",
        password: "",
        username: "",
      }));
    } else if (
      !response?.success &&
      response?.message ===
        "User creation failed. Please check your input and try again."
    ) {
      toast.error(response?.message);
    } else {
      toast.error(response?.message);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    let frontendValidation = await handleValidation();
    if (frontendValidation) {
      await handleStaffUpdate();
      handleToggle();
    }
  };

  useEffect(() => {
    if (staffDetail) {
      setForm({
        name: staffDetail.name,
        username: staffDetail.username,
        password: staffDetail.password,
      });
    }
  }, [staffDetail, updatePresignedUrl]);

  return (
    <Modal show={show} onHide={handleToggle} keyboard={false}>
      <Modal.Body>
        <div className="row justify-content-start">
          <div className="col-12 d-flex align-items-start">
            <CustomTitle heading={"Update Staff"} />
            <div className="ms-auto">
              <CustomButton
                name={"Update"}
                bgColor={themeColor.primary}
                handleClick={handleSubmit}
                preIcon={isLoading ? <Spinner /> : ""}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Name
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder="Enter name"
                required
                isInvalid={isInvalid.name}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter name.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-12 col-lg-6">
            <Form.Group>
              <Form.Label className="primary-text fw-medium formLabelText">
                Username
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder="Enter username"
                isInvalid={isInvalid.username}
                name="username"
                disabled
                value={form.username}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter username.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-12 col-lg-6">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Password
              </Form.Label>
              <InputGroup>
                <Form.Control
                  className="customInputBoxText"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  isInvalid={isInvalid.password}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FaEyeSlash style={{ color: themeColor.primary }} />
                  ) : (
                    <FaEye style={{ color: themeColor.primary }} />
                  )}
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid" className="formLabelText">
                  Please enter password between 4 to 18 characters.
                </Form.Control.Feedback>
              </InputGroup>{" "}
            </Form.Group>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default StaffListModal;
