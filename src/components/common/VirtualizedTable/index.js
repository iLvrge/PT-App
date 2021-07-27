import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  faFileCode,
  faFile,  
  faFileImage,
  faFilePdf,
  faFileWord,  
  faFilePowerpoint,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import { TableCell, Avatar } from '@material-ui/core'
import {
  ArrowKeyStepper,
  AutoSizer,
  Column,
  SortDirection,
  Table,
} from "react-virtualized";
import TableRow from "@material-ui/core/TableRow";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import useStyles from "./styles";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
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
  grandTotal,
  forceChildWaitCall,
  backgroundRow,
  backgroundRowKey,
  defaultSortField,
  defaultSortDirection,
  columnTextBoldList,
  hover,
  onMouseOver,
  onDoubleClick,
  openDropAsset,
  dropdownSelections,
  resizeColumnsWidth,
  resizeColumnsStop,
  icon,
  checkedIcon,
  childHeader,
  ...tableProps
}) => {
  const classes = useStyles();
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState([]);
  const [collapseRowHeight, setCollapseRowHeight] = useState(100);
  const [dropdownValue, setDropdownValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [noOfSelectedItems, setNoOfSelectedItems] = useState([])
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

  useEffect(() => {
    setNoOfSelectedItems([...selected])
  }, [ selected ])

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

  const onHandleDropDown = (event, callBack, cellData, rowData) => {
    //setDropdownValue(event.target.value)
    callBack(event, cellData, rowData)
  }

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleDropdownOpen = () => {
    setDropdownOpen(true);
  };

  const getDropValue = (showDropValue, list, width) => {
    const listIndex = list.findIndex( row => row.id == showDropValue )
    if(listIndex !== -1) {
      return (
        <div style={{width: `${width + 10}px`}} className={'selectedIcon'}>
          {
            list[listIndex].icon != '' ? list[listIndex].icon : list[listIndex].image != '' ? <img src={list[listIndex].image} style={{width: '17px', position: 'absolute', left: '7px'}}/> : ''
          }
        </div>
      )
    } else {
      return ''
    }    
  }

  const cellRenderer = useCallback(
    ({ cellData, columnIndex, rowData }) => {
      
      const {
        align,
        role,
        secondaryKey,
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
        imageIcon,
        extension,
        showOnCondition,
        onClick,
        list,
        width,
        style,
        justifyContent,
        selectedFromChild
      } = columns[columnIndex];
      
      let extensionIcon = '', faIcon = ''
      if(role === 'image' && extension === true ) {
        const urlLink = rowData['url_private'] ? rowData['url_private'] : rowData['webViewLink']
        const urlExplode = urlLink != null && urlLink != 'undefined' ? urlLink.split(/[#?]/)[0].split('.').pop().trim() : ''
        extensionIcon = urlExplode == 'pdf' ? 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/pdf_file.svg' : rowData[imageURL] != null ? rowData[imageURL] : ''
        
        if(extensionIcon == '' && faIcon == '') {
          const fileType = rowData['filetype'] ? rowData['filetype'] : 'txt'
          switch(fileType) {
            case 'xml':
              faIcon = faFileCode
              break;
            case 'svg':
            case 'png':
            case 'bmp':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'webp':
              faIcon = faFileImage
              break;
            case 'pdf':
              faIcon = faFilePdf
              break;
            case 'doc':
            case 'docx':
              faIcon = faFileWord
              break;
            case 'xls':
            case 'xlsx':
              faIcon = faFileExcel
              break;
            case 'ppt':
              faIcon = faFilePowerpoint
              break;
            case 'gdoc':
              extensionIcon ='https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document'
              break;
            default:
              faIcon = faFile
              break;
          }
        }
      }
      let showDropValue = ''
      if(role == 'static_dropdown') {
        const index = dropdownSelections.findIndex( r => r.asset == rowData['asset'] )
        if( index !== -1 ) {
          showDropValue =  dropdownSelections[index].move_category
        }
      }
      cellData =
        validation === true
          ? validationKey == "empty" && cellData == ""
            ? rowData[optionalKey]
            : cellData
          : cellData; 

      let isIndeterminate =
        showIsIndeterminate &&
        collapsable === true &&
        selectedIndex == cellData &&
        childSelect > 0
          ? true
          : false;
      if(typeof selectedFromChild !== 'undefined' && selectedFromChild === true) {
        const getChild = JSON.parse(rowData['child'])
        if(getChild.length > 0 ) {
          isIndeterminate = getChild.some(item => selected.includes(item))
        }
      }
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
            justifyContent: typeof style !== 'undefined' && style === true ? justifyContent : "inherit",
            paddingRight: typeof style !== 'undefined' && style === true ? '21px' : "inherit",
            textDecoration: typeof rowData['underline'] !== 'undefined' && rowData['underline'] === true ? 'underline' : 'inherit'
          }}
        >
          {
            
          role == 'slack_image' && cellData == rowData[formatCondition] ?
          (<svg version="1.1" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg>)
          :
          role === 'static_dropdown' ?
          (
            <Select
              labelId='dropdown-open-select-label'
              id='dropdown-open-select'
              IconComponent={(props) => (
                <ExpandMoreOutlinedIcon {...props}/>
              )}
              open={ openDropAsset == cellData ? true : false }
              onClose={handleDropdownClose}
              onOpen={handleDropdownOpen} 
              value={showDropValue}
              onChange={(event) =>  onHandleDropDown(event, onClick, cellData, rowData) }
              renderValue={(value) => getDropValue(value, list, width)}
            >
              {
                list.map( (c, idx) => (
                  <MenuItem key={idx} value={c.id}>
                    {
                      c.icon != '' ? c.icon : c.image != '' ? <img src={c.image} style={{width: '21px'}}/> : ''
                    }
                    <Typography variant="inherit" className={'heading'}> {c.name}</Typography> 
                  </MenuItem> 
                ))
              } 
            </Select>
          )
          :
          role === "checkbox" ? (typeof showOnCondition == 'string' && typeof disableRowKey == 'string' && rowData[disableRowKey] == showOnCondition) ? '' : (
            <Checkbox
              checked={selected.includes(cellData)}
              disabled={
                disableRow === true && rowData[disableRowKey] === 0
                  ? true
                  : false
              } 
              indeterminate={isIndeterminate}
            />
          )
          :
          role === "radio" ? (typeof showOnCondition == 'string' && typeof disableRowKey == 'string' && rowData[disableRowKey] == showOnCondition) ? '' : 
                (
                  <Radio
                    checked={selected.includes(cellData)}
                    disabled={
                      disableRow === true && rowData[disableRowKey] === 0
                        ? true
                        : false
                    } 
                  />
                )     
          : role === "arrow" ? (
            selectedIndex !== cellData ? (
              <ChevronRightIcon className={"arrow"} />
            ) : (
              <ExpandMoreIcon className={"arrow"} />
            )
          ) : role === 'image'  ?  
              extensionIcon != '' ?
              <span className={classes.flexImageContainer}>
                <span className={classes.flexImage}><img src={extensionIcon} className={classes.smallImg}/></span><span className={classes.flexData}>{(cellData == '' || cellData == null || cellData == undefined) && rowData[secondaryKey] != undefined && rowData[secondaryKey] != null ? rowData[secondaryKey] :  cellData }</span>
              </span>  
              :
              faIcon != ''
              ?
              <span><FontAwesomeIcon icon={faIcon}/><span className={classes.marginLeft}>{cellData}</span></span> 
              :
              rowData[imageURL] ? 
              <span className={classes.flex}>
                <span><img src={rowData[imageURL]} className={classes.imgIcon}/></span>{/* <Avatar src={rowData[imageURL]} /> */}<span className={classes.marginLeft}>{cellData}</span>
              </span> 
              :  imageIcon != '' && imageIcon != undefined ? <span><FontAwesomeIcon icon={imageIcon}/><span className={classes.marginLeft}>{cellData}</span></span> : (
                cellData
              )
            : format != undefined ? 
                formatCondition != undefined && rowData[formatCondition] != formatDefaultValue 
                ? 
                  cellData != '' && cellData != undefined && cellData != 'undefined' ? staticIcon + secondaryFormat(cellData) : ''
                : (
                    cellData != '' && cellData != undefined && cellData != 'undefined' ? staticIcon + format(cellData) : ''
                ) : (
                  cellData
                )
          }   
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
      columnTextBoldList,
      openDropAsset,
      dropdownSelections
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
    grandTotal,
    onChangeColumnFilters,
    resizeColumnsWidth,
    resizeColumnsStop,
    icon,
    checkedIcon,
    noOfSelectedItems
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
                  ? typeof childCounterColumn == 'string' ? rowData[childCounterColumn] * rowHeight < childHeight
                    ? rowData[childCounterColumn] * rowHeight + rowHeight + (childHeader === true ? headerHeight : 0)
                    : childHeight + rowHeight + (childHeader === true ? headerHeight : 0)
                    : childCounterColumn * rowHeight + rowHeight + (childHeader === true ? headerHeight : 0)
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
          onDoubleClick = { event => {
            typeof onDoubleClick === 'function' && onDoubleClick(event, rowData)
          }}
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
                  ? typeof childCounterColumn == 'string' ? rowData[childCounterColumn] * rowHeight < childHeight
                    ? rowData[childCounterColumn] * rowHeight + (childHeader === true ? headerHeight : 0)
                    : childHeight 
                    : childCounterColumn * rowHeight + (childHeader === true ? headerHeight : 0)
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
      onDoubleClick,
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
      childCounterColumn,
      childHeader
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
      const sortA = !isNaN(Number(a[sortBy])) ? Number(a[sortBy]) :  sortBy == 'date' ? new Date(a[sortBy]).getTime() : a[sortBy]
      const sortB = !isNaN(Number(b[sortBy])) ? Number(b[sortBy]) :  sortBy == 'date' ? new Date(b[sortBy]).getTime() : b[sortBy]
      if (sortA < sortB) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (sortA > sortB) {
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
            ? rowData[childCounterColumn] * rowHeight + rowHeight + (childHeader === true ? headerHeight : 0)
            : childHeight + rowHeight + (childHeader === true ? headerHeight : 0)
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
      headerHeight,
      childHeader
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
