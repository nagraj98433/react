import React, { useState } from "react";
import { BASE_URL, themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Form } from "react-bootstrap";
import CustomTitle from "../heading/CustomTitle";
import Select from "react-select";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useIdGenerator from "../../utilis/useIdGenerator";
import axios from "axios";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useQrList } from "../../global_apis/useQrList";
import { handleQRUrl } from "../../store/qrThemeSlice";
import { useLinkQrStaff } from "../../global_apis/useLinkQrStaff";

function CreateQr({ menuList }) {
  const qrList = useSelector((state) => state.qrThemeData?.qrList);
  const orderFlowDetails = useSelector((state) => state.orderFlowData.data);

  const globalApiHandler = useGlobalApiHandler();
  const dispatch = useDispatch();
  const params = useParams();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getQrList = useQrList();
  const [id, setId] = useIdGenerator();
  const linkQrStaff = useLinkQrStaff();

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
      qrDesign: !form.qrDesign || !form.qrDesign.value,
      catalog: !form.catalog.length > 0,
      orderFlow: !form.orderFlow || !form.orderFlow.value,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleQrCreation = async () => {
    setIsLoading(true);
    setId();

    const orderFlow = orderFlowDetails?.filter(
      (orderFlowData) => orderFlowData?.order_flow_id === form.orderFlow?.value
    );
    const qrDesign = qrList?.qrTheme?.filter(
      (qrTheme) => qrTheme?.id === form.qrDesign?.value
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
      const data = {
        id: id,
        qrName: form.name,
        qrDesign: qrDesignData,
        catalog: menuListData,
        orderFlow: orderFlow,
        partitionKey: params?.outletId,
        sortKey: `qr#${id}`,
      };
      let updatedQrList = { ...qrList };
      updatedQrList = {
        ...updatedQrList,
        qrcode: Array.isArray(updatedQrList?.qrcode)
          ? [...updatedQrList.qrcode, data]
          : [data],
      };

      if (updatedQrList) {
        const amazonUrlResult = getAmazonUrl("qrcode");
        const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

        if (!isNotExpired) {
          const requiredUrl = await fetchAmazonBucketUrls("qrcode");
          dispatch(handleQRUrl(requiredUrl));

          const createQR = await axios.put(requiredUrl?.put_url, updatedQrList);
          if (createQR?.status === 200) {
            toast.success("QR Created successfully!");
            await getQrList(requiredUrl?.get_url);
            linkQrStaff(data);
          } else {
            toast.error("QR Creation failed!");
          }
        } else {
          const amazonUrlResult = getAmazonUrl("qrcode")?.url;
          const createQR = await axios.put(
            amazonUrlResult?.put_url,
            updatedQrList
          );
          if (createQR?.status === 200) {
            toast.success("QR Created successfully!");
            await getQrList(amazonUrlResult?.get_url);
            linkQrStaff(data);
          } else {
            toast.error("QR Creation failed!");
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
      handleQrCreation();
    } else {
      toast.error("All fields are mandatory!");
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="col-12 col-lg-6 col-md-6 d-flex">
          <CustomTitle heading={"Create QR"} />
        </div>

        <div className="row mt-2">
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
        <div className="row my-3">
          <div className="col-12 col-lg-2 col-md-4">
            <CustomButton
              name={"Save"}
              bgColor={themeColor.primary}
              handleClick={handleSubmit}
              preIcon={isLoading && <Spinner />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQr;
