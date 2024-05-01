import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import NotFound from "../notFound/NotFound";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useDispatch } from "react-redux";
import axios from "axios";
import Spinner from "../loaders/Spinner";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useOperationList } from "../../utilis/useOperationList";
import { handleOperations } from "../../store/operationSlice";
import ExpressionModal from "../modals/ExpressionModal";

function ExpressionList() {
  const operationDetails = useSelector((state) => state.operationData.data);

  const getOperationList = useOperationList();
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalDataIndex, setModalDataIndex] = useState(null);

  const toggleModal = () => setShowModal(!showModal);

  const handleDeleteTax = async (index) => {
    let copiedObj = JSON.parse(JSON.stringify(operationDetails));

    if (!copiedObj) {
      return;
    }
    copiedObj?.["expressions"]?.splice(index, 1);

    let operationUrl = null;
    operationUrl = getAmazonUrl("variables");
    const isNotExpired = amazonUrlExpiryChecker(operationUrl?.expiry);

    if (!isNotExpired) {
      operationUrl = await fetchAmazonBucketUrls("variables");
    }

    const response = await axios.put(operationUrl?.url?.put_url, copiedObj);

    if (response?.status === 200) {
      dispatch(handleOperations(copiedObj));
    }
    setIsDelete(null);
  };

  useEffect(() => {
    getOperationList(setIsLoading);
  }, []);
  return (
    <>
      <CustomTitle heading={"Expression list"} />
      {isLoading ? (
        <VerticalListShimmer />
      ) : (
        <div className="animeBottomToTop">
          {operationDetails?.["expressions"]?.length ? (
            <ListGroup as={"ol"} numbered>
              {operationDetails?.["expressions"]?.map((exp, index) => (
                <ListGroup.Item
                  key={exp?.expression_id}
                  as={"li"}
                  className="d-flex align-items-center gap-3 justify-content-start"
                >
                  <div className="d-grid">
                    <div
                      style={{ fontSize: "14px" }}
                      className="primary-text fw-medium"
                    >
                      {exp?.expression_name}
                    </div>
                    <div
                      style={{ fontSize: "12px" }}
                      className="secondary-text"
                    >
                      {exp?.expression}
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="d-flex gap-2">
                      <MdEdit
                        color={themeColor.primary}
                        onClick={() => {
                          setModalData(exp);
                          setModalDataIndex(index);
                          toggleModal();
                        }}
                      />
                      {isDelete === exp?.expression_id ? (
                        <Spinner />
                      ) : (
                        <MdDelete
                          color={themeColor.primary}
                          onClick={() => {
                            setIsDelete(exp?.expression_id);
                            handleDeleteTax(index);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <NotFound />
          )}
        </div>
      )}
      <ExpressionModal
        show={showModal}
        handleToggle={toggleModal}
        data={modalData}
        modalIndex={modalDataIndex}
      />
    </>
  );
}

export default ExpressionList;
