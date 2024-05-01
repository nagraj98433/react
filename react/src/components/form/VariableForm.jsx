import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useOperationList } from "../../utilis/useOperationList";
import { themeColor } from "../../utilis/constants";
import toast from "react-hot-toast";
import useIdGenerator from "../../utilis/useIdGenerator";
import axios from "axios";
import CustomTitle from "../heading/CustomTitle";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import Spinner from "../loaders/Spinner";

function VariableForm() {
  const operationDetails = useSelector((state) => state.operationData.data);

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getOperationList = useOperationList();

  const [form, setForm] = useState({
    name: "",
    value: "",
  });
  const [newId, setNewId] = useIdGenerator();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.length || !form.value.length) {
      return toast.error("All fields are mandatory");
    }

    setIsLoading(true);

    let newObj = {
      id: newId,
      name: form.name,
      value: form.value,
    };

    let operationUrl = null;
    operationUrl = getAmazonUrl("variables");
    const isNotExpired = amazonUrlExpiryChecker(operationUrl?.expiry);

    if (!isNotExpired) {
      operationUrl = await fetchAmazonBucketUrls("variables");
    }

    if (!operationUrl) return toast.error("Url not found");

    const copyObj = JSON.parse(JSON.stringify(operationDetails));

    if (copyObj?.variables) {
      copyObj["variables"].push(newObj);
    } else {
      copyObj["variables"] = [newObj];
    }

    const response = await axios.put(operationUrl?.url?.put_url, copyObj);

    if (response?.status === 200) {
      await getOperationList();
      setForm({
        name: "",
        value: "",
      });
      setNewId();
    } else {
      toast.error("Something wents wrong");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <CustomTitle heading={"Create variables"} />
      <div className="row">
        <div className="col-8">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              Variable name
            </Form.Label>
            <Form.Control
              placeholder="Enter tax name"
              className="customInputBoxText"
              value={form.name}
              onChange={handleChange}
              name="name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              Variable Value
            </Form.Label>
            <Form.Control
              placeholder="Enter tax name"
              className="customInputBoxText"
              type="number"
              onWheel={(e) => e.target.blur()}
              value={form.value}
              onChange={handleChange}
              name="value"
            />
          </Form.Group>
        </div>
      </div>
      <div className="mt-2 row">
        <div className="col-2">
          <CustomButton
            name={"Save"}
            bgColor={themeColor.primary}
            handleClick={handleSubmit}
            preIcon={isLoading && <Spinner />}
          />
        </div>
      </div>
    </div>
  );
}

export default VariableForm;
