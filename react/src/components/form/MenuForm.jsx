import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import CustomTitle from "../heading/CustomTitle";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useMenuCatalogList } from "../../global_apis/useMenuCatalogList";
import { useFetchAmazonBucketUrls } from "../../utilis/useFetchAmazonBucketUrls";
import { useSessionChecker } from "../../utilis/useSessionChecker";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { handleActiveItem } from "../../store/activeItemSlice";
import { handleActiveOutlet } from "../../store/activeOutletSlice";

function MenuForm() {
  const langArry = [
    { value: "en", label: "English" },
    { value: "ro", label: "Romania" },
    { value: "uk", label: "Ukraine" },
    { value: "th", label: "Thai" },
    { value: "vi", label: "Vietnamese" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(langArry[0]);

  const userData = useSelector((state) => state.userData.data);
  const outletDetails = useSelector((state) => state.activeOutletData.data);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalApiHandler = useGlobalApiHandler();
  const getMenuList = useMenuCatalogList();
  const getAmazonUrl = useAmazonUrl();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const params = useParams();

  const [form, setForm] = useState({
    name: "",
    file: "",
    language: "",
  });
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    file: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleValidation = () => {
    const validations = {
      name: !form.name.length,
      file: !form.file,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const createMenu = async () => {
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
    const frontendValidation = handleValidation();

    if (!frontendValidation) return false;

    setIsLoading(true);
    const data = new FormData();

    data.append("catalog_name", form.name);
    data.append("language_code", selectedLanguage.value);
    data.append("excel_upload", form.file?.files[0]);
    data.append("owner_id", userData?.owner_id);
    data.append("outlet_id", params?.outletId);

    const apiData = {
      method: "post",
      url: BASE_URL + "api/menu/menu-upload/",
      data: data,
    };

    const response = await globalApiHandler(apiData);

    if (response?.status) {
      toast.success(response?.message);

      const amazonUrlResult = getAmazonUrl("catalogs");
      const isNotExpired = amazonUrlExpiryChecker(amazonUrlResult?.expiry);

      if (!isNotExpired) {
        const requiredUrl = await fetchAmazonBucketUrls("catalogs");
        await getMenuList(requiredUrl?.get_url);
      } else {
        await getMenuList();
      }
    } else {
      toast.error("Please upload valid file format");
    }
    setForm({
      file: "",
      name: "",
    });
    setIsLoading(false);
  };

  return (
    <>
      <CustomTitle heading={"Create Menu"} />
      <div className="row">
        <div className="col-12 mb-2">
          <div className="col-6">
            <Form.Group>
              <Form.Label className="formLabelText">Menu Title</Form.Label>
              <Form.Control
                className="customInputBoxText"
                type="text"
                placeholder="Enter menu title"
                value={form.name}
                isInvalid={isInvalid.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Form.Group>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <Form.Group className="mb-1">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Select language & download menu sample
                </Form.Label>
                <div className="row">
                  <div className="col">
                    <Select
                      className="customInputBoxText w-50 "
                      placeholder="Select Languages"
                      options={langArry}
                      value={selectedLanguage}
                      onChange={(selectedOption) =>
                        setSelectedLanguage(selectedOption)
                      }
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: themeColor.accent,
                          primary: themeColor.primary,
                        },
                      })}
                    />
                  </div>
                  <div className="col ms-auto"></div>
                </div>
              </Form.Group>
              <div className="primary-text fw-medium formLabelText">
                <a
                  href={
                    BASE_URL + `api/menu/sample-menu/${selectedLanguage.value}/`
                  }
                  style={{ color: themeColor.primary }}
                >
                  Download Sample Menu .xls
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 mb-2">
          <Form.Group>
            <Form.Label className="formLabelText">
              Menu Excel File{"  "}
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
      </div>
      <div className="row my-3">
        <div className="col-2">
          <CustomButton
            name={"Save"}
            bgColor={themeColor.primary}
            handleClick={createMenu}
            preIcon={isLoading && <Spinner />}
          />
        </div>
      </div>
    </>
  );
}

export default MenuForm;
