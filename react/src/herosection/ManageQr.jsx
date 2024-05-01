import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomTitle from "../components/heading/CustomTitle";
import { themeColor } from "../utilis/constants";
import CustomButton from "../components/buttons/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import {
  handleActiveTheme,
  handleQRUrl,
  handleThemeDelete,
} from "../store/qrThemeSlice";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { useSessionChecker } from "../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../utilis/useFetchAmazonBucketUrls";
import { useQrList } from "../global_apis/useQrList";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const ManageQr = () => {
  const qrThemeData = useSelector((state) => state.qrThemeData?.qrList);
  const [imageLoading, setImageLoading] = useState(true);

  // const breadcrumb = useBreadcrumbData();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getQrList = useQrList();

  const handleThemeEdit = async (theme) => {
    dispatch(handleActiveTheme(theme));
    navigate(`/main/outlet/${params?.outletId}/customizeqr`);
  };

  const handleQrThemeDelete = async (index) => {
    const updatedQrThemes = [...qrThemeData?.qrTheme];

    updatedQrThemes.splice(index, 1);
    if (updatedQrThemes) {
      const amazonUrlResult = getAmazonUrl("qrcode");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("qrcode");
        dispatch(handleQRUrl(requiredUrl));
        dispatch(
          handleThemeDelete({ ...qrThemeData, qrTheme: updatedQrThemes })
        );
        const createQR = await axios.put(requiredUrl?.put_url, {
          ...qrThemeData,
          qrTheme: updatedQrThemes,
        });
        if (createQR?.status === 200) {
          toast.success("QR Theme Deleted successfully!");
          getQrList(requiredUrl?.get_url);
        } else {
          toast.error("QR Theme Deletion failed!");
        }
      } else {
        const amazonUrlResult = getAmazonUrl("qrcode")?.url;
        const createQR = await axios.put(amazonUrlResult?.put_url, {
          ...qrThemeData,
          qrTheme: updatedQrThemes,
        });
        if (createQR?.status === 200) {
          toast.success("QR Theme Deleted successfully!");
          getQrList(amazonUrlResult?.get_url);
        } else {
          toast.error("QR Theme Deletion failed!");
        }
      }
    }
  };

  useEffect(() => {
    setImageLoading(true); // Set image loading to true when qrThemeData changes
  }, [qrThemeData?.qrTheme?.length]);

  const handleImageLoad = () => {
    setImageLoading(false); // Set image loading to false when image is loaded
  };
  return (
    <>
      <div className="row g-0 ">
        <div className=" col-12 d-flex justify-content-between">
          <div>
            <CustomTitle heading={"QR Theme"} />
          </div>
          <div>
            <CustomButton
              name={"Create Custom Theme"}
              bgColor={themeColor.primary}
              handleClick={() => {
                dispatch(handleActiveTheme(""));
                navigate(`/main/outlet/${params?.outletId}/customizeqr`);
              }}
            />
          </div>
        </div>
        <div className="col-12 d-flex flex-wrap ">
          {qrThemeData && qrThemeData?.qrTheme?.length > 0
            ? qrThemeData?.qrTheme?.map((theme, index) => (
                <div
                  className="col-12 col-md-6 col-lg-6 mt-2 "
                  key={theme?.name}
                >
                  <div
                    className="card"
                    style={{ width: "12rem", height: "auto" }}
                  >
                    {imageLoading && (
                      <div className="mx-auto mt-2">
                        <Spinner />
                      </div>
                    )}
                    <img
                      loading="lazy"
                      src={theme?.imageUrl}
                      className="card-img-top"
                      alt="scanner"
                      onLoad={handleImageLoad}
                    />
                    <div className="card-body">
                      <div className="col-12 d-flex justify-content-between">
                        <CustomTitle heading={theme?.name} />
                        <div className="d-flex gap-2">
                          <div onClick={() => handleThemeEdit(theme)}>
                            <MdEdit />
                          </div>
                          <div onClick={() => handleQrThemeDelete(index)}>
                            <MdDelete />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="card-editBody">
                      <div className="col-12 text-center">
                      </div>
                    </div> */}
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </>
  );
};

export default ManageQr;
