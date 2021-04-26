import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { TableCell, Avatar } from '@material-ui/core'
import {
  ArrowKeyStepper,
  AutoSizer,
  Column,
  SortDirection,
  Table,
} from "react-virtualized";
import TableRow from "@material-ui/core/TableRow";
import useStyles from "./styles";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import _orderBy  from "lodash/orderBy";
import _sortBy  from "lodash/sortBy";
import useHeaderRenderer from "./hooks/useHeaderRenderer";

const VirtualizedTable = ({
  columns,
  rowHeight,
  onSelect,
  onSelectAll,
  headerHeight,
  selected,
  rows,
  responsive,
  rowSelected,
  selectedIndex,
  selectedKey,
  defaultSelectAll,
  collapsable,
  renderCollapsableComponent,
  width,
  disableRow,
  disableRowKey,
  headerRowDisabled,
  childHeight,
  childSelect,
  childRows,
  childCounterColumn,
  showIsIndeterminate,
  optionalKey,
  totalRows,
  forceChildWaitCall,
  backgroundRow,
  backgroundRowKey,
  defaultSortField,
  defaultSortDirection,
  columnTextBoldList,
  hover,
  onMouseOver,
  ...tableProps
}) => {
  
  const classes = useStyles();
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState([]);
  const [collapseRowHeight, setCollapseRowHeight] = useState(100);
  const rowRef = useRef(null);
  const tableRef = useRef();
  /*useEffect(() => {
    if(collapsable === true && rowSelected.length > 0) {
      setTimeout(() => {
        console.log("Timeout")
        tableRef.current.recomputeRowHeights()
      }, 10000)
    }    
  }, [ tableRef, rowSelected, collapsable ])*/

  useEffect(() => {
    if( defaultSortField != undefined && defaultSortDirection != undefined ) {
      setSortBy(defaultSortField)
      setSortDirection(defaultSortDirection == 'desc' ? SortDirection.DESC : SortDirection.ASC)
    }
  }, [defaultSortField, defaultSortDirection])

  const createSortHandler = useCallback(
    property => () => {
      /* console.log("createSortHandler", property, sortBy, sortDirection) */
      const isAsc = sortBy === property && sortDirection === SortDirection.ASC;
      setSortDirection(isAsc ? SortDirection.DESC : SortDirection.ASC);
      setSortBy(property);
    },
    [sortBy, sortDirection],
  ); 

  const getRowClassName = useCallback(() => {
    return clsx(classes.tableRow, classes.flexContainer, classes.tableRowHover);
  }, [classes]);

  const onChangeColumnFilters = useCallback((columnKey, columnFilters) => {
    const updatedFilter = {
      dataKey: columnKey,
      filters: columnFilters,
    };

    setFilters(prevFilters => {
      const existDataKeys = prevFilters.some(
        ({ dataKey }) => dataKey === columnKey,
      );
      if (existDataKeys) {
        return prevFilters.map(filter =>
          filter.dataKey === columnKey ? updatedFilter : filter,
        );
      }
      return [...prevFilters, updatedFilter];
    });
  }, []);

  const cellRenderer = useCallback(
    ({ cellData, columnIndex, rowData }) => {
      
      const {
        align,
        role,
        format,
        formatCondition,
        formatDefaultValue,
        secondaryFormat,
        staticIcon,
        validation,
        validationKey,
        optionalKey,
        paddingLeft,
        textBold,
        imageURL,
        imageIcon
      } = columns[columnIndex];
      cellData =
        validation === true
          ? validationKey == "empty" && cellData == ""
            ? rowData[optionalKey]
            : cellData
          : cellData;

      const isIndeterminate =
        showIsIndeterminate &&
        collapsable === true &&
        selectedIndex == cellData &&
        childSelect > 0
          ? true
          : false;
      return (
        <TableCell
          component={"div"}
          padding={role === "checkbox" ? "none" : undefined}
          className={clsx(
            classes.tableCell,
            classes.flexContainer,
            disableRow === true && rowData[disableRowKey] === 0
              ? classes.disableColumn
              : "",
            textBold === true && columnTextBoldList.length > 0 && columnTextBoldList.includes(cellData) 
              ? classes.textBold 
              : ''
          )}
          variant="body"
          align={align}
          style={{
            height: rowHeight,
            paddingLeft: paddingLeft != undefined ? paddingLeft : "inherit",
          }}
        >
          {role === "checkbox" ? (
            <Checkbox
              checked={selected.includes(cellData)}
              disabled={
                disableRow === true && rowData[disableRowKey] === 0
                  ? true
                  : false
              } 
              indeterminate={isIndeterminate}
            />
          ) : role === "arrow" ? (
            selectedIndex !== cellData ? (
              <ChevronRightIcon className={"arrow"} />
            ) : (
              <ExpandMoreIcon className={"arrow"} />
            )
          ) : role === 'image'  ? 
              rowData[imageURL] ? 
              <span>
                <Avatar src={rowData[imageURL]} className={classes.small}/><span className={classes.marginLeft}>{cellData}</span>
              </span> 
              :  imageIcon != '' && imageIcon != undefined ? <span><FontAwesomeIcon icon={imageIcon}/><span className={classes.marginLeft}>{cellData}</span></span> : (
                cellData
              )
            : format != undefined ? formatCondition != undefined && rowData[formatCondition] != formatDefaultValue ? staticIcon + secondaryFormat(cellData) : (
            staticIcon + format(cellData)
          ) : (
            cellData
          )}
        </TableCell>
      );
    },
    [
      classes,
      rowHeight,
      selected,
      selectedIndex,
      columns,
      disableRow,
      disableRowKey,
      columnTextBoldList
    ],
  );

  const allSelected = useMemo(
    () =>
      defaultSelectAll === true ||
      (rows.length > 0 && selected.length === rows.length),
    [rows, selected, defaultSelectAll],
  );
  const isIndeterminate = useMemo(
    () => selected.length > 0 && selected.length < rows.length,
    [rows, selected],
  );
  const headerRenderer = useHeaderRenderer(
    rows,
    headerHeight,
    columns,
    createSortHandler,
    onSelectAll,
    allSelected,
    isIndeterminate,
    totalRows,
    onChangeColumnFilters,
  );
  const checkRowCollapse = (collapsable, index, rowData, tableRef) => {
    if (collapsable) {
      tableRef.current.recomputeRowHeights();
      tableRef.current.forceUpdate();
      if (disableRow === false) {
        const rowContainer = tableRef.current.Grid._scrollingContainer.querySelector(
          `div.rowIndex_${index}`,
        );
        if (rowContainer != null) {
          if (
            rowContainer.querySelector(".ReactVirtualized__Table__row") != null
          ) {
            const allRowHeight =
              rowContainer.querySelectorAll(".ReactVirtualized__Table__row")
                .length * rowHeight;
            let updateHeight = childHeight;
            if (allRowHeight < childHeight) {
              updateHeight = allRowHeight + 10;
            }
            setCollapseRowHeight(updateHeight);
            updateNewHeight(500);
          } else {
            waitAndCall(collapsable, index, rowData, tableRef);
          }
        } else {
          waitAndCall(collapsable, index, rowData, tableRef);
        }
      }  
    }
  };
  const updateNewHeight = (time) => {
    setTimeout(() => {
      /* tableRef.current.recomputeRowHeights(index) */
      if(tableRef.current != null) {
        tableRef.current.recomputeRowHeights();
        tableRef.current.forceUpdate();
      }
    }, time);
  };
  const waitAndCall = (collapsable, index, rowData, tableRef) => {
    setTimeout(() => {
      checkRowCollapse(collapsable, index, rowData, tableRef);
    }, 2000);
  };
  const rowRenderer = useCallback(
    ({ className, columns, index, key, rowData, style }) => (
      <>
        <TableRow
          key={key}
          className={`${className} rowIndex_${index}`}
          style={{
            ...style,
            height:
              collapsable === true && selectedIndex == rowData[selectedKey]
                ? disableRow === true
                  ? rowData[disableRowKey] * rowHeight < childHeight
                    ? rowData[disableRowKey] * rowHeight + rowHeight
                    : childHeight + rowHeight
                  : childCounterColumn != undefined
                  ? rowData[childCounterColumn] * rowHeight < childHeight
                    ? rowData[childCounterColumn] * rowHeight + rowHeight
                    : childHeight + rowHeight
                  : collapseRowHeight
                : rowHeight,
            alignItems:
              collapsable === true && selectedIndex == rowData[selectedKey]
                ? "flex-start"
                : "center",
            backgroundColor: 
              backgroundRow === true ? rowData[backgroundRowKey] : 'transparent'
          }}
          component={"div"}
          role={rowData.role}
          onMouseOver = {
            event => {
              hover && onMouseOver(event, rowData, 0)
            }
          }
          onClick={event => {
            onSelect(
              event,
              rowData,
              collapsable === true && selectedIndex == rowData[selectedKey]
                ? 1
                : 0,
            );
            checkRowCollapse(collapsable, index, rowData, tableRef)
            if(forceChildWaitCall != undefined && forceChildWaitCall === true) {
              updateNewHeight(2000)
            }            
          }}          
          selected={
            optionalKey != undefined
              ? rowSelected.includes(rowData[optionalKey])
              : rowSelected != undefined
              ? rowSelected.includes(rowData[selectedKey])
              : selected.includes(rowData.id)
          }
        >
          {columns}
        </TableRow>
        {collapsable === true && selectedIndex == rowData[selectedKey] ? (
          <div
            key={`child_${key}`}
            ref={rowRef}
            style={{
              marginRight: "auto",
              marginLeft: 30,
              height:
                disableRow === true
                  ? rowData[disableRowKey] * rowHeight < childHeight
                    ? rowData[disableRowKey] * rowHeight + rowHeight
                    : childHeight + rowHeight
                  : childCounterColumn != undefined
                  ? rowData[childCounterColumn] * rowHeight < childHeight
                    ? rowData[childCounterColumn] * rowHeight + rowHeight
                    : childHeight + rowHeight
                  : collapseRowHeight,
              display: "flex",
              position: "absolute",
              top: style.top + rowHeight + "px",
              width: "100%",
              overflow: "auto",
            }}
          >
            {renderCollapsableComponent}
          </div>
        ) : (
          ""
        )}
      </>
    ),
    [
      selected,
      hover,
      onMouseOver,
      onSelect,
      rowSelected,
      selectedIndex,
      selectedKey,
      collapsable,
      renderCollapsableComponent,
      collapseRowHeight,
      optionalKey,
      forceChildWaitCall,
      backgroundRow,
      backgroundRowKey,
      childCounterColumn
    ],
  );

  const items = useMemo(() => {
    let filteredRows = rows.filter(row => {
      return filters.every(
        filter =>
          !Array.isArray(filter.filters) ||
          filter.filters.length === 0 ||
          filter.filters.includes(row[filter.dataKey]),
      );
    });
    
       
    return filteredRows.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });
  }, [rows, sortBy, sortDirection, filters]);

  const rowGetter = useMemo(() => ({ index }) => items[index], [items]);

  const getRowHeight = useMemo(
    () => ({ index }) => {
      const rowData = items[index];
      let height = rowHeight
      if (collapsable === true && selectedIndex == rowData[selectedKey]) {
        height = disableRow === true
          ? rowData[disableRowKey] * rowHeight < childHeight
            ? rowData[disableRowKey] * rowHeight + rowHeight
            : childHeight + rowHeight
          : childCounterColumn != undefined
          ? rowData[childCounterColumn] * rowHeight < childHeight
            ? rowData[childCounterColumn] * rowHeight + rowHeight
            : childHeight + rowHeight
          : collapseRowHeight + rowHeight;
      }
      return height
    },
    [
      items,
      collapsable,
      selectedKey,
      selectedIndex,
      rowSelected,
      rowHeight,
      collapseRowHeight,
      childHeight,
      childCounterColumn,
    ],
  );

  return (
    <AutoSizer {...(responsive === false ? "disableWidth" : "")}>
      {({ height, width: tableWidth }) => (
        <Table
          size={"small"}
          ref={tableRef}
          height={height}
          width={responsive === false ? width : tableWidth}
          rowHeight={getRowHeight}
          headerHeight={headerHeight}
          className={`${classes.table} ${
            headerRowDisabled === true ? "disable_header" : ""
          }`}
          rowCount={items.length}
          {...tableProps}
          sortBy={sortBy}
          sortDirection={sortDirection}
          rowRenderer={rowRenderer}
          rowGetter={rowGetter}
          rowClassName={getRowClassName}
        >
          {columns.map(({ dataKey, fullWidth, ...other }, index) => {
            return (
              <Column
                key={dataKey}
                headerRenderer={headerProps =>
                  headerRenderer({
                    ...headerProps,
                    columnIndex: index,
                  })
                }
                className={classes.flexContainer}
                cellRenderer={cellRenderer}
                dataKey={dataKey}
                {...other}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );
};

VirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onSelect: PropTypes.func,
  rowHeight: PropTypes.number,
  rows: PropTypes.array.isRequired,
};

VirtualizedTable.defaultProps = {
  headerHeight: 48,
  rowHeight: 48,
};

export default VirtualizedTable;
