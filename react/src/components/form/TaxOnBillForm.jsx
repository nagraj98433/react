import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useTaxList } from "../../utilis/useTaxList";
import { themeColor } from "../../utilis/constants";
import toast from "react-hot-toast";
import useIdGenerator from "../../utilis/useIdGenerator";
import axios from "axios";
import CustomTitle from "../heading/CustomTitle";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import Spinner from "../loaders/Spinner";
import Select from "react-select";
import { useOperationList } from "../../utilis/useOperationList";

function TaxOnBillForm() {
  const taxDetails = useSelector((state) => state.taxData.data);
  const operationDetails = useSelector((state) => state.operationData.data);

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getTaxList = useTaxList();
  const getOperationList = useOperationList();

  const [expressionName, setExpressionName] = useState("");
  const [applyToAll, setApplyToAll] = useState(true);
  const [expression, setExpression] = useState({});
  const [expressionList, setExpressionList] = useState([]);
  const [newId, setNewId] = useIdGenerator();
  const [isLoading, setIsLoading] = useState(false);

  const handleExpressionList = () => {
    if (!operationDetails?.expressions?.length) {
      return;
    }

    let tempArray = [];
    for (let i = 0; i < operationDetails?.expressions?.length; i++) {
      let newObj = {
        label: operationDetails?.expressions[i]?.expression_name,
        value: operationDetails?.expressions[i]?.expression_id,
      };
      tempArray.push(newObj);
    }
    setExpressionList(tempArray);
  };

  const handleSubmit = async () => {
    if (!expressionName.length || !expression.hasOwnProperty("value")) {
      return toast.error("All fields are mandatory");
    }

    setIsLoading(true);

    let newObj = {
      id: newId,
      name: expressionName,
      expression: expression?.value,
      applyToAll: applyToAll,
    };

    let taxUrl = null;
    taxUrl = getAmazonUrl("tax&charges");
    const isNotExpired = amazonUrlExpiryChecker(taxUrl?.expiry);

    if (!isNotExpired) {
      taxUrl = await fetchAmazonBucketUrls("tax&charges");
    }

    if (!taxUrl) return toast.error("Url not found");

    const copyObj = JSON.parse(JSON.stringify(taxDetails));

    if (copyObj?.["tax&charges_bill"]) {
      copyObj?.["tax&charges_bill"]?.push(newObj);
    } else {
      copyObj["tax&charges_bill"] = [newObj];
    }

    const response = await axios.put(taxUrl?.url?.put_url, copyObj);

    if (response?.status === 200) {
      await getTaxList();
      setExpression({});
      setExpressionName("");
      setNewId();
    } else {
      toast.error("Something wents wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getOperationList();
  }, []);

  useEffect(() => {
    handleExpressionList();
  }, [operationDetails]);

  return (
    <div>
      <CustomTitle heading={"Create tax and other charges"} />
      <div className="row">
        <div className="col-8">
          <Form.Group className="mb-2">
            <Form.Label className="primary-text fw-medium formLabelText">
              Tax name
            </Form.Label>
            <Form.Control
              placeholder="Enter tax name"
              className="customInputBoxText"
              value={expressionName}
              onChange={(e) => setExpressionName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="primary-text fw-medium formLabelText">
              Select expression
            </Form.Label>
            <Select
              value={expression.hasOwnProperty("value") ? expression : ""}
              onChange={(e) => {
                setExpression(e);
              }}
              options={expressionList}
              className="customInputBoxText"
            />
          </Form.Group>
          <div className="d-flex gap-3 primary-text fw-medium formLabelText">
            <div>Apply to all</div>
            <Form.Switch
              checked={applyToAll}
              onChange={() => setApplyToAll(!applyToAll)}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 row">
        <div className="col-2">
          <CustomButton
            name={"Save"}
            bgColor={themeColor.primary}
            handleClick={handleSubmit}
            preIcon={isLoading && <Spinner />}
            isDisable={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default TaxOnBillForm;
