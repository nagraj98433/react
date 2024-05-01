import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import CustomOffCanvas from "../offCanvas/CustomOffCanvas";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { useEmptyStore } from "../../utilis/useEmptyStore";
import LanguageDropDown from "../dropdowns/LanguageDropDown";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import LogoutModal from "../modals/LogoutModal";
import { useEmptyOutletStore } from "../../utilis/useEmptyOutletStore";

function CustomNavbar() {
  const userDetails = useSelector((state) => state.userData.data);
  const outletDetails = useSelector((state) => state.activeOutletData.data);

  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleOffCanvas = () => setShowOffCanvas(!showOffCanvas);
  const toggleLogoutModal = () => setShowLogoutModal(!showLogoutModal);

  const navigate = useNavigate();
  const location = useLocation();
  const emptyStore = useEmptyStore();
  const emptyOutletStore = useEmptyOutletStore();
  const apiHandler = useGlobalApiHandler();

  const ignorePathsForOutletLogout = [
    "/main/dashboard",
    "/main/outlet/new",
    "/main/userprofile",
  ];

  const handleLogout = async () => {
    if (
      userDetails?.user_type?.toLowerCase() === "owner" &&
      ignorePathsForOutletLogout.includes(location.pathname) === false
    ) {
      return setShowLogoutModal(true);
    }
    if (userDetails?.user_type === "owner") {
      await handleAdminLogout();
      emptyStore();
      emptyOutletStore();
      navigate("/");
    } else {
      await handleStaffLogout();
      emptyStore();
      emptyOutletStore();
      navigate("/");
    }
  };

  const handleAdminLogout = async () => {
    const data = new FormData();

    data.append("sessionid", userDetails?.owner_id);
    data.append("session_key", userDetails?.SessionKey);
    const apiData = {
      method: "post",
      url: BASE_URL + "api/session/logout/",
      data: data,
    };
    await apiHandler(apiData);
    await handleStaffLogout();
  };

  const handleStaffLogout = async () => {
    const data = new FormData();

    data.append("sessionid", outletDetails?.user_id);
    data.append("session_key", outletDetails?.SessionKey);
    const apiData = {
      method: "post",
      url: BASE_URL + "api/session/logout/",
      data: data,
    };
    await apiHandler(apiData);
  };

  const handleOwnerSession = async () => {
    const data = new FormData();

    data.append("sessionid", userDetails?.owner_id);
    data.append("session_key", userDetails?.SessionKey);

    const payload = {
      method: "post",
      url: BASE_URL + "api/check/active/session/",
      data: data,
    };

    const response = await apiHandler(payload);
    if (!response?.success) {
      emptyStore();
      emptyOutletStore();
      return false;
    }
    return true;
  };

  const handleOutletSession = async () => {
    const data = new FormData();

    data.append("sessionid", outletDetails?.user_id);
    data.append("session_key", outletDetails?.SessionKey);

    const payload = {
      method: "post",
      url: BASE_URL + "api/check/active/session/",
      data: data,
    };

    const response = await apiHandler(payload);
    if (!response?.success) {
      emptyStore();
      emptyOutletStore();
      return false;
    }
    return true;
  };

  const ownerSessionHandler = async () => {
    const isSessionActive = await handleOwnerSession();
    if (!isSessionActive) {
      navigate("/registration/login?success=sessionexpired");
    }
  };

  const outletSessionHandler = async () => {
    const isSessionActive = await handleOutletSession();
    if (!isSessionActive) {
      navigate("/registration/login?success=sessionexpired");
    }
  };

  useEffect(() => {
    ownerSessionHandler();
    let sessionTimer = setInterval(() => {
      ownerSessionHandler();
    }, 50000);

    return () => {
      clearInterval(sessionTimer);
    };
  }, []);

  useEffect(() => {
    let sessionTimer;

    if (outletDetails) {
      outletSessionHandler();
      sessionTimer = setInterval(() => {
        outletSessionHandler();
      }, 50000);
    }

    return () => {
      clearInterval(sessionTimer);
    };
  }, [outletDetails]);

  return (
    <>
      <Navbar sticky="top" expand="lg" className="border-bottom bg-white">
        <Container fluid>
          {/* language */}
          <Nav className="ms-auto">
            <LanguageDropDown />
          </Nav>
          {/* profile */}
          <Nav className="mx-4">
            <div className="customDropdown cursor-pointer">
              <div className="dropdown-button">
                <div
                  style={{ color: themeColor.primary, fontSize: "20px" }}
                  className="bi bi-person-circle cursor-pointer"
                ></div>
              </div>
              <div className="dropdown-menuList dropdown-profileList shadow">
                <button onClick={handleLogout}>
                  <div className="d-flex align-items-center gap-2 cursor-pointer">
                    <i className="bi bi-door-closed-fill"></i>
                    <div className="formLabelText">Logout</div>
                  </div>
                </button>
              </div>
            </div>
          </Nav>
          {location.pathname === "/main/dashboard" && (
            <Nav>
              <HiMenuAlt3
                onClick={toggleOffCanvas}
                size={"25px"}
                className="d-block d-lg-none d-xl-none"
              />
            </Nav>
          )}
        </Container>
        {location.pathname === "/main/dashboard" && (
          <CustomOffCanvas
            show={showOffCanvas}
            setShow={setShowOffCanvas}
            handleClose={toggleOffCanvas}
          />
        )}
      </Navbar>
      <LogoutModal show={showLogoutModal} handleToggle={toggleLogoutModal} />
    </>
  );
}

export default CustomNavbar;
