import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { themeColor } from "../../utilis/constants";
import Spinner from "../loaders/Spinner";
import { useSelector } from "react-redux";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { useOfferList } from "../../utilis/useOfferList";

function BillOfferModal({ show, handleToggle, data, modalIndex }) {
  const offerDetails = useSelector((state) => state.offerData.data);
  const operationDetails = useSelector((state) => state.operationData.data);

  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getOfferList = useOfferList();

  const [applyToAll, setApplyToAll] = useState(true);
  const [expressionName, setExpressionName] = useState("");
  const [expression, setExpression] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [expressionList, setExpressionList] = useState([]);

  const handleExpressionList = () => {
    if (!operationDetails?.expressions?.length) {
      return;
    }

    let tempArray = [];
    for (let i = 0; i < operationDetails?.expressions.length; i++) {
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
      id: data?.id,
      name: expressionName,
      expression: expression?.value,
      applyToAll: applyToAll,
    };

    let taxUrl = null;
    taxUrl = getAmazonUrl("offers");
    const isNotExpired = amazonUrlExpiryChecker(taxUrl?.expiry);

    if (!isNotExpired) {
      taxUrl = await fetchAmazonBucketUrls("offers");
    }

    if (!taxUrl) return toast.error("Url not found");

    let updatedTaxList = JSON.parse(JSON.stringify(offerDetails));

    if (!updatedTaxList) {
      return;
    }
    updatedTaxList["offers_bill"][modalIndex] = newObj;

    const response = await axios.put(taxUrl?.url?.put_url, updatedTaxList);

    if (response?.status === 200) {
      await getOfferList();
      handleToggle();
    } else {
      toast.error("Something wents wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (data) {
      setExpression({
        value: data?.expression,
        label: operationDetails?.expressions?.find(
          (item) => item.expression_id === data?.expression
        )?.expression_name,
      });
      setExpressionName(data?.name);
      setApplyToAll(data?.applyToAll);
    }

    return () => {
      setExpression({});
      setExpressionName("");
      setApplyToAll(true);
    };
  }, [data]);

  useEffect(() => {
    handleExpressionList();
  }, [operationDetails]);

  return (
    <Modal show={show} onHide={handleToggle}>
      <Modal.Header closeButton>Update tax</Modal.Header>
      <Modal.Body>
        <div className="px-3">
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
              <Form.Group className="mb-3">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Select expression
                </Form.Label>
                <Select
                  value={expression.hasOwnProperty("value") ? expression : ""}
                  onChange={(e) => setExpression(e)}
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

export default BillOfferModal;
