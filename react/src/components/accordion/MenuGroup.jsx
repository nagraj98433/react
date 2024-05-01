import React from "react";
import { Accordion, Form } from "react-bootstrap";
import MenuGroupAccordionBody from "./MenuGroupAccordionBody";

function MenuGroup({ data, selectedItems, setSelectedItems }) {
  const handleCheck = (e, id) => {
    if (!data?.product?.length) {
      return;
    }
    const filteredItems = data?.product?.filter((item) => {
      return item?.product_id?.includes(id);
    });

    if (!filteredItems?.length) {
      return;
    }

    if (e.target.checked) {
      let tempArray = [];
      for (let i = 0; i < filteredItems.length; i++) {
        if (!selectedItems.includes(filteredItems[i]?.product_id)) {
          tempArray.push(filteredItems[i]?.product_id);
        }
      }
      setSelectedItems((prev) => [...prev, ...tempArray]);
    } else {
      let tempArray = selectedItems;
      for (let j = 0; j < filteredItems.length; j++) {
        tempArray = tempArray.filter((item) => {
          return item !== filteredItems[j]?.product_id;
        });
      }
      setSelectedItems(tempArray);
    }
  };
  return (
    <Accordion flush>
      {data &&
        data?.category.map((cat) => (
          <Accordion.Item key={cat?.category_id} eventKey={cat?.category_id}>
            <Accordion.Header>
              <div
                onClick={(e) => e.stopPropagation()}
                className="d-flex gap-3 align-items-center"
              >
                <Form.Check
                  onChange={(e) => handleCheck(e, cat?.category_id)}
                />
                <div>{cat?.name}</div>
              </div>
            </Accordion.Header>
            <MenuGroupAccordionBody
              catId={cat?.category_id}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </Accordion.Item>
        ))}
    </Accordion>
  );
}

export default MenuGroup;
