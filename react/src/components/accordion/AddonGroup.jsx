import React from "react";
import { Accordion, Form } from "react-bootstrap";
import AddonGroupAccordionBody from "./AddonGroupAccordionBody";

function AddonGroup({ data, selectedItems, setSelectedItems }) {
  const handleCheck = (e, id) => {
    if (!data?.add_on?.length) {
      return;
    }
    const filteredItems = data?.add_on?.filter((item) => {
      return item?.addon_name_id?.includes(id);
    });

    if (!filteredItems?.length) {
      return;
    }

    if (e.target.checked) {
      let tempArray = [];
      for (let i = 0; i < filteredItems.length; i++) {
        if (!selectedItems.includes(filteredItems[i]?.addon_name_id)) {
          tempArray.push(filteredItems[i]?.addon_name_id);
        }
      }
      setSelectedItems((prev) => [...prev, ...tempArray]);
    } else {
      let tempArray = selectedItems;
      for (let j = 0; j < filteredItems.length; j++) {
        tempArray = tempArray.filter((item) => {
          return item !== filteredItems[j]?.addon_name_id;
        });
      }
      setSelectedItems(tempArray);
    }
  };
  return (
    <Accordion flush>
      {data &&
        data?.group_list.map((cat) => (
          <Accordion.Item
            key={cat?.addon_group_id}
            eventKey={cat?.addon_group_id}
          >
            <Accordion.Header>
              <div
                onClick={(e) => e.stopPropagation()}
                className="d-flex gap-3 align-items-center"
              >
                <Form.Check
                  onChange={(e) => handleCheck(e, cat?.addon_group_id)}
                />
                <div>{cat?.addon_group}</div>
              </div>
            </Accordion.Header>
            <AddonGroupAccordionBody
              catId={cat?.addon_group_id}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </Accordion.Item>
        ))}
    </Accordion>
  );
}

export default AddonGroup;
