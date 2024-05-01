import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import CustomTitle from "../heading/CustomTitle";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { handleActiveItem } from "../../store/activeItemSlice";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { handleAddonData } from "../../store/addOnCatalogSlice";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { FaCircleCheck } from "react-icons/fa6";
import AddOnPreviewTest from "../../herosection/AddonPreviewTest";
function MenuAddOn() {
  const userData = useSelector((state) => state.userData.data);
  const addOnData = useSelector((state) => state.addOnData.data);
  const menuCatalogList = useSelector((state) => state.catlogData?.data);
  const langArry = [
    { value: "en", label: "English" },
    { value: "it", label: "Italian" },
    { value: "uk", label: "Ukrainian" },
    { value: "th", label: "Thai" },
    { value: "vi", label: "Vietnamese" },
  ];
  const getAmazonUrl = useAmazonUrl();
  const [selectedLanguage, setSelectedLanguage] = useState(langArry[0]);
  const amazonUrlExpiryChecker = useSessionChecker();

  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const params = useParams();

  const [form, setForm] = useState({
    name: "",
    file: "",
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    file: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isAddonUploaded, setIsAddonUploaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddon, setAddon] = useState(false);
  const handleValidation = () => {
    const validations = {
      file: !form.file,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const createAddon = async () => {
    const frontendValidation = handleValidation();

    if (!frontendValidation) return false;
    if (menuCatalogList.length === 0) {
      toast.error(
        "Menu not found!..Please upload menu before uploading addon!"
      );
      setForm({
        file: "",
      });
      return;
    }
    if (!isAddonUploaded) {
      var file = form.file?.files[0];
      var extension = file.name.split(".").pop().toLowerCase();

      if (extension != "xls" && extension != "xlsx") {
        setForm({
          file: "",
          name: "",
        });
        toast.error("Please upload valid file format");
        return;
      }

      setIsLoading(true);

      const data = new FormData();

      data.append("excel_upload", form.file?.files[0]);
      data.append("owner_id", userData?.owner_id);
      data.append("outlet_id", params?.outletId);

      const apiData = {
        method: "post",
        url: BASE_URL + "api/menu/addon/",
        data: data,
      };

      const response = await globalApiHandler(apiData);
      if (response?.status) {
        toast.success(response?.message);
        await fetchAmazonBucketUrls("addons");
        await getAmazonUrl("addons");
        setIsAddonUploaded(true);
      } else {
        toast.error("Please upload valid file format");
      }
      setIsLoading(false);
      setForm({
        file: "",
        name: "",
      });
    } else {
      setShowModal(true);
    }
  };
  const handleSaveConfirmation = async (confirmed) => {
    var file = form.file?.files[0];
    var extension = file.name.split(".").pop().toLowerCase();

    if (extension !== "xls" && extension !== "xlsx") {
      setForm({
        file: "",
        name: "",
      });
      toast.error("Please upload valid file format");
      setShowModal(false);
      return;
    } else {
      if (confirmed) {
        setIsLoadingModal(true);
        const data = new FormData();

        data.append("excel_upload", form.file?.files[0]);
        data.append("owner_id", userData?.owner_id);
        data.append("outlet_id", params?.outletId);

        const apiData = {
          method: "post",
          url: BASE_URL + "api/menu/addon/",
          data: data,
        };

        const response = await globalApiHandler(apiData);

        if (response?.status) {
          await fetchAmazonBucketUrls("addons");
          await getAmazonUrl("addons");
          setIsAddonUploaded(true);
          toast.success(response?.message);
        } else {
          toast.error("Please upload valid file format");
        }
        setForm({
          file: "",
          name: "",
        });
      }

      setIsLoadingModal(false);
      setShowModal(false);
    }
  };
  const getAddonUrl = async () => {
    let getAddon = null;
    getAddon = getAmazonUrl("addons");
    const isNotExpired = amazonUrlExpiryChecker(getAddon?.expiry);

    if (!isNotExpired) {
      getAddon = await fetchAmazonBucketUrls("addons");
    }
    if (!getAddon) {
      // return toast.error("url not found");
      return;
    }

    const response = await axios.get(getAddon?.url?.get_url);

    if (response?.data) {
      dispatch(handleAddonData(response?.data));
      return true;
    }
  };

  const handleViewAddon = async () => {
    const status = await getAddonUrl();
    if (status) {
      dispatch(
        handleActiveItem({
          name: "isShowAddon",
          value: true,
        })
      );
    }
  };
  useEffect(() => {
    handleActiveItem({
      name: "isAddOnEdit",
      value: false,
    });
  });
  useEffect(() => {
    getAmazonUrl("addons") && setIsAddonUploaded(true);
    handleViewAddon();
  }, [isAddonUploaded]);
  useEffect(() => {
    handleViewAddon();
  }, []);
  return (
    <>
      <CustomTitle heading={"Create Add-Ons"} />
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setForm({
            file: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <div className="text-danger">
            <Modal.Title>Confirmation</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          Re-uploading addon will erase menu addon connection...Are you sure you
          want to continue?
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            name={"Upload"}
            bgColor={themeColor.primary}
            handleClick={() => handleSaveConfirmation(true)}
            preIcon={isLoadingModal ? <Spinner /> : <FaCircleCheck />}
          />
        </Modal.Footer>
      </Modal>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row mt-2">
            <div className="col-12">
              <div className="primary-text fw-medium formLabelText">
                <a
                  href={BASE_URL + "api/menu/sample-menu/en/?category=add_on"}
                  style={{ color: themeColor.primary }}
                >
                  Download Sample add-on file .xls
                </a>
              </div>
            </div>
          </div>

          <div className="d-flex row">
            <div className="col-6">
              <Form.Group className="">
                <Form.Label className="formLabelText mt-2">
                  Add-On Excel File{" "}
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  type="file"
                  placeholder="Upload menu in excel"
                  value={form.file ? form.file?.value : ""}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      file: e.target,
                    }));
                  }}
                  isInvalid={isInvalid.file}
                />
                <Form.Control.Feedback type="invalid">
                  Please upload file in excel format.
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-2" style={{ marginTop: "39px" }}>
              <CustomButton
                name={"Upload"}
                bgColor={themeColor.accent}
                color={themeColor.primary}
                handleClick={createAddon}
                preIcon={isLoading ? <Spinner /> : <FaCircleCheck />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuAddOn;
