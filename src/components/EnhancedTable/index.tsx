import { useState } from "react";
// import { useHistory } from "react-router-dom";
import orderByLodash from "lodash/orderBy";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import EnhancedTableHead from "./EnhancedTableHead";

export default function EnhancedTable() {
  // const history = useHistory();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("name");

  function stableSort(array) {
    let sortedArray;

    if (orderBy === "name") {
      sortedArray = orderByLodash(array, [(o) => o.customerId.name], order);
    }

    return sortedArray;
  }

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <TableContainer className="table-container">
      <Table
        className="properties__table"
        aria-labelledby="tableTitle"
        aria-label="enhanced table"
        stickyHeader
      >
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {stableSort([]).map((listItem, index) => {
            return (
              <TableRow style={{ cursor: "pointer" }} key={index}>
                <TableCell style={{ minWidth: "10%", width: "10%" }}>
                  {listItem.name}
                </TableCell>
                <TableCell
                  align="left"
                  style={{ minWidth: "22%", width: "22%" }}
                >
                  <span>{listItem.status}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
