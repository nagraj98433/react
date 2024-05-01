import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { handlePaymentModeList } from "../../store/paymentSlice";
import toast from "react-hot-toast";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import axios from "axios";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { FaCircle, FaCircleCheck } from "react-icons/fa6";
import { usePayment } from "../../utilis/usePayment";
import useIdGenerator from "../../utilis/useIdGenerator";
import Spinner from "../loaders/Spinner";

function PaymentForm() {
  const paymentData = useSelector((state) => state.paymentModeData.data);

  const [form, setForm] = useState({
    payment: [],
  });
  const [mode, setMode] = useState("offline");
  const [modeName, setModeName] = useState("");
  const [isSave, setIsSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generateId, setGenerateId] = useIdGenerator();
  const [showNameError, setShowNameError] = useState(false);
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();

  const globalApiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getPaymentData = usePayment();
  const handleSave = () => {
    if (!mode || !modeName) {
      setShowNameError(true);
      return;
    }
    setGenerateId();
    setIsLoading(true);
    const newField = {
      mode: mode,
      modeName: modeName,
      id: generateId,
    };

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        payment: [...prev.payment, newField],
      };

      return updatedForm;
    });
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
    const response = await axios.put(savePayment?.url?.put_url, form);

    if (response?.status == 200) {
      dispatch(handlePaymentModeList(form));

      toast.success("Data added SuccesFully");
    } else {
      toast.error(response?.error);
    }

    setMode("");
    setModeName("");
    setIsSave(false);
    setIsLoading(false);
  };
  useEffect(() => {
    isSave && handleSaveApi();
  }, [isSave]);
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      payment: paymentData?.payment || [],
    }));
  }, [paymentData]);
  return (
    <div className="row">
      <div className="col-12 d-flex flex-wrap align-items-start justify-content-start gap-2">
        <CustomTitle heading={" Create payment mode"} />
        <div className="d-flex gap-2 align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="formHeadingText fw-medium">Offline</div>
            <Form.Check
              type="radio"
              name="paymentMode"
              defaultChecked
              onClick={() => {
                setMode("offline");
              }}
            />
          </div>
          <div className="fw-medium">or</div>
          <div className="d-flex align-items-center gap-2">
            <div className="formHeadingText fw-medium">Online</div>
            <Form.Check
              type="radio"
              name="paymentMode"
              onClick={() => {
                setMode("online");
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-8 col-lg-6 col-md-8 col-xl-6 mb-2 p-1">
        <Form.Control
          className="customInputBoxText"
          placeholder="Enter payment mode"
          type="text"
          value={modeName}
          onChange={(e) => {
            setModeName(e.target.value);
            setShowNameError(false);
          }}
          isInvalid={showNameError}
        />
        <Form.Control.Feedback type="invalid">
          Please enter payment mode name
        </Form.Control.Feedback>
      </div>
      <div className="col-12 p-1 mb-4">
        <div className="row">
          <div className="col-4 col-lg-2  col-md-2 col-xl-2">
            <CustomButton
              name={"Save"}
              bgColor={themeColor.primary}
              preIcon={isLoading ? <Spinner /> : <FaCircleCheck />}
              handleClick={() => {
                handleSave();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;
