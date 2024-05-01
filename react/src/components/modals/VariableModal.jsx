import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import Spinner from "../loaders/Spinner";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useTaxList } from "../../utilis/useTaxList";
import axios from "axios";
import toast from "react-hot-toast";
import { useOperationList } from "../../utilis/useOperationList";

function VariableModal({ show, handleToggle, data, modalIndex }) {
  const operationDetails = useSelector((state) => state.operationData.data);

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getOperationList = useOperationList();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    value: "",
  });

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
      id: data?.id,
      name: form.name,
      value: form.value,
    };

    let updatedOperationList = JSON.parse(JSON.stringify(operationDetails));

    if (!updatedOperationList) {
      return;
    }
    updatedOperationList.variables[modalIndex] = newObj;

    let operationUrl = null;
    operationUrl = getAmazonUrl("operations");
    const isNotExpired = amazonUrlExpiryChecker(operationUrl?.expiry);

    if (!isNotExpired) {
      operationUrl = await fetchAmazonBucketUrls("operations");
    }

    const response = await axios.put(
      operationUrl?.url?.put_url,
      updatedOperationList
    );

    if (response?.status === 200) {
      await getOperationList();
      handleToggle();
    } else {
      toast.error("Something wents wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (data) {
      setForm((prev) => ({ ...prev, name: data?.name, value: data?.value }));
    }

    return () => {
      setForm({
        name: "",
        value: "",
      });
    };
  }, [data]);
  return (
    <Modal show={show} onHide={handleToggle}>
      <Modal.Header closeButton>Update tax</Modal.Header>
      <Modal.Body>
        <div>
          <div className="row justify-content-center">
            <div className="col-10">
              <Form.Group className="mb-3">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Tax name
                </Form.Label>
                <Form.Control
                  placeholder="Enter tax name"
                  className="customInputBoxText"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Tax value
                </Form.Label>
                <Form.Control
                  placeholder="Enter tax value"
                  className="customInputBoxText"
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
          <div className="mt-3 row justify-content-center">
            <div className="col-3">
              <CustomButton
                name={"Save"}
                bgColor={themeColor.primary}
                handleClick={handleSubmit}
                preIcon={isLoading && <Spinner />}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default VariableModal;
