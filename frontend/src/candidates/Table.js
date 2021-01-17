import { useState } from "react";
import { orderBy } from "lodash";
import {
  Table as MaterialTable,
  TableBody as MaterialTableBody,
  TableCell as MaterialTableCell,
  TableContainer as MaterialTableContainer,
  TableHead as MaterialTableHead,
  TableRow as MaterialTableRow,
  TableSortLabel as MaterialTableSortLabel,
  Paper,
} from "@material-ui/core";
import styles from "./Table.module.css";

function TableHead({ columnGroups, sortColumn, sortDirection, onSortColumn }) {
  return (
    <MaterialTableHead>
      <MaterialTableRow>
        {columnGroups.map((columnGroup, index) => (
          <MaterialTableCell
            key={index}
            colSpan={columnGroup.columns.length}
            align="center"
          >
            {columnGroup.label}
          </MaterialTableCell>
        ))}
      </MaterialTableRow>
      <MaterialTableRow>
        {columnGroups
          .flatMap((columnGroup) => columnGroup.columns)
          .map((column, index) => (
            <MaterialTableCell
              key={index}
              align={column.align}
              sortDirection={sortColumn === column ? sortDirection : false}
            >
              <MaterialTableSortLabel
                active={sortColumn === column}
                direction={sortColumn === column ? sortDirection : "asc"}
                onClick={() => onSortColumn(column)}
              >
                {column.label}
              </MaterialTableSortLabel>
            </MaterialTableCell>
          ))}
      </MaterialTableRow>
    </MaterialTableHead>
  );
}

export default function Table({ rows, columnGroups }) {
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState(columnGroups[0].columns[0]);

  function handleSortColumn(column) {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  const sortedRows = orderBy(rows, sortColumn.getValue, sortDirection);

  return (
    <MaterialTableContainer component={Paper} className={styles.tableContaner}>
      <MaterialTable size="small" className={styles.table}>
        <TableHead
          columnGroups={columnGroups}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortColumn={handleSortColumn}
        />
        <MaterialTableBody>
          {sortedRows.map((row) => (
            <MaterialTableRow key={row.name}>
              {columnGroups
                .flatMap((columnGroup) => columnGroup.columns)
                .map((column, index) => (
                  <MaterialTableCell
                    key={index}
                    align={column.align}
                  >
                    {column.getValue(row)}
                  </MaterialTableCell>
                ))}
            </MaterialTableRow>
          ))}
        </MaterialTableBody>
      </MaterialTable>
    </MaterialTableContainer>
  );
}
