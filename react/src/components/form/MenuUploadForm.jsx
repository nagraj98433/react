import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import CustomButton from "../buttons/CustomButton";
import { BASE_URL, themeColor } from "../../utilis/constants";
import CustomTitle from "../heading/CustomTitle";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useMenuCategoryList } from "../../global_apis/useMenuCategoryList";
import Spinner from "../loaders/Spinner";
import { useSelector } from "react-redux";

function MenuUploadForm() {
  const restoDetails = useSelector(
    (state) => state.activeItemData.selectedRestaurant
  );

  const globalApiHandler = useGlobalApiHandler();
  const params = useParams();
  const getCategoryList = useMenuCategoryList();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    language: [],
    menuFile: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuUpload = async () => {
    setIsLoading(true);
    let languageArray = [];
    for (let i = 0; i < form.language.length; i++) {
      languageArray.push(form.language[i].value);
    }
    const data = new FormData();

    data.append("excel_upload", form.menuFile?.files[0]);
    data.append("language", JSON.stringify(languageArray));
    data.append("tag", params.menuId);

    const apiData = {
      method: "post",
      url: BASE_URL + "api/menu/menu-upload/",
      data: data,
    };

    const response = await globalApiHandler(apiData);
    setIsLoading(false);
    if (response?.status) {
      setForm({
        language: [],
        menuFile: "",
      });
      toast.success(response?.message);
      handleCategoryList();
    }
  };

  const handleCategoryList = async () => {
    const response = await getCategoryList(setIsLoading);
    if (response?.length) {
      navigate(
        `/main/outlet/${params?.outletId}/menupreview/${params?.menuId}/preview`
      );
    }
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, language: restoDetails?.language[0] }));
    return () => setForm((prev) => ({ ...prev, language: "", menuFile: "" }));
  }, []);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-4">
          <div className="row mt-4">
            <CustomTitle heading={"Upload Menu"} />
            <div className="col-12 mb-2">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text formLabelText">
                  Select Languages To Translate
                </Form.Label>
                <Select
                  className="customInputBoxText"
                  placeholder="Select languages"
                  options={restoDetails?.language}
                  isMulti
                  value={form.language}
                  onChange={(selectedData) =>
                    setForm((prev) => ({ ...prev, language: selectedData }))
                  }
                />
              </Form.Group>
            </div>
            <div className="col-12 mb-2">
              <Form.Group>
                <Form.Label className="formLabelText">
                  Upload menu in excel format OR{" "}
                  <a
                    href={BASE_URL + "api/menu/sample-menu/en/"}
                    style={{ color: themeColor.primary }}
                  >
                    Download Sample Menu
                  </a>
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  type="file"
                  placeholder="Enter menu title"
                  value={form.menuFile ? form.menuFile?.value : ""}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      menuFile: e.target,
                    }));
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-3 mt-2">
              <CustomButton
                name={"Save"}
                bgColor={themeColor.primary}
                handleClick={handleMenuUpload}
                preIcon={isLoading && <Spinner />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuUploadForm;
