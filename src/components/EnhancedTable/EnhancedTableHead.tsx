import React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

const headCells = [
  {
    id: "name",
    label: "Tour Name",
    style: { minWidth: "33.33%", width: "33.33%" },
  },
  {
    id: "numberOfScenes",
    label: "Scenes",
    style: { minWidth: "33.33%", width: "33.33%" },
  },
  {
    id: "status",
    label: "Status",
    style: { minWidth: "33.33%", width: "33.33%" },
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
            className="table__header_row"
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
