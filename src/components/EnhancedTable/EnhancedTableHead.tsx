import React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

const headCells = [
  {
    id: "name",
    label: "Property Name",
    style: { minWidth: "50%", width: "50%" },
  },
  {
    id: "status",
    label: "Status",
    style: { minWidth: "50%", width: "50%" },
  },
];

interface IProps {
  order: "asc" | "desc";
  orderBy: string;
  onRequestSort: Function;
}

export default function EnhancedTableHead(props: IProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((cell) => (
          <TableCell
            style={cell.style}
            key={cell.id}
            align="center"
            padding="normal"
            sortDirection={orderBy === cell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === cell.id}
              direction={orderBy === cell.id ? order : "asc"}
              onClick={createSortHandler(cell.id)}
            >
              {cell.label.toUpperCase()}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
