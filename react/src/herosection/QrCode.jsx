import React, { useEffect, useState } from "react";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomHeading from "../components/heading/CustomHeading";
import CreateQr from "../components/form/CreateQr";
import QrList from "../components/list/QrList";
import CreateOrderFlow from "../components/form/CreateOrderFlow";
import OrderFlowList from "../components/list/OrderFlowList";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Toaster } from "react-hot-toast";
import ManageQr from "./ManageQr";
import { useMenuCatalogList } from "../global_apis/useMenuCatalogList";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { useFetchAmazonBucketUrls } from "../utilis/useFetchAmazonBucketUrls";
import { useSessionChecker } from "../utilis/useSessionChecker";
import { useSelector } from "react-redux";
import { useQrList } from "../global_apis/useQrList";
import { useDispatch } from "react-redux";
import { handleActiveTab } from "../store/qrThemeSlice";

const Qrcode = () => {
  const menuCatalogList = useSelector((state) => state.catlogData?.data);
  const qrList = useSelector((state) => state.qrThemeData?.qrList);
  const tab = useSelector((state) => state.qrThemeData?.activeTab);

  const [activeTab, setActiveTab] = useState(tab);

  const dispatch = useDispatch();
  const breadcrumb = useBreadcrumbData();
  const getAmazonUrl = useAmazonUrl();
  // const globalApiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const getMenuList = useMenuCatalogList();
  const getQrList = useQrList();

  const handleCatlogList = async () => {
    const amazonUrlResult = getAmazonUrl("catalogs");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

    if (!isNotExpired) {
      const requiredUrl = await fetchAmazonBucketUrls("catalogs");
      await getMenuList(requiredUrl?.get_url);
    } else {
      await getMenuList();
    }
  };

  const handleQrList = async () => {
    const amazonUrlResult = getAmazonUrl("qrcode");
    const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

    if (!isNotExpired) {
      const requiredUrl = await fetchAmazonBucketUrls("qrcode");
      await getQrList(requiredUrl?.get_url);
    } else {
      await getQrList();
    }
  };

  const handleTabChange = (tabName) => {
    dispatch(handleActiveTab(tabName));
    setActiveTab(tabName);
  };
  useEffect(() => {
    handleCatlogList();
    handleQrList();
    breadcrumb("qrcode");
  }, []);

  return (
    <>
      <Toaster />
      <div className="overflow-auto h-100 customscrollbar pb-5">
        <CustomBreadCrumb />
        <CustomHeading heading={"Manage QR & Order Flow"} />
        <div className="heroContainerMargin">
          <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="orderFlow">Order flow</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="qr">Qr</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="mb-5">
              <Tab.Pane eventKey="orderFlow">
                <div className="row">
                  <div className="col-12 mt-4">
                    <CreateOrderFlow />
                  </div>

                  <div className="customDivider">
                    <span></span>
                  </div>
                  <div className="col-12 col-lg-5 col-md-5 mt-5">
                    <OrderFlowList />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="qr">
                <div className="row">
                  <div className="col-12 col-lg-6 col-md-6 mt-4">
                    <CreateQr menuList={menuCatalogList} />
                    <div className="customDivider">
                      <span></span>
                    </div>
                    <QrList qrList={qrList} />
                  </div>
                  <div className="col-1 d-none d-lg-block d-md-block border-end"></div>
                  <div className="col-12 d-block d-lg-none d-md-none"></div>
                  <div className="col-12 col-lg-5 col-md-5 mt-4">
                    <ManageQr />
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </>
  );
};

export default Qrcode;
