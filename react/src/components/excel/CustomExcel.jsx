import React from "react";
import { Table } from "react-bootstrap";

function CustomExcel({ data }) {
  return (
    <div className="m-4">
      <Table bordered responsive>
        <thead>
          <tr>
            {data && data?.headings.map((item) => <th key={item}>{item}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>abc</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default CustomExcel;
