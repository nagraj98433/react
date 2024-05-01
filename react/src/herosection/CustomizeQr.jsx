import React, { useEffect } from "react";
import CustomTitle from "../components/heading/CustomTitle";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomizeQrForm from "../components/form/CustomizeQrForm";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomHeading from "../components/heading/CustomHeading";
import * as html2canvas from "html2canvas";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import ImageDisplay from "../components/imageDisplay/ImageDisplay";
import { useSelector } from "react-redux";
import { BASE_URL, themeColor } from "../utilis/constants";
import CustomButton from "../components/buttons/CustomButton";
import toast from "react-hot-toast";
import useIdGenerator from "../utilis/useIdGenerator";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useFetchTheme } from "../utilis/useFetchTheme";
import Spinner from "../components/loaders/Spinner";

const CustomizeQr = () => {
  const themeData = useSelector((state) => state.qrThemeData?.themeData);
  const qrThemes = useSelector((state) => state.qrThemeData?.qrList);

  const globalApiHandler = useGlobalApiHandler();
  const breadcrumb = useBreadcrumbData();
  const handleImgPopulate = ImageDisplay();
  const params = useParams();
  const fetchTheme = useFetchTheme();

  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();
  const [id, setId] = useIdGenerator();

  const [isLoading, setIsLoading] = useState(false);

  const [isInvalid, setIsInvalid] = useState({
    themeName: false,
  });
  const [showLogo, setShowLogo] = useState(false);

  const toggleLogoDisplay = () => {
    setShowLogo(!showLogo);
  };
  const handleValidation = async () => {
    const validations = {
      themeName: !qr.themeName.length,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const [qr, setQr] = useState(
    themeData?.qrImageData || {
      themeName: "",
      headerText: "",
      headerImg: "",
      headerTxtClr: "#DAB9B9",
      headerBgClr: "",
      footerBgClr: "",
      footerTxtClr: "#DAB9B9",
      footerImg: "",
      footerText: "",
      offer: "",
      headerFontStyle: "normal",
      headerFontFamily: "Poppins",
      headerFontAlign: "right",
      footerFontStyle: "normal",
      footerFontFamily: "Poppins",
      footerFontAlign: "right",
      headerFs: 14,
      footerFs: 14,
      qrBgClr: "",
      qrCodeSize: "250",
      headerLogoAlign: "5%",
      footerLogoAlign: "5%",
      isQrFullImgActive: false,
      logoPosition: "top",
      logoAlign: "5%",
      logoSize: "30%",
    }
  );

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value=""
      size={qr.qrCodeSize}
      // bgColor={"transparent"}
      includeMargin={true}
      level={"H"}
    />
  );
  const setFullImgInActive = async () => {
    return setQr((prev) => ({
      ...prev,
      isQrFullImgActive: false,
    }));
  };
  const handleQrDesign = (e) => {
    setFullImgInActive();
    setQr({ ...qr, [e.target.name]: e.target.value });
  };

  const handleHeaderLogo = (e) => {
    setFullImgInActive();
    handleImgPopulate(e, "headerLogo");
  };
  const handleLogo = (e) => {
    setFullImgInActive();
    handleImgPopulate(e, "headerLogo");
    handleImgPopulate(e, "footerLogo");
  };
  const qrFullImg = (e) => {
    setQr((prev) => ({
      ...prev,
      isQrFullImgActive: true,
    }));
    handleImgPopulate(e, "qrFullImg");
  };

  const keyEnter = (e) => {
    if (e.target.name === "headerText" && e.which === 13) {
      document.querySelector(".headerText").innerHTML = e.target.value;
    } else if (e.target.name === "footerText" && e.which === 13) {
      document.querySelector(".footerTextContent").innerHTML = e.target.value;
    }
  };
  const GenerateQR = async () => {
    setIsLoading(true);
    setId();
    let frontendValidation = await handleValidation();
    if (frontendValidation) {
      let preview = document.querySelector(".customizeQrPreview");
      await html2canvas(preview, { allowTaint: true }).then(async function (
        canvas
      ) {
        const imageData = canvas.toDataURL();

        if (
          themeData &&
          qrThemes?.qrTheme?.some((theme) => theme.name === themeData.name)
        ) {
          const data = new FormData();

          data.append("base64_string", imageData);
          data.append("outlet_id", params?.outletId);
          data.append("template_id", themeData.id);

          const apiData = {
            method: "post",
            url: BASE_URL + "api/outlets/qr/create/",
            data: data,
          };
          const response = await globalApiHandler(apiData);
          if (response?.status) {
            let qrList = null;
            let updatedQrThemes = qrThemes?.qrTheme?.map((theme) => {
              if (theme.name === themeData.name) {
                return {
                  ...theme,
                  name: qr.themeName,
                  imageUrl: response?.data,
                  qrImageData: qr,
                };
              } else {
                return theme;
              }
            });
            qrList = { ...qrThemes, qrTheme: updatedQrThemes };
            await fetchTheme(qrThemes);
            setIsLoading(false);
            navigate(-1);
          } else {
            toast.error(response?.message);
          }
        } else {
          let themeId = id;
          const data = new FormData();

          data.append("base64_string", imageData);
          data.append("outlet_id", params?.outletId);
          data.append("template_id", themeId);

          const apiData = {
            method: "post",
            url: BASE_URL + "api/outlets/qr/create/",
            data: data,
          };
          const response = await globalApiHandler(apiData);
          if (response?.status) {
            const data = {
              id: themeId,
              name: qr.themeName,
              imageUrl: response?.data,
              qrImageData: qr,
            };
            let updatedQrThemes = {
              ...qrThemes,
              qrTheme: Array.isArray(qrThemes?.qrTheme)
                ? [...qrThemes?.qrTheme, data]
                : [data],
            };

            await fetchTheme(updatedQrThemes);
            setIsLoading(false);
            navigate(-1);
          } else {
            toast.error(response?.message);
          }
        }
      });
    } else {
      setIsLoading(false);
      toast.error("Enter Theme Name!");
    }
  };

  useEffect(() => {
    if (themeData) {
      setQr(themeData?.qrImageData);
    }
    breadcrumb("customqr");
  }, [themeData, qr.logoPosition]);

  return (
    <>
      <div className="overflow-auto h-100 customscrollbar pb-5">
        <CustomBreadCrumb />
        <CustomHeading heading={"Customize QR"} />
        <div className="container">
          <div className="row g-0 mb-2 pb-5">
            <CustomizeQrForm
              GenerateQR={GenerateQR}
              value={[handleHeaderLogo, handleLogo, qrFullImg]}
              isInvalid={isInvalid.themeName}
              qr={qr}
              handleQrDesign={handleQrDesign}
              keyEnter={keyEnter}
              toggleLogoDisplay={toggleLogoDisplay}
              showLogo={showLogo}
            />
            <div className="col-12 col-lg-5 col-md-5 ps-3 ">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <CustomTitle heading={"Customize QR Preview"} />
                <CustomButton
                  name={"Generate Qr"}
                  handleClick={GenerateQR}
                  bgColor={themeColor.primary}
                  preIcon={isLoading && <Spinner />}
                />
              </div>
              <div className="col-12 pt-3 w-100">
                <div
                  className="customizeQrPreview"
                  style={{
                    width: "85%",
                    margin: "auto",
                    position: "relative",
                  }}
                >
                  <img
                    id="qrFullImg"
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "cover",
                      objectPosition: "100%",
                      position: "absolute",
                      top: 0,
                      zIndex: qr.isQrFullImgActive ? 12 : 1,
                    }}
                  />
                  <div
                    className=" headerContent "
                    style={{
                      position: "relative",
                      textAlign: qr.headerFontAlign,
                      background: qr.qrBgClr,
                      zIndex: 12,
                      height: "150px",
                    }}
                  >
                    <div
                      className="headerClr"
                      style={{
                        background: qr.headerBgClr,
                        height: "100%",
                      }}
                    >
                      <div
                        className="headerText fw-bolder  w-75"
                        style={{
                          zIndex: 1000,
                          fontSize: qr.headerFs + "px",
                          color: qr.headerTxtClr,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                          whiteSpace: "pre-line",
                          fontFamily: qr.headerFontFamily,
                          fontStyle: qr.headerFontStyle,
                        }}
                      >
                        {qr.headerText}
                      </div>
                      <div
                        className="headerImg"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <img
                          id="headerImg"
                          width="100%"
                          height="100%"
                          style={{
                            objectFit: "cover",
                            objectPosition: "100%",
                          }}
                        />

                        <img
                          id="headerLogo"
                          width={qr.logoSize}
                          height="80%"
                          style={{
                            objectFit: "contain",
                            objectPosition: "100%",
                            position: "absolute",
                            zIndex: 12,
                            top: "10%",
                            left: qr.logoAlign,
                            display: `${
                              showLogo && qr.logoPosition === "top"
                                ? "block"
                                : "none"
                            }`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="qr text-center"
                    style={{
                      backgroundColor: qr.qrBgClr,
                      position: "relative",
                      height: "300px",
                      zIndex: qr.isQrFullImgActive ? 15 : 10,
                    }}
                  >
                    <img
                      id="qrImg"
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        objectPosition: "100%",
                      }}
                    />
                    <div
                      style={{
                        zIndex: 100,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-49%)",
                      }}
                    >
                      {qrcode}
                    </div>
                  </div>
                  <div
                    className="footerContent "
                    style={{
                      position: "relative",
                      textAlign: qr.footerFontAlign,
                      background: qr.qrBgClr,
                      height: "150px",
                      zIndex: 12,
                    }}
                  >
                    <div
                      className="footerClr"
                      style={{
                        background: qr.footerBgClr,
                        height: "100%",
                      }}
                    >
                      <div
                        className="footerText fw-bolder w-75"
                        style={{
                          zIndex: 1000,
                          fontSize: qr.footerFs + "px",
                          color: qr.footerTxtClr,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                          whiteSpace: "pre-line",
                          fontFamily: qr.footerFontFamily,
                          fontStyle: qr.footerFontStyle,
                        }}
                      >
                        <div className="footerTextContent">{qr.footerText}</div>
                        <div className="footerOffer">
                          {qr.offer !== "" ? `Coupon Code : "${qr.offer}"` : ""}
                        </div>
                      </div>
                      <div
                        className="footerImg"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <img
                          id="footerImg"
                          width="100%"
                          height="100%"
                          style={{
                            objectFit: "cover",
                            objectPosition: "100%",
                          }}
                        />
                        <img
                          id="footerLogo"
                          width={qr.logoSize}
                          height="80%"
                          style={{
                            objectFit: "contain",
                            objectPosition: "100%",
                            position: "absolute",
                            zIndex: 12,
                            top: "10%",
                            left: qr.logoAlign,
                            display: `${
                              showLogo && qr.logoPosition === "bottom"
                                ? "block"
                                : "none"
                            }`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizeQr;
