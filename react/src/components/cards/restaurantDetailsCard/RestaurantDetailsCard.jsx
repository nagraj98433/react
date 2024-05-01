import React, { useEffect, useState } from "react";
import "./RestaurantDetailsCard.css";
import { json, useNavigate } from "react-router-dom";
import { BASE_URL, themeColor } from "../../../utilis/constants";
import { useDispatch } from "react-redux";
import {
  handleActiveItem,
  handleCurrencyCode,
} from "../../../store/activeItemSlice";
import { useGlobalApiHandler } from "../../../utilis/useGlobalApiHandler";
import { useSelector } from "react-redux";
import { handleAmazonUrls } from "../../../store/amazonBucketUrlSlice";
import { useStaffLogin } from "../../../utilis/useStaffLogin";
import Spinner from "../../loaders/Spinner";
import { handleActiveOutlet } from "../../../store/activeOutletSlice";
import toast from "react-hot-toast";
import { useSessionChecker } from "../../../utilis/useSessionChecker";
import { useOutletLogout } from "../../../utilis/useOutletLogout";
import { MdDelete, MdSettings } from "react-icons/md";
import { useRestaurantListApi } from "../../../global_apis/useRestaurantListApi";
import CustomButton from "../../buttons/CustomButton";
import { Modal } from "react-bootstrap";
import { FaCircleCheck } from "react-icons/fa6";

function RestaurantDetailsCard({ data }) {
  const userDetails = useSelector((state) => state.userData.data);
  const outletDetails = useSelector((state) => state.activeOutletData.data);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiHandler = useGlobalApiHandler();
  const fetchRestaurantList = useRestaurantListApi();
  const administratorLogin = useStaffLogin();
  const sessionChecker = useSessionChecker();
  const outletLogout = useOutletLogout();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setisDeleteLoading] = useState(false);

  const getFeatures = async () => {
    const apiData = {
      method: "get",
      url:
        BASE_URL +
        "api/outlets/" +
        userDetails?.owner_id +
        "/" +
        data?.outlet_id +
        "/",
    };

    const response = await apiHandler(apiData);
    if (!response?.success) return false;

    for (let i = 0; i < response?.data.length; i++) {
      let newObj = {
        name: response?.data[i]?.name,
        url: response?.data[i]?.url,
        expiry: response?.data[i]?.expiration_time,
      };

      dispatch(handleAmazonUrls(newObj));
    }
  };

  const handleClick = async () => {
    if (outletDetails?.outlets[0]?.outlet_id === data?.outlet_id) {
      const isExpired = sessionChecker(outletDetails?.session_expires_at);
      if (isExpired) {
        return navigate(`/main/outlet/${outletDetails?.outlets[0]?.outlet_id}`);
      }
    } else if (outletDetails) {
      await outletLogout(outletDetails?.user_id);
    }
    setIsLoading(true);
    const credentails = {
      username: data?.Manager?.username,
      password: data?.Manager?.password,
    };

    const response = await administratorLogin(credentails);

    if (!response?.success) {
      setIsLoading(false);
      return toast.error(response?.message);
    }

    if (response?.session_active === true) {
      setIsLoading(false);
      return toast.error(response?.message);
    }
    await getFeatures();
    dispatch(
      handleActiveItem({
        name: "restaurantName",
        value: data?.outlet_name,
      })
    );
    dispatch(
      handleActiveItem({
        name: "restaurantId",
        value: data?.outlet_id,
      })
    );
    dispatch(handleCurrencyCode(data?.currency));
    dispatch(handleActiveOutlet(response?.data));
    setIsLoading(false);
    navigate(`/main/outlet/${data?.outlet_id}`);
  };
  const handleDelete = async (deleteType) => {
    const apiData = {
      owner_id: data?.owner_id,
      outlet_id: data?.outlet_id,
      manager_name: data?.manager_name,
    };
    let payload = null;
    if (deleteType === "bkup") {
      payload = {
        method: "post",
        url: BASE_URL + "api/delete/outlet/",
        data: apiData,
      };
      setisDeleteLoading(deleteType);
    } else {
      payload = {
        method: "delete",
        url:
          BASE_URL +
          `api/permanent/delete/${data?.owner_id}/${data?.outlet_id}/${data?.manager_name}/`,
      };
      setisDeleteLoading(deleteType);
    }
    const response = await apiHandler(payload);

    setisDeleteLoading(false);
    setShowModal(false);
    if (!response?.success) {
      return toast.error(response?.message);
    }
    if (response?.success) {
      fetchRestaurantList();
      toast.success(response?.message);
    }
  };
  return (
    <>
      <div className="col-12 px-2 mt-2">
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
        >
          <Modal.Header closeButton>
            <div className="text-danger">
              <Modal.Title>Confirmation</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete?</Modal.Body>
          <Modal.Footer className="d-flex justify-content-end">
            <CustomButton
              name={"Backup and Delete"}
              bgColor={themeColor.primary}
              handleClick={() => handleDelete("bkup")}
              preIcon={
                isDeleteLoading === "bkup" ? <Spinner /> : <FaCircleCheck />
              }
            />
            <CustomButton
              name={"Delete"}
              bgColor={themeColor.primary}
              handleClick={() => handleDelete("delete")}
              preIcon={
                isDeleteLoading === "delete" ? <Spinner /> : <FaCircleCheck />
              }
            />
          </Modal.Footer>
        </Modal>
        <div
          style={{ backgroundColor: themeColor.accent }}
          className="restaurantCard rounded-1 cursor-pointer"
        >
          <div
            className="position-absolute top-0 end-0 pe-4"
            onClick={handleClick}
          >
            <MdSettings />
          </div>
          <div
            className="position-absolute top-0 end-0 pe-1"
            onClick={() => setShowModal(true)}
          >
            <MdDelete />
          </div>
          <div
            className="fw-medium px-3 py-2 outletName"
            style={{ fontSize: "14px" }}
            onClick={handleClick}
          >
            {data?.outlet_name}{" "}
            {isLoading && (
              <span>
                <Spinner />
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px" }} className="fw-medium px-3">
            Manager Credentials
          </div>
          <div style={{ fontSize: "12px" }} className="ps-3">
            User Id : <span>{data?.Manager?.username}</span>
          </div>
          <div style={{ fontSize: "12px" }} className="pb-2 ps-3">
            Password : <span>{data?.Manager?.password}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default RestaurantDetailsCard;
