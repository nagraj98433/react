import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import {
  BASE_URL,
  defaultVariables,
  operators,
  themeColor,
} from "../../utilis/constants";
import toast from "react-hot-toast";
import useIdGenerator from "../../utilis/useIdGenerator";
import axios from "axios";
import CustomTitle from "../heading/CustomTitle";
import { Accordion, Dropdown, Form, Overlay, Tooltip } from "react-bootstrap";
import { MdInfo } from "react-icons/md";
import CustomButton from "../buttons/CustomButton";
import Spinner from "../loaders/Spinner";
import { useOperationList } from "../../utilis/useOperationList";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useParams } from "react-router-dom";

function ExpressionForm() {
  const operationDetails = useSelector((state) => state.operationData.data);
  const userDetails = useSelector((state) => state.userData.data);

  const params = useParams();
  const expressionRef = useRef(null);
  const tooltipTarget = useRef(null);
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getOperationList = useOperationList();
  const apiHandler = useGlobalApiHandler();

  const [expressionName, setExpressionName] = useState("");
  const [expression, setExpression] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [newId, setNewId] = useIdGenerator();
  const [isLoading, setIsLoading] = useState(false);
  const [variableList, setVariableList] = useState(null);
  const [variableKeys, setVariableKeys] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);

  const toggleHelp = () => setShowHelp(!showHelp);

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
      url:
        BASE_URL +
        `api/tax/expression/verify/${userDetails?.owner_id}/${params?.outletId}/`,
      data: data,
    };

    const response = await apiHandler(payload);
    return response;
  };

  const getVariables = async () => {
    let variablesUrl = null;
    variablesUrl = getAmazonUrl("global_index_variables");
    const isNotExpired = amazonUrlExpiryChecker(variablesUrl?.expiry);

    if (!isNotExpired) {
      variablesUrl = await fetchAmazonBucketUrls("global_index_variables");
    }

    if (!variablesUrl) return toast.error("Url not found");

    const payload = {
      method: "get",
      url: variablesUrl?.url?.get_url,
    };
    const response = await apiHandler(payload);
    if (response) {
      setVariableList(response);
      setVariableKeys(Object.keys(response));
    }
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
      expression_id: newId,
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

    const copyObj = JSON.parse(JSON.stringify(operationDetails));

    if (copyObj?.expressions) {
      copyObj["expressions"].push(newObj);
    } else {
      copyObj["expressions"] = [newObj];
    }

    const response = await axios.put(operationUrl?.url?.put_url, copyObj);

    if (response?.status === 200) {
      await getOperationList();
      setExpression("");
      setExpressionName("");
      setNewId();
      setIsLoading(false);
    } else {
      toast.error("Something wents wrong");
    }
  };

  useEffect(() => {
    getVariables();
  }, []);

  return (
    <div>
      <CustomTitle heading={"Create expressions"} />
      <div className="row">
        <div className="col-10">
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              Expression name
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
              <div>Create expression</div>
              <div>
                <div ref={tooltipTarget}>
                  <MdInfo onClick={toggleHelp} color={themeColor.primary} />
                </div>
                <Overlay
                  target={tooltipTarget.current}
                  show={showHelp}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip {...props}>
                      <div style={{ fontSize: "13px" }}>
                        You can create expression like{" "}
                        <span className="fw-medium">(item_price*0.18)/100</span>
                      </div>
                    </Tooltip>
                  )}
                </Overlay>
              </div>
            </Form.Label>
            <Form.Control
              as={"textarea"}
              style={{ height: "120px" }}
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
            {operationDetails?.variables && operationDetails?.variables?.length
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
      <div className="d-flex gap-2 align-items-center">
        {variableKeys.length
          ? variableKeys.map((variableKey) => (
              <div style={{ fontSize: "10px" }} key={variableKey}>
                {variableKey.replaceAll("_", " ")}
              </div>
            ))
          : ""}
      </div>
      <div className="mt-3 row">
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

export default ExpressionForm;
