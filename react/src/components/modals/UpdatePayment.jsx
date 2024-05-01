import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import { handlePaymentModeList } from "../../store/paymentSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { Axios } from "axios";
import Spinner from "../loaders/Spinner";
import { FaCircleCheck } from "react-icons/fa6";
import { usePayment } from "../../utilis/usePayment";

function UpdatePayment({ show, onHide, data }) {
  const paymentData = useSelector((state) => state.paymentModeData.data);

  const [isSave, setIsSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mode: data ? data.mode : "",
    modeName: data ? data.modeName : "",
  });
  const [updated, setUpdated] = useState({});
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const getPaymentData = usePayment();
  const globalApiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const updatedData = paymentData.payment.map((item) =>
      item.id === data.id
        ? { ...item, mode: formData.mode, modeName: formData.modeName }
        : item
    );
    setUpdated({ payment: updatedData });

    setIsSave(true);
  };
  const handleSaveApi = async () => {
    let savePayment = null;
    savePayment = getAmazonUrl("payments");
    const isNotExpired = amazonUrlExpiryChecker(savePayment?.expiry);

    if (!isNotExpired) {
      savePayment = await fetchAmazonBucketUrls("payments");
    }

    if (!savePayment) {
      return console.log("url not found");
    }
    const response = await axios.put(savePayment?.url?.put_url, updated);

    if (response?.status == 200) {
      dispatch(handlePaymentModeList(updated));
      toast.success("Data added SuccesFully");
    } else {
      toast.error(response?.error);
    }
    setIsLoading(false);
    setIsSave(false);
    onHide();
  };
  useEffect(() => {
    if (data) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        mode: data.mode || "",
        modeName: data.modeName || "",
      }));
    }
  }, [data]);

  useEffect(() => {
    if (isSave) {
      handleSaveApi();

      // getPaymentData();
    }
  }, [isSave]);
  return (
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
      backdrop="static"
      size="sm"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-600">Update Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <div className="row"> */}
        <div className="d-flex flex-wrap align-items-start justify-content-center gap-2">
          <div className="d-flex gap-2 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="formHeadingText fw-medium ">Offline</div>
              <Form.Check
                className="radioButton"
                type="radio"
                name="mode"
                value="offline"
                checked={formData.mode === "offline"}
                onChange={handleChange}
              />
            </div>
            <div className="fw-medium ps-2">OR</div>
            <div className="d-flex align-items-center gap-2 ps-2">
              <div className="formHeadingText fw-medium">Online</div>
              <Form.Check
                type="radio"
                name="mode"
                value="online"
                checked={formData.mode === "online"}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mb-2 p-1">
          <Form.Control
            className="customInputBoxText"
            placeholder="Enter payment mode"
            type="text"
            name="modeName"
            value={formData.modeName}
            onChange={handleChange}
          />
        </div>

        <CustomButton
          name={"Save"}
          bgColor={themeColor.primary}
          preIcon={isLoading ? <Spinner /> : <FaCircleCheck />}
          handleClick={handleSubmit}
        />
      </Modal.Body>
    </Modal>
  );
}

export default UpdatePayment;
