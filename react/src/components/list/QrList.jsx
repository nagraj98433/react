import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { themeColor } from "../../utilis/constants";
import { MdDelete, MdEdit, MdFileDownload } from "react-icons/md";
import NotFound from "../notFound/NotFound";
import VerticalListShimmer from "../shimmers/list/VerticalListShimmer";
import toast from "react-hot-toast";
import { FaArrowRightLong } from "react-icons/fa6";
import QrListModal from "../modals/QrListModal";
import Accordion from "react-bootstrap/Accordion";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useQrList } from "../../global_apis/useQrList";
import { handleQRUrl } from "../../store/qrThemeSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

function QrList({ qrList }) {
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getQrList = useQrList();

  // const getStaffList = useStaffListApi();
  const [showQRModal, setShowQRModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleQRModal = async (data) => {
    setSelectedUser(data);
    setShowQRModal(!showQRModal);
  };

  const handleDownloadQrTheme = async (data) => {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = "Qr_Scanner.png";
    link.href = data?.qrDesign?.qrimg;
    // link.target = "_blank";
    link.click();
  };

  const handleDeleteQr = async (index) => {
    setIsLoading(true);
    if (qrList?.qrcode.length > 0) {
      const updatedQrList = [...qrList?.qrcode];
      updatedQrList.splice(index, 1);

      const amazonUrlResult = await getAmazonUrl("qrcode");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("qrcode");
        dispatch(handleQRUrl(requiredUrl));
        const updateDataurl = await axios.put(requiredUrl?.put_url, {
          ...qrList,
          qrcode: updatedQrList,
        });
        if (updateDataurl?.status === 200) {
          toast.success("QR Deleted successfully!");
          await getQrList(requiredUrl?.get_url);
        } else {
          toast.error("QR Deletion failed!");
        }
      } else {
        const amazonUrlResult = await getAmazonUrl("qrcode")?.url;
        const updateDataurl = await axios.put(amazonUrlResult?.put_url, {
          ...qrList,
          qrcode: updatedQrList,
        });
        if (updateDataurl?.status === 200) {
          toast.success("QR Deleted successfully!");
          await getQrList(amazonUrlResult?.get_url);
        } else {
          toast.error("QR Deletion failed!");
        }
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQrList();
  }, [qrList?.qrcode?.length]);

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>QR list</Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-12 col-lg-8 col-md-10 animeBottomToTop">
                {isLoading ? (
                  <VerticalListShimmer />
                ) : (
                  <ListGroup>
                    {qrList && qrList?.qrcode?.length ? (
                      qrList?.qrcode.map((qrData, index) => (
                        <ListGroup.Item key={qrData?.id}>
                          <div className="d-flex justify-content-between align-items-start cursor-pointer">
                            <div>
                              <div className="fw-medium primary-text userText">
                                {qrData?.qrName}
                              </div>
                              <div className="fw-medium secondary-text userNameText ms-1">
                                {"("}
                                {qrData &&
                                  qrData?.catalog.map((menu, i) => {
                                    return `${menu?.name}${
                                      i + 1 !== qrData?.catalog.length
                                        ? ", "
                                        : ""
                                    }`; // Assuming staff_id is unique, otherwise handle accordingly
                                  })}
                                {") "}
                                <FaArrowRightLong />{" "}
                                {qrData?.orderFlow[0]?.order_flow_name}
                              </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <MdFileDownload
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => handleDownloadQrTheme(qrData)}
                              />
                              <MdEdit
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => toggleQRModal(qrData)}
                              />
                              <MdDelete
                                color={themeColor.primary}
                                size={"15px"}
                                onClick={() => handleDeleteQr(index)}
                              />
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <NotFound />
                    )}
                  </ListGroup>
                )}
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <QrListModal
        show={showQRModal}
        handleToggle={toggleQRModal}
        qrData={selectedUser}
      />
    </>
  );
}

export default QrList;
