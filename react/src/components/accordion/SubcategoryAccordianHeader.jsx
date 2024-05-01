import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import ItemsTable from "./ItemsTable";
import { useSelector } from "react-redux";
import SubcatEditableText from "./SubcatEditableText";
import { MdAddCircle, MdDelete } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import SubcategoryLevelAddonSelectionDropdown from "../dropdowns/SubcategoryLevelAddonSelectionDropdown";
import { useDispatch } from "react-redux";
import { handleSubcategoryWiseDelete } from "../../store/menuSlice";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";
import { useParams } from "react-router-dom";

function SubcategoryAccordianHeader({ subcatData }) {
  const menuDetails = useSelector((state) => state.menuData.data);

  const [productData, setProductData] = useState([]);
  const [showAddonSelection, setShowAddonSelection] = useState(false);
  const [isMenuChange, setIsMenuChange] = useState(false);

  const dispatch = useDispatch();
  const updateMenu = useUpdateMenu();
  const param = useParams();

  const toggleAddonSelection = () => setShowAddonSelection(!showAddonSelection);

  const getItems = () => {
    if (!menuDetails) return;

    let productList = [];

    Object.keys(menuDetails).map((menuKey) => {
      const filteredProducts = menuDetails[menuKey]?.product.filter(
        (product) => {
          return product?.product_id.includes(
            subcatData[0]?.data?.subcategory_id
          );
        }
      );
      let newobj = {
        data: filteredProducts,
        code: menuKey,
      };
      productList.push(newobj);
    });
    setProductData(productList);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    toggleAddonSelection();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(handleSubcategoryWiseDelete(id));
    setIsMenuChange(true);
  };

  const handleUpdateMenu = async () => {
    const payload = {
      catalogId: param.menuId,
      isCatalogChange: false,
    };
    await updateMenu(payload);
    setIsMenuChange(false);
  };

  useEffect(() => {
    isMenuChange && handleUpdateMenu();
  }, [isMenuChange]);

  useEffect(() => {
    getItems();
  }, [subcatData]);
  return (
    <>
      <Accordion.Item eventKey={subcatData[0]?.data?.subcategory_id}>
        <Accordion.Header>
          <div className="row w-100">
            {subcatData &&
              subcatData.map((subcat, i) => {
                return <SubcatEditableText data={subcat} key={i} />;
              })}
          </div>
          <div className="text-end me-2 position-relative d-flex gap-2 align-items-center">
            <MdAddCircle
              size={"18px"}
              color={themeColor.primary}
              onClick={handleClick}
            />
            {showAddonSelection && (
              <SubcategoryLevelAddonSelectionDropdown
                handleClose={toggleAddonSelection}
                subCatId={subcatData[0]?.data?.subcategory_id}
                subCatAddons={
                  subcatData[0]?.data?.addonsGroup
                    ? subcatData[0]?.data?.addonsGroup
                    : []
                }
              />
            )}
            <MdDelete
              size={"18px"}
              color={themeColor.primary}
              onClick={(e) =>
                handleDelete(e, subcatData[0]?.data?.subcategory_id)
              }
            />
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <ItemsTable
            data={productData}
            subCategoryId={subcatData[0]?.data?.subcategory_id}
          />
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}

export default SubcategoryAccordianHeader;
