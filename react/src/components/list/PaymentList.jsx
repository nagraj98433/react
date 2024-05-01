import React, { useEffect, useState } from "react";
import CustomTitle from "../heading/CustomTitle";
import { ListGroup } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handlePaymentModeList } from "../../store/paymentSlice";
import { useSelector } from "react-redux";
import { usePayment } from "../../utilis/usePayment";
import toast from "react-hot-toast";
import UpdatePayment from "../modals/UpdatePayment";
import Spinner from "../loaders/Spinner";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";

function PaymentList() {
  const paymentData = useSelector((state) => state.paymentModeData.data);

  const getPaymentData = usePayment();
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();

  const globalApiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();

  const [form, setForm] = useState({
    payment: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(null);
  const [deletingItemIndex, setDeletingItemIndex] = useState(null);
  const handleDelete = async (index) => {
    setDeletingItemIndex(index);

    const updatedForm = {
      ...form,
      payment: form.payment.filter((_, i) => i !== index),
    };

    setForm(updatedForm);

    let savePayment = null;
    savePayment = getAmazonUrl("payments");
    const isNotExpired = amazonUrlExpiryChecker(savePayment?.expiry);

    if (!isNotExpired) {
      savePayment = await fetchAmazonBucketUrls("payments");
    }
    if (!savePayment) {
      return toast.error("url not found");
    }
    const response = await axios.put(savePayment?.url?.put_url, updatedForm);

    if (response?.status == 200) {
      dispatch(handlePaymentModeList(form));
      getPaymentData();
      toast.success("Data deleted succesfully");
    }
    setDeletingItemIndex(null);
  };
  const handleEdit = (index) => {
    setSelectedPaymentIndex(index);
    setShowModal(true);
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      payment: paymentData?.payment || [],
    }));
  }, [paymentData]);

  useEffect(() => {
    getPaymentData();
  }, []);
  if (!paymentData) {
    return <VerticalListShimmer />;
  }

  return (
    <>
      <CustomTitle heading={"Payment mode list"} />
      <UpdatePayment
        show={showModal}
        onHide={() => setShowModal(false)}
        data={
          paymentData?.payment ? paymentData?.payment[selectedPaymentIndex] : {}
        }
      />
      <div className="d-flex animeBottomToTop">
        <ListGroup as={"ol"} numbered>
          {paymentData?.payment?.length ? (
            paymentData &&
            paymentData?.payment?.map((data, index) => (
              <ListGroup.Item
                as={"li"}
                className="d-flex align-items-center gap-3 listNameText"
                key={index}
              >
                <div className="d-grid">
                  <div
                    style={{ fontSize: "14px" }}
                    className="primary-text fw-medium"
                  >
                    {data?.modeName}
                  </div>
                  <div style={{ fontSize: "12px" }} className="secondary-text">
                    {data?.mode}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 ms-auto">
                  <MdEdit
                    color={themeColor.primary}
                    size={"20px"}
                    onClick={() => handleEdit(index)}
                  />
                  {deletingItemIndex === index ? (
                    <Spinner />
                  ) : (
                    <MdDelete
                      color={themeColor.primary}
                      size={"20px"}
                      onClick={() => handleDelete(index)}
                    />
                  )}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <div className="text-danger mt-4 ps-3">List Not Found</div>
          )}
        </ListGroup>
      </div>
    </>
  );
}

export default PaymentList;
