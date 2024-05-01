import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import useIdGenerator from "../../utilis/useIdGenerator";
import { useAmazonUrl } from "../../utilis/useAmazonUrl";
import { useDispatch } from "react-redux";
import { getItemGroup } from "../../store/itemGroupSlice";
import toast from "react-hot-toast";
import axios from "axios";

function MenuCheckbox({ gropedItem, isCreatedMenu, seIsCataLogSelected }) {
  const menuOverallDetails = useSelector((state) => state.menuData.overallData);
  const itemchecked = useSelector((state) => state.itemGroupData.data);

  const [generateId, setGenerateId] = useIdGenerator();
  const [checkedCatalog, setCheckedCatalog] = useState(false);
  const [checkedCategory, setCheckedCategory] = useState({});
  const [checkedProduct, setCheckedProduct] = useState({});
  const [primaryLang, setPrimaryLang] = useState("");
  const [saveGroup, setSaveGroup] = useState(false);
  const getAmazonUrl = useAmazonUrl();
  const dispatch = useDispatch();

  const handleCatalogChange = (event) => {
    const isChecked = event.target?.checked;
    setCheckedCatalog(isChecked);
    if (isChecked) {
      const allCategories = {};
      const allProducts = {};
      menuOverallDetails[primaryLang]?.category.forEach((category) => {
        allCategories[category.category_id] = true;
      });
      menuOverallDetails[primaryLang]?.product.forEach((product) => {
        allProducts[product.product_id] = {
          checked: true,
        };
      });
      setCheckedCategory(allCategories);
      setCheckedProduct(allProducts);
    } else {
      // If catalog checkbox is unchecked, uncheck all category and product checkboxes
      setCheckedCategory({});
      setCheckedProduct({});
    }
  };

  const handleCategoryChange = (event) => {
    const { id, checked } = event.target;

    const updatedCheckedCategory = { ...checkedCategory, [id]: checked };
    setCheckedCategory(updatedCheckedCategory);

    const updatedCheckedProduct = { ...checkedProduct };
    if (checked) {
      menuOverallDetails[primaryLang]?.product.forEach((product) => {
        if (product.product_id.includes(id)) {
          updatedCheckedProduct[product.product_id] = {
            checked: true,
          };
        }
      });
    } else {
      Object.keys(checkedProduct).forEach((productId) => {
        if (productId.includes(id)) {
          delete updatedCheckedProduct[productId];
        }
      });
    }
    setCheckedProduct(updatedCheckedProduct);
  };

  const handleProductChange = (event) => {
    const { id, checked } = event.target;

    const updatedCheckedProduct = {
      ...checkedProduct,
      [id]: {
        checked: checked,
      },
    };
    setCheckedProduct(updatedCheckedProduct);
  };

  const catalogName =
    menuOverallDetails &&
    menuOverallDetails?.[primaryLang] &&
    menuOverallDetails?.[primaryLang].catalog.catalog_name;

  const catalogId =
    menuOverallDetails &&
    menuOverallDetails?.[primaryLang] &&
    menuOverallDetails?.[primaryLang].catalog.catalog_id;

  const [openIndex, setOpenIndex] = useState(-1);

  const handleAccordionToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const handelSave = async () => {
    if (gropedItem.name == "") {
      toast.error("Group name cannot be empty");
      return;
    }
    seIsCataLogSelected(false);

    setGenerateId();

    let finalData = [];
    const idsArray = Object.keys(checkedProduct);
    if (itemchecked.length != null) {
      finalData = [...itemchecked];
    }

    finalData.push({
      group_id: generateId,
      group_name: gropedItem?.name,
      ids: idsArray,
    });

    dispatch(getItemGroup(finalData));
    setSaveGroup(true);
  };

  const handleSaveApi = async () => {
    const amazonUrlData = getAmazonUrl("iteamgroup");
    const response = await axios.put(amazonUrlData?.url?.put_url, itemchecked);
    if (response?.status == 200) {
      toast.success("Item group added successfully");
    }
    setSaveGroup(false);
  };

  useEffect(() => {
    if (menuOverallDetails) {
      const firstKey = Object.keys(menuOverallDetails)[0];
      setPrimaryLang(firstKey);
    }
  }, [menuOverallDetails]);

  useEffect(() => {
    const updatedCheckedProduct = {};
    isCreatedMenu?.forEach((itemGroup) => {
      itemGroup?.grouped_item?.forEach((productId) => {
        updatedCheckedProduct[productId] = true;
      });
    });
    setCheckedProduct(updatedCheckedProduct);
  }, []);

  useEffect(() => {
    saveGroup && handleSaveApi();
  }, [saveGroup]);

  return (
    <div>
      <div style={{ marginTop: "1rem" }}>
        <div>
          <div style={{ marginBottom: "1rem" }}>
            {gropedItem?.name}
            <div></div>
            <button onClick={handelSave}>Save</button>
          </div>
        </div>

        <Accordion
          style={{
            minWidth: "300px",
            maxWidth: "479px",
            maxHeight: "300px",
            minHeight: "300px",
            overflow: "auto",
            paddingRight: "24px",
            paddingLeft: "24px",
          }}
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <label>
                <input
                  type="checkbox"
                  checked={checkedCatalog}
                  onChange={handleCatalogChange}
                />
                {catalogName}
              </label>
              <br />
            </Accordion.Header>
            <Accordion.Body>
              {menuOverallDetails && (
                <>
                  {menuOverallDetails[primaryLang]?.category?.map(
                    (category, index) => (
                      <div key={category.category_id}>
                        <div>
                          <Accordion
                            key={index}
                            activeKey={openIndex === index ? "0" : null}
                          >
                            <Accordion.Item eventKey="0">
                              <Accordion.Header
                                onClick={() => handleAccordionToggle(index)}
                              >
                                <label>
                                  <input
                                    type="checkbox"
                                    id={category.category_id}
                                    checked={
                                      checkedCategory[category.category_id]
                                    }
                                    onChange={handleCategoryChange}
                                  />
                                  {category.name}
                                </label>
                              </Accordion.Header>
                              <Accordion.Body>
                                {menuOverallDetails[primaryLang]?.product.map(
                                  (product) =>
                                    product.product_id.includes(
                                      category.category_id
                                    ) && (
                                      <label key={product.product_id}>
                                        <input
                                          type="checkbox"
                                          id={product.product_id}
                                          checked={
                                            checkedProduct[product.product_id]
                                              ?.checked || false
                                          }
                                          onChange={handleProductChange}
                                          data-name={product.product_name}
                                          data-category-id={
                                            category.category_id
                                          }
                                        />
                                        {product.product_name}
                                      </label>
                                    )
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default MenuCheckbox;
