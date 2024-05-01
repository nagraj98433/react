import React from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useNavigate } from "react-router-dom";
import { useEmptyStore } from "../../utilis/useEmptyStore";
import { useEmptyOutletStore } from "../../utilis/useEmptyOutletStore";
import { useOutletLogout } from "../../utilis/useOutletLogout";

function LogoutModal({ show, handleToggle }) {
  const userDetails = useSelector((state) => state.userData.data);
  const outletDetails = useSelector((state) => state.activeOutletData.data);

  const apiHandler = useGlobalApiHandler();
  const emptyStore = useEmptyStore();
  const emptyOutletStore = useEmptyOutletStore();
  const navigate = useNavigate();
  const outletLogout = useOutletLogout();

  const adminLogout = async () => {
    const data = new FormData();

    data.append("sessionid", userDetails?.owner_id);
    data.append("session_key", userDetails?.SessionKey);
    const apiData = {
      method: "post",
      url: BASE_URL + "api/session/logout/",
      data: data,
    };
    await apiHandler(apiData);
  };

  const handleAllSessionLogout = async () => {
    await adminLogout();
    await outletLogout(outletDetails?.user_id, outletDetails?.SessionKey);
    emptyStore();
    emptyOutletStore();
    handleToggle();
    navigate("/");
  };

  const handleOutletLogout = async () => {
    await outletLogout(outletDetails?.user_id, outletDetails?.SessionKey);
    handleToggle();
    navigate("/main/dashboard");
  };

  return (
    <Modal show={show} onHide={handleToggle} backdrop="static">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="text-center fs-5 fw-medium">
          Are you sure you want to logout
        </div>
        <div className="d-flex justify-content-center gap-3 my-2">
          <CustomButton
            name={"Logout All Sessions"}
            bgColor={themeColor.primary}
            handleClick={handleAllSessionLogout}
          />
          <CustomButton
            name={"Logout Restaurant"}
            bgColor={themeColor.primary}
            handleClick={handleOutletLogout}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default LogoutModal;
