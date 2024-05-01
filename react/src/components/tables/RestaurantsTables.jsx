import React from "react";
import { Table } from "react-bootstrap";
import { themeColor } from "../../utilis/constants";

function RestaurantsTables() {
  return (
    <div className="m-2">
      <Table responsive>
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: themeColor.secondary,
                color: themeColor.textSecondary,
              }}
            >
              Sr.No
            </th>
            <th
              style={{
                backgroundColor: themeColor.secondary,
                color: themeColor.textSecondary,
              }}
            >
              Restaurant
            </th>
            <th
              style={{
                backgroundColor: themeColor.secondary,
                color: themeColor.textSecondary,
              }}
            >
              Country
            </th>
            <th
              style={{
                backgroundColor: themeColor.secondary,
                color: themeColor.textSecondary,
              }}
            >
              Online Link / QR
            </th>
            <th
              style={{
                backgroundColor: themeColor.secondary,
                color: themeColor.textSecondary,
              }}
            >
              Status
            </th>
            <th
              style={{
                backgroundColor: themeColor.secondary,
                color: themeColor.textSecondary,
              }}
            >
              Manage
            </th>
            <th
              style={{
                backgroundColor: themeColor.secondary,
                color: themeColor.textSecondary,
              }}
            >
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>ABC</td>
            <td>India</td>
            <td>Scan</td>
            <td>Success</td>
            <td>True</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td colSpan={7} className="text-danger text-center">
              No data found
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default RestaurantsTables;
