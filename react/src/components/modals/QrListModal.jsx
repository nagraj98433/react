import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useQrList } from "../../global_apis/useQrList";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { handleQRUrl } from "../../store/qrThemeSlice";
import { useParams } from "react-router-dom";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import Spinner from "../loaders/Spinner";

function QrListModal({ show, handleToggle, qrData }) {
  const qrList = useSelector((state) => state.qrThemeData?.qrList);
  const orderFlowDetails = useSelector((state) => state.orderFlowData.data);
  const menuList = useSelector((state) => state.catlogData?.data);

  const params = useParams();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getQrList = useQrList();
  const dispatch = useDispatch();
  const globalApiHandler = useGlobalApiHandler();

  const catalogArry =
    menuList?.response?.catalogs.length > 0 &&
    menuList?.response?.catalogs.map((menu) => ({
      label: menu?.name,
      value: menu?.id,
    }));
  const qrDesignArry = qrList?.qrTheme?.map((qr) => ({
    label: qr?.name,
    value: qr?.id,
  }));
  const orderFlowArry = orderFlowDetails?.map((orderFlow) => ({
    label: orderFlow?.order_flow_name,
    value: orderFlow?.order_flow_id,
  }));
  const [form, setForm] = useState({
    name: "",
    qrDesign: [],
    catalog: [],
    orderFlow: [],
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    qrDesign: false,
    catalog: false,
    orderFlow: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = async () => {
    const validations = {
      name: !form.name.length,
      qrDesign: !form.qrDesign.length > 0,
      catalog: !form.catalog.length > 0,
      orderFlow: !form.orderFlow.length > 0,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };
  const handleUpdateQR = async () => {
    setIsLoading(true);
    const orderFlow = orderFlowDetails?.filter(
      (orderFlowData) =>
        orderFlowData?.order_flow_id === form.orderFlow[0]?.value
    );
    const qrDesign = qrList?.qrTheme?.filter(
      (qrTheme) => qrTheme?.id === form.qrDesign[0]?.value
    );
    const menuListData = menuList?.response?.catalogs.filter((menu) =>
      form.catalog.some((catalog) => menu.id === catalog.value)
    );

    const data = new FormData();

    data.append("outlet_id", params?.outletId);
    data.append("template_id", qrDesign[0]?.id);
    data.append("qr_size", qrDesign[0]?.qrImageData?.qrCodeSize);

    const apiData = {
      method: "post",
      url: BASE_URL + "api/outlets/qr/generate/",
      data: data,
    };
    const response = await globalApiHandler(apiData);
    if (response?.status) {
      let qrDesignData = {
        qrId: qrDesign[0]?.id,
        qrimg: response?.data,
      };
      const updateQRData = qrList?.qrcode.map((qr) => {
        if (qr.id === qrData?.id) {
          return {
            ...qr,
            qrName: form.name,
            qrDesign: qrDesignData,
            catalog: menuListData,
            orderFlow: orderFlow,
          };
        }
        return qr;
      });
      let updatedQrList = { ...qrList };
      updatedQrList = {
        ...updatedQrList,
        qrcode: updateQRData,
      };

      if (updateQRData) {
        const amazonUrlResult = getAmazonUrl("qrcode");
        const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

        if (!isNotExpired) {
          const requiredUrl = await fetchAmazonBucketUrls("qrcode");
          dispatch(handleQRUrl(requiredUrl));

          const updateQR = await axios.put(requiredUrl?.put_url, updatedQrList);
          if (updateQR?.status === 200) {
            toast.success("QR Updated successfully!");

            await getQrList(requiredUrl?.get_url);
          } else {
            toast.error("QR Updation failed!");
          }
        } else {
          const amazonUrlResult = getAmazonUrl("qrcode")?.url;
          const updateQR = await axios.put(
            amazonUrlResult?.put_url,
            updatedQrList
          );
          if (updateQR?.status === 200) {
            toast.success("QR Updated successfully!");

            await getQrList(amazonUrlResult?.get_url);
          } else {
            toast.error("QR Updation failed!");
          }
        }
        setForm({
          name: "",
          qrDesign: [],
          catalog: [],
          orderFlow: [],
        });
      }
    } else {
      toast.error(response?.message);
    }
    setIsLoading(false);
  };
  const handleSubmit = async () => {
    let frontendValidation = await handleValidation();
    if (frontendValidation) {
      await handleUpdateQR();
      handleToggle();
    } else {
      toast.error("All fields are mandatory!");
    }
  };

  useEffect(() => {
    if (qrData) {
      const qrCatalog = qrData?.catalog?.map((catalogId) => {
        const menu = menuList?.response?.catalogs?.find(
          (data) => catalogId?.id === data?.id
        );
        return {
          value: menu?.id,
          label: menu?.name,
        };
      });
      const qrOrderFlow = qrData?.orderFlow?.map((orderflowId) => {
        const orderFlowData = orderFlowDetails?.find(
          (data) => orderflowId?.order_flow_id === data?.order_flow_id
        );
        return {
          value: orderFlowData?.order_flow_id,
          label: orderFlowData?.order_flow_name,
        };
      });
      const qrThemeData = qrList?.qrTheme?.find(
        (data) => qrData?.qrDesign?.qrId === data?.id
      );

      setForm((prev) => ({
        ...prev,
        name: qrData?.qrName,
        catalog: qrCatalog,
        orderFlow: qrOrderFlow,
        qrDesign: [{ value: qrThemeData?.id, label: qrThemeData?.name }],
      }));
    }
  }, [qrData]);

  return (
    <Modal show={show} onHide={handleToggle} keyboard={false}>
      <Modal.Body>
        <div className="row justify-content-center">
          <div className="col-12 d-flex align-items-start">
            <CustomTitle heading={"Update QR"} />
            <div className="ms-auto">
              <CustomButton
                name={"Update"}
                bgColor={themeColor.primary}
                handleClick={handleSubmit}
                preIcon={isLoading ? <Spinner /> : ""}
              />
            </div>
          </div>
          <div className="col-12">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                QR Name
              </Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder={"Enter QR name"}
                required
                isInvalid={isInvalid.name}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter name of QR.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-2">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select QR Theme
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select QR Theme"
                options={qrDesignArry}
                isInvalid={isInvalid.qrDesign}
                name="qrDesign"
                value={form.qrDesign}
                onChange={(selectedOption) =>
                  setForm((prev) => ({ ...prev, qrDesign: selectedOption }))
                }
              />
              <Form.Control.Feedback type="invalid">
                Please select QR theme.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Catalog
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select Catalog"
                options={catalogArry}
                isInvalid={isInvalid.catalog}
                name="catalog"
                isMulti
                value={form.catalog}
                onChange={(selectedOption) =>
                  setForm((prev) => ({ ...prev, catalog: selectedOption }))
                }
                defaultValue={catalogArry[0]}
              />
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group className="mb-3">
              <Form.Label className="primary-text fw-medium formLabelText">
                Select Order Flow
              </Form.Label>
              <Select
                className="customInputBoxText"
                placeholder="Select Order Flow"
                options={orderFlowArry}
                isInvalid={isInvalid.orderFlow}
                name="orderFlow"
                value={form.orderFlow}
                onChange={(selectedOption) =>
                  setForm((prev) => ({ ...prev, orderFlow: selectedOption }))
                }
                defaultValue={orderFlowArry[0]}
              />
            </Form.Group>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default QrListModal;
