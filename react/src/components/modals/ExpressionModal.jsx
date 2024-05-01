import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Form, Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import {
  BASE_URL,
  defaultVariables,
  operators,
  regexAlphabatesChecker,
  themeColor,
} from "../../utilis/constants";
import Spinner from "../loaders/Spinner";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import axios from "axios";
import toast from "react-hot-toast";
import { useOperationList } from "../../utilis/useOperationList";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";

function ExpressionModal({ show, handleToggle, data, modalIndex }) {
  const operationDetails = useSelector((state) => state.operationData.data);

  const expressionRef = useRef(null);
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getOperationList = useOperationList();
  const apiHandler = useGlobalApiHandler();

  const [expressionName, setExpressionName] = useState("");
  const [expression, setExpression] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (val) => {
    expressionRef.current.focus();
    let expressionString = expression + val;
    setExpression(expressionString);
  };

  const checkExpression = async () => {
    const data = {
      expression: expression,
      item_price: 1000,
    };
    const payload = {
      method: "post",
      url: BASE_URL + "/api/tax/expression/verify/",
      data: data,
    };

    const response = await apiHandler(payload);
    return response;
  };

  const handleSubmit = async () => {
    if (!expression.length || !expressionName.length) {
      return toast.error("All fields are mandatory");
    }
    setIsLoading(true);
    const checker = await checkExpression();

    if (!checker?.status) {
      setIsLoading(false);
      return toast.error(checker?.message);
    }

    let newObj = {
      expression_id: data?.expression_id,
      expression_name: expressionName,
      expression: expression,
    };

    let operationUrl = null;
    operationUrl = getAmazonUrl("variables");
    const isNotExpired = amazonUrlExpiryChecker(operationUrl?.expiry);

    if (!isNotExpired) {
      operationUrl = await fetchAmazonBucketUrls("variables");
    }

    if (!operationUrl) return toast.error("Url not found");

    let updatedTaxList = JSON.parse(JSON.stringify(operationDetails));

    if (!updatedTaxList) {
      return;
    }
    updatedTaxList["expressions"][modalIndex] = newObj;

    const response = await axios.put(
      operationUrl?.url?.put_url,
      updatedTaxList
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
      setExpression(data?.expression);
      setExpressionName(data?.expression_name);
    }

    return () => {
      setExpression("");
      setExpressionName("");
    };
  }, [data]);
  return (
    <Modal show={show} onHide={handleToggle}>
      <Modal.Header closeButton>Update tax</Modal.Header>
      <Modal.Body>
        <div className="ps-3">
          <div className="row">
            <div className="col-12">
              <Form.Group className="mb-3">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Expresion name
                </Form.Label>
                <Form.Control
                  placeholder="Enter expression name"
                  className="customInputBoxText"
                  value={expressionName}
                  onChange={(e) => setExpressionName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="w-100 mb-2">
                <Form.Label className="primary-text fw-medium d-flex gap-2 formLabelText">
                  Create expression
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  style={{ height: "150px" }}
                  ref={expressionRef}
                  className="customInputBoxText"
                  placeholder="Select from below variables to create expression"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                />
              </Form.Group>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            {/* Default Variables */}
            <Dropdown drop="up">
              <Dropdown.Toggle
                variant="white"
                className="border rounded"
                style={{ fontSize: "12px" }}
                size="sm"
              >
                Default Variables
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {defaultVariables && defaultVariables?.length
                  ? defaultVariables.map((variable) => (
                      <Dropdown.Item
                        style={{ fontSize: "12px" }}
                        onClick={() => handleClick(variable)}
                        key={variable}
                      >
                        {variable}
                      </Dropdown.Item>
                    ))
                  : ""}
              </Dropdown.Menu>
            </Dropdown>
            {/* Custom Variables */}
            <Dropdown drop="up">
              <Dropdown.Toggle
                variant="white"
                className="border rounded"
                style={{ fontSize: "12px" }}
                size="sm"
              >
                Custom Variables
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {operationDetails?.variables &&
                operationDetails?.variables?.length
                  ? operationDetails?.variables.map((variable) => (
                      <Dropdown.Item
                        style={{ fontSize: "12px" }}
                        onClick={() => handleClick(variable?.name)}
                        key={variable?.id}
                      >
                        {variable?.name}
                      </Dropdown.Item>
                    ))
                  : ""}
              </Dropdown.Menu>
            </Dropdown>
            {/* Operators */}
            <Dropdown drop="end">
              <Dropdown.Toggle
                variant="white"
                className="border rounded"
                style={{ fontSize: "12px" }}
                size="sm"
              >
                Allowed Operators
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {operators && operators?.length
                  ? operators.map((variable) => (
                      <Dropdown.Item
                        style={{ fontSize: "12px" }}
                        onClick={() => handleClick(variable)}
                        key={variable}
                      >
                        {variable}
                      </Dropdown.Item>
                    ))
                  : ""}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="mt-3 row">
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

export default ExpressionModal;
