import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { Form, ListGroup } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import NotFound from "../notFound/NotFound";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import { handleTaxList } from "../../store/taxSlice";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useDispatch } from "react-redux";
import axios from "axios";
import Spinner from "../loaders/Spinner";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useOfferList } from "../../utilis/useOfferList";
import BillOfferModal from "../modals/BillOfferModal";
import toast from "react-hot-toast";

function OfferOnBillList() {
  const offerDetails = useSelector((state) => state.offerData.data);
  const operationDetails = useSelector((state) => state.operationData.data);

  const getOfferList = useOfferList();
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const [offerOnBillData, setOfferOnBilldata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalDataIndex, setModalDataIndex] = useState(null);

  const toggleModal = () => setShowModal(!showModal);

  const handleDeleteTax = async (index) => {
    let copiedObj = JSON.parse(JSON.stringify(offerDetails));

    if (!copiedObj) {
      return;
    }
    copiedObj?.["offers_bill"]?.splice(index, 1);

    let offerUrl = null;
    offerUrl = getAmazonUrl("offers");
    const isNotExpired = amazonUrlExpiryChecker(offerUrl?.expiry);

    if (!isNotExpired) {
      offerUrl = await fetchAmazonBucketUrls("offers");
    }

    const response = await axios.put(offerUrl?.url?.put_url, copiedObj);

    if (response?.status === 200) {
      dispatch(handleTaxList(copiedObj));
    }
    setIsDelete(null);
  };

  const handleCheck = async (index) => {
    let copiedObj = JSON.parse(JSON.stringify(offerOnBillData));

    if (!copiedObj) {
      return toast.error("Something wents wrong");
    }

    copiedObj["offers_bill"][index].applyToAll =
      !copiedObj["offers_bill"][index].applyToAll;

    setOfferOnBilldata(copiedObj);

    let offerUrl = null;
    offerUrl = getAmazonUrl("offers");
    const isNotExpired = amazonUrlExpiryChecker(offerUrl?.expiry);

    if (!isNotExpired) {
      offerUrl = await fetchAmazonBucketUrls("offers");
    }

    await axios.put(offerUrl?.url?.put_url, copiedObj);
  };

  useEffect(() => {
    getOfferList(setIsLoading);
  }, []);

  useEffect(() => {
    setOfferOnBilldata(JSON.parse(JSON.stringify(offerDetails)));
  }, [offerDetails]);
  return (
    <>
      <CustomTitle heading={"Bill offer list"} />
      {isLoading ? (
        <VerticalListShimmer />
      ) : (
        <div className="animeBottomToTop">
          {offerOnBillData?.["offers_bill"]?.length ? (
            <ListGroup as={"ol"} numbered>
              {offerOnBillData?.["offers_bill"]?.map((exp, index) => (
                <ListGroup.Item
                  key={exp?.id}
                  as={"li"}
                  className="d-flex align-items-center gap-3 justify-content-start"
                >
                  <div className="d-grid">
                    <div
                      style={{ fontSize: "14px" }}
                      className="primary-text fw-medium"
                    >
                      {exp?.name}
                    </div>
                    <div
                      style={{ fontSize: "12px" }}
                      className="secondary-text"
                    >
                      {
                        operationDetails?.expressions?.find(
                          (item) => item.expression_id === exp?.expression
                        )?.expression
                      }
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="d-flex align-items-center gap-2">
                      <Form.Switch
                        style={{ fontSize: "12px" }}
                        checked={exp?.applyToAll}
                        onChange={() => handleCheck(index)}
                      />
                      <MdEdit
                        color={themeColor.primary}
                        onClick={() => {
                          setModalData(exp);
                          setModalDataIndex(index);
                          toggleModal();
                        }}
                      />
                      {isDelete === exp?.id ? (
                        <Spinner />
                      ) : (
                        <MdDelete
                          color={themeColor.primary}
                          onClick={() => {
                            setIsDelete(exp?.id);
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
      <BillOfferModal
        show={showModal}
        handleToggle={toggleModal}
        data={modalData}
        modalIndex={modalDataIndex}
      />
    </>
  );
}

export default OfferOnBillList;
