import { useState } from "react";
// import { useHistory } from "react-router-dom";
import orderByLodash from "lodash/orderBy";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import EnhancedTableHead from "./EnhancedTableHead";
import "./table.styles.scss";

const EnhancedTable = (props) => {
  // const history = useHistory();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("name");

  const stableSort = (tours) => {
    let sortedArray;

    if (orderBy === "name") {
      sortedArray = orderByLodash(tours, [(o) => o.name], order);
    }

    return sortedArray;
  };

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
          {stableSort(props.tours).map((listItem, index) => {
            console.log(listItem);

            return (
              <TableRow style={{ cursor: "pointer" }} key={index}>
                <TableCell
                  align="center"
                  style={{ minWidth: "10%", width: "10%" }}
                >
                  {listItem.name}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: "22%", width: "22%" }}
                >
                  <span>{listItem.scenes.length}</span>
                </TableCell>
                <TableCell
                  align="center"
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
};

export default EnhancedTable;
