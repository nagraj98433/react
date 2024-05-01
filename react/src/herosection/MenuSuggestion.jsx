import React from "react";
import { Table } from "react-bootstrap";

function MenuSuggestion() {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th className="menuHeading">Name</th>
          <th className="menuHeading">Description</th>
          <th className="menuHeading">Price</th>
          <th className="menuHeading">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={4} className="menuRow text-center text-danger">
            Select subcategory to display items
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default MenuSuggestion;
