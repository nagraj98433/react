import React, { useEffect, useState } from "react";
import {
  BASE_URL,
  regexPatternForEmail,
  themeColor,
} from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Form, InputGroup } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import CryptoJS from "crypto-js";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useStaffList } from "../../global_apis/useStaffList";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";
import { useMenuCatalogList } from "../../global_apis/useMenuCatalogList";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { handleUrl } from "../../store/staffSlice";
import { useParams } from "react-router-dom";
import axios from "axios";
import useIdGenerator from "../../utilis/useIdGenerator";

function CreateMember({ staffList }) {
  const userDetails = useSelector((state) => state.userData.data);

  const dispatch = useDispatch();
  const globalApiHandler = useGlobalApiHandler();
  const getStaffList = useStaffList();
  const params = useParams();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const [id, setId] = useIdGenerator();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    email: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = () => {
    const validations = {
      name: !form.name.length,
      email: !regexPatternForEmail.test(form.email),
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleStaffCreation = async () => {
    setIsLoading(true);
    setId();

    const data = {
      user_id: id,
      name: form.name,
      email: form.email?.toLocaleLowerCase(),
      outlet_id: params?.outletId,
      owner_id: userDetails?.owner_id,
      type: "unregistered",
      qr_codes: [],
    };
    const unregisteredUser = {
      ...staffList,
      Users: [...staffList?.Users, data],
    };
    let amazonUrlResult = null;
    amazonUrlResult = getAmazonUrl("users");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

    if (!isNotExpired) {
      amazonUrlResult = await fetchAmazonBucketUrls("users");
    }
    const response = await axios.put(
      amazonUrlResult?.url?.put_url,
      unregisteredUser
    );
    if (response?.status === 200) {
      await getStaffList();
      toast.success(" User Created successfully!");
    } else {
      toast.error(" User Creation failed!");
    }
    setForm(() => ({
      name: "",
      email: "",
    }));
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    let frontendValidation = await handleValidation();
    frontendValidation && handleStaffCreation();
  };

  return (
    <div className="row">
      <div className="col-12">
        <CustomTitle heading={"Create User"} />
        <div className="row">
          <div className="col-12 col-lg-6">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Member Name
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
            <Form.Group className="mb-1">
              <Form.Label className="primary-text fw-medium formLabelText">
                Email
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder="Enter email"
                isInvalid={isInvalid.email}
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter username.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
        <div className="row my-3">
          <div className="col-12 col-lg-2 col-md-4">
            <CustomButton
              name={"Save"}
              bgColor={themeColor.primary}
              handleClick={handleSubmit}
              preIcon={isLoading ? <Spinner /> : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMember;
