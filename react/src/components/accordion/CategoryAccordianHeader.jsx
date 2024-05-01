import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import SubcategoryAccordianHeader from "./SubcategoryAccordianHeader";
import { useSelector } from "react-redux";
import CatEditableText from "./CatEditableText";
import { themeColor } from "../../utilis/constants";
import NewSubCatEditableText from "./NewSubCatEditableText";
import { MdAdd, MdAddCircle, MdDelete } from "react-icons/md";
import { HiMinusSm } from "react-icons/hi";
import CategoryLevelAddonSelectionDropdown from "../dropdowns/CategoryLevelAddonSelectionDropdown";
import { useDispatch } from "react-redux";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";
import { useParams } from "react-router-dom";
import { handleCategoryWiseDelete } from "../../store/menuSlice";

function CategoryAccordianHeader({ data }) {
  const menuDetails = useSelector((state) => state.menuData.data);

  const [subCategoryList, setSubCategoryList] = useState([]);
  const [showNewSubCategoryField, setShowNewSubCategoryField] = useState(false);
  const [showAddonSelection, setShowAddonSelection] = useState(false);
  const [isMenuChange, setIsMenuChange] = useState(false);

  const updateMenu = useUpdateMenu();
  const param = useParams();
  const dispatch = useDispatch();

  // toggles
  const toggleAddonSelection = () => setShowAddonSelection(!showAddonSelection);
  const toggleNewSubCategoryField = () =>
    setShowNewSubCategoryField(!showNewSubCategoryField);

  const categroyId = data[0]?.category_id;

  const handleSubcategorySorting = () => {
    if (!menuDetails) return;

    let subcatList = [];

    Object.keys(menuDetails).map((menuKey) => {
      const filteredSubcategoryList = menuDetails[menuKey]?.subcategory.filter(
        (subcat) => {
          return subcat?.subcategory_id?.includes(categroyId);
        }
      );
      let newobj = {
        data: filteredSubcategoryList,
        code: menuKey,
      };
      subcatList.push(newobj);
    });

    if (!subcatList.length) return;

    let sortedSubCategory = [];

    for (let i = 0; i < subcatList[0]?.data.length; i++) {
      let intendedSubcategory = [];

      for (let j = 0; j < subcatList.length; j++) {
        let newObj = {
          data: subcatList[j]?.data[i],
          code: subcatList[j]?.code,
        };
        intendedSubcategory.push(newObj);
      }

      sortedSubCategory.push(intendedSubcategory);
    }

    setSubCategoryList(sortedSubCategory);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(handleCategoryWiseDelete(id));
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
    handleSubcategorySorting();
  }, [data]);

  useEffect(() => {
    isMenuChange && handleUpdateMenu();
  }, [isMenuChange]);

  return (
    <>
      <Accordion.Item eventKey={data[0]?.category_id}>
        <Accordion.Header>
          <div className="row w-100">
            {data &&
              data.map((cat, i) => {
                return <CatEditableText data={cat} key={i} />;
              })}
          </div>
          <div className="text-end me-2 position-relative d-flex gap-2 align-items-center">
            <MdAddCircle
              size={"18px"}
              color={themeColor.primary}
              onClick={(e) => {
                e.stopPropagation();
                toggleAddonSelection();
              }}
            />
            {showAddonSelection && (
              <CategoryLevelAddonSelectionDropdown
                handleClose={toggleAddonSelection}
                catId={data[0]?.category_id}
                catAddons={data[0]?.addonsGroup ? data[0]?.addonsGroup : []}
              />
            )}
            <MdDelete
              size={"18px"}
              color={themeColor.primary}
              onClick={(e) => handleDelete(e, data[0]?.category_id)}
            />
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <div
            onClick={toggleNewSubCategoryField}
            className="text-end mb-2 fw-medium cursor-pointer"
            style={{ fontSize: "12px", color: themeColor.primary }}
          >
            {showNewSubCategoryField ? <HiMinusSm /> : <MdAdd />} new
            subcategory
          </div>
          <Accordion>
            {showNewSubCategoryField && (
              <Accordion.Item className="animeBottomToTop">
                <Accordion.Header>
                  <NewSubCatEditableText
                    toggle={toggleNewSubCategoryField}
                    categoryId={data[0]?.category_id}
                  />
                </Accordion.Header>
              </Accordion.Item>
            )}
            {subCategoryList &&
              subCategoryList.map((subcat, i) => (
                <SubcategoryAccordianHeader key={i} subcatData={subcat} />
              ))}
          </Accordion>
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}

export default CategoryAccordianHeader;
