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
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { TableCell, Avatar, Modal, ListItemText, ListItemIcon } from '@mui/material'
import {
  ArrowKeyStepper,
  AutoSizer,
  Column,
  SortDirection,
  Table,
  InfiniteLoader
} from "react-virtualized";
import TableRow from "@mui/material/TableRow";
import Select from '@mui/material/Select'; 
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import useStyles from "./styles";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import Rating from '@mui/material/Rating';
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
  selectedGroup,
  rows,
  responsive,
  rowSelected,
  selectedIndex,
  selectedKey,
  defaultSelectAll,
  collapsable,
  childInModal,
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
  grandTotalAssets,
  forceChildWaitCall,
  backgroundRow,
  backgroundRowKey,
  defaultSortField,
  defaultSortDirection,
  columnTextBoldList,
  hover,
  handleModalClose,
  onMouseOver,
  onMouseOut,
  onDoubleClick,
  openDropAsset,
  dropdownSelections,
  resizeColumnsWidth,
  resizeColumnsStop,
  icon,
  checkedIcon,
  childHeader,
  scrollToIndex,
  getMoreRows,
  onScrollTable,
  scrollTop,
  selectItemWithArrowKey,
  sortMultiple,
  sortMultipleConditionColumn,
  sortDataLocal,
  sortDataFn,
  noBorderLines,
  highlightRow,
  higlightColums,
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
  /* const [currentScrollIndex, setcurrentScrollIndex] = useState(0) */
  const rowRef = useRef(null);
  const tableRef = useRef();
  const containerRef = useRef(null);
  let currentScrollIndex = 0
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
      setSortDirection(defaultSortDirection == 'DESC' ? SortDirection.DESC : SortDirection.ASC)
    }
  }, [defaultSortField, defaultSortDirection])

  useEffect(() => {
    setNoOfSelectedItems([...selected])
  }, [ selected ])  

  const createSortHandler = useCallback(
    property => () => {
      /* console.log("createSortHandler", property, sortBy, sortDirection) */ 
      const isAsc = sortBy === property && sortDirection === SortDirection.ASC
      if(typeof sortDataLocal !== 'undefined' && typeof sortDataFn !== 'undefined' && property != 'channel') {
        sortDataFn(isAsc ? SortDirection.DESC : SortDirection.ASC, property)
      } else {
        setSortDirection(isAsc ? SortDirection.DESC : SortDirection.ASC);
        setSortBy(property);
      }
      if(collapsable === true && selectedIndex !== null) {
        updateNewHeight(100)
      }
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

  const onHandleRating = (event, callBack, newValue, cellData, rowData) => {
    callBack(event, newValue, cellData, rowData)
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
        <div /* style={{width: `${width + 10}px`}} */ className={'selectedIcon'}>
          {
            list[listIndex].icon != '' ? list[listIndex].icon : list[listIndex].image != '' ? <img src={list[listIndex].image} style={{width: '1.3rem', position: 'absolute', left: '0px'}}/> : showDropValue
          }
        </div>
      )
    } else {
      return (
        <KeyboardArrowDown />
      )
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
        paddingRight,
        textBold,
        imageURL,
        imageIcon,
        extension,
        showOnCondition,
        disableColumnKey,
        onClick,
        list,
        width,
        styleCss,
        justifyContent,
        fontSize,
        selectedFromChild,
        classCol,
        enable,
        show
      } = columns[columnIndex];
      
      let extensionIcon = '', faIcon = '', selectedRow = false
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
      let showDropValue = -1
      if(role == 'static_dropdown') {
        const index = dropdownSelections.findIndex( r => r.asset == rowData['asset'] )
        if( index !== -1 ) {
          showDropValue =  dropdownSelections[index].move_category
        }
      }
      
      cellData =
        validation === true
          ? validationKey == "empty" && cellData == "" && cellData != null 
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
      let checkedIsInderminateCheckbox = false
      if(typeof selectedFromChild !== 'undefined' && selectedFromChild === true) {        
        const getChild = JSON.parse(rowData['child'])
        if(getChild.length > 0 ) {
          isIndeterminate = getChild.some(item => selected.includes(parseInt(item)))
          if(isIndeterminate) {
            const findItems = getChild.filter(item => selected.includes(parseInt(item)))
            if(findItems.length  === getChild.length) {
              isIndeterminate = false
              checkedIsInderminateCheckbox = true
            }
          }
        }
      }
      
      if(((selected !== undefined && selectedKey !== undefined && selected.includes(rowData[selectedKey])) || selected.includes(rowData.id))  && highlightRow !== undefined && highlightRow === true  && higlightColums.includes(columnIndex)) {
        selectedRow = true
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
              : '',
            typeof showOnCondition == 'string' && typeof classCol !== 'undefined' && typeof disableRowKey == 'string' && rowData[disableRowKey] == showOnCondition ? '' : classCol,
            selectedRow === true && (selectedKey !== undefined && rowSelected !== undefined && rowSelected.includes(rowData[selectedKey])) ? 'highlightColumn' : ''
          )}
          variant="body"
          align={align}  
          style={{
            height: rowHeight,
            paddingLeft: paddingLeft != undefined ? paddingLeft : "inherit",
            justifyContent: typeof styleCss !== 'undefined' && styleCss === true ? justifyContent : "inherit",
            paddingRight: typeof paddingRight !== 'undefined' ? paddingRight : "inherit",
            textDecoration: typeof rowData['underline'] !== 'undefined' && rowData['underline'] === true ? 'underline' : 'inherit',
          }}
        >
          {
            typeof enable !== 'undefined' && enable === false
            ?
              ''
            :
            role == 'slack_image' && (rowData[formatCondition] != undefined && (cellData == rowData[formatCondition] || cellData == rowData[formatCondition].toString().replace(/ /g,'').toLowerCase())) ?
            (<svg version="1.1" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg>)
            :
            role === 'rating' ?
            (
              <Rating
                name="virtual-rating"
                value={cellData}
                onChange={(event, newValue) => onHandleRating(event, onClick, newValue, cellData, rowData) }
              />
            )
            :  
            role === 'static_dropdown' ?
            (
              <Select
                labelId='dropdown-open-select-label'
                id='dropdown-open-select'
                IconComponent={(props) => (
                  openDropAsset == cellData ? <ExpandLessIcon {...props} /> : <ExpandMoreOutlinedIcon {...props}/>
                )}
                open={ openDropAsset == cellData ? true : false }
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null
                }}
                onClose={handleDropdownClose}
                onOpen={handleDropdownOpen} 
                value={showDropValue}
                onChange={(event) =>  onHandleDropDown(event, onClick, cellData, rowData) }
                renderValue={(value) => getDropValue(value, list, width)}

              >
                {
                  list.map( (c, idx) => (
                    <MenuItem key={idx} value={c.id} className={clsx(`iconItem`, {['visibilityHidden']: c.id === -1 ? true : false})}>
                      <ListItemIcon>
                        {
                          c.icon != '' ? c.icon : c.image != '' ? <img src={c.image} style={{width: '21px'}}/> : ''
                        }
                      </ListItemIcon>
                      <ListItemText className={'heading'}>{c.name}</ListItemText>
                    </MenuItem> 
                  ))
                }  
              </Select>
            )
            :
            role === "checkbox" ? (typeof showOnCondition == 'string' && typeof disableRowKey == 'string' && rowData[disableRowKey] == showOnCondition) ? '' : (
              <Checkbox
                checked={checkedIsInderminateCheckbox === true ? checkedIsInderminateCheckbox : selected.includes(cellData) }
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
            : role === "arrow" ? (typeof showOnCondition == 'string' && typeof disableRowKey == 'string' && (rowData[disableColumnKey] == showOnCondition) /* rowData[disableRowKey] == showOnCondition */) ? '' :(
              selectedIndex !== cellData ? (
                <ChevronRightIcon className={"arrow"}  style={{width: '1.5rem'}} />
              ) : (
                <ExpandMoreIcon className={"arrow"} style={{width: '1.5rem'}} />
              )
            ) : role === 'image'  ?  
                extensionIcon != '' ?
                <span className={classes.flexImageContainer}>
                  <span className={classes.flexImage}><img src={extensionIcon} className={classes.smallImg}/></span>
                  {
                    typeof show !== 'undefined' && show === false 
                    ?
                      ''
                    :
                      <span className={classes.flexData}>{(cellData == '' || cellData == null || cellData == undefined) && rowData[secondaryKey] != undefined && rowData[secondaryKey] != null ? rowData[secondaryKey] :  cellData }</span>
                  }
                </span>  
                :
                faIcon != ''
                ?
                  <span><FontAwesomeIcon icon={faIcon}/><span className={classes.marginLeft}>{cellData}</span></span> 
                :
                rowData[imageURL] ? 
                <span className={classes.flexImageContainer}>
                  <span className={classes.flex}><img src={rowData[imageURL]} className={classes.imgIcon}/></span>{/* <Avatar src={rowData[imageURL]} /> */}<span className={`${classes.marginLeft} ${classes.flex}`}>{cellData}</span>
                </span> 
                :  imageIcon != '' && imageIcon != undefined ? <span><FontAwesomeIcon icon={imageIcon}/><span className={classes.marginLeft}>{cellData}</span></span> : (
                  cellData
                )
              : format != undefined 
              ? 
                formatCondition != undefined && rowData[formatCondition] != formatDefaultValue 
                ? 
                  <span>{cellData != '' && cellData != undefined && cellData != 'undefined' ? staticIcon + secondaryFormat(cellData) : ''}</span>
                : (
                  <span>{cellData != '' && cellData != undefined && cellData != 'undefined' ? staticIcon + format(cellData) : ''}</span>
                ) 
              : cellData != '' ? (
                  <span>{cellData}</span>
                )
              : ''
          }
        </TableCell> 
      );
    },
    [
      classes,
      rowHeight,
      selected,
      selectedIndex,
      rowSelected,
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
    grandTotalAssets,
    onChangeColumnFilters,
    resizeColumnsWidth,
    resizeColumnsStop,
    icon,
    checkedIcon,
    noOfSelectedItems,
    selectedGroup
  );
  const checkRowCollapse = (childInModal, collapsable, index, rowData, tableRef) => { 
    if (collapsable && typeof childInModal === 'undefined') { 
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
            updateNewHeight(499);
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
  const waitAndCall = (childInModal, collapsable, index, rowData, tableRef) => {
    setTimeout(() => {
      checkRowCollapse(childInModal, collapsable, index, rowData, tableRef);
    }, 2000);
  };
  const rowRenderer = useCallback(
    ({ className, columns, index, key, rowData, style }) => { 
      let childComponent = '', selectedRow = false
      if(collapsable === true && selectedIndex == rowData[selectedKey]) {
        const positions = tableRef.current.Grid._scrollingContainer.parentElement.getBoundingClientRect()
        childComponent = (
          <div
            key={`child_${key}`} 
            ref={rowRef}
            style={{
              marginRight: "auto",
              marginLeft: typeof childInModal === 'undefined' ? 18 : 0,
              height:
                disableRow === true
                ?
                  childCounterColumn != undefined
                  ?
                    typeof childCounterColumn == 'string' 
                    ? 
                      rowData[childCounterColumn] * rowHeight < childHeight
                      ?
                        rowData[childCounterColumn] * rowHeight + (childHeader === true ? headerHeight : 0) 
                      :  
                        childHeight - rowHeight
                    :
                      childCounterColumn * rowHeight + (childHeader === true ? headerHeight : 0)
                  :
                    rowData[disableRowKey] * rowHeight < childHeight
                    ? 
                      rowData[disableRowKey] * rowHeight + rowHeight
                    :
                      childHeight + rowHeight
                : collapseRowHeight,
              display: "flex",
              position: "absolute",
              top: typeof childInModal === 'undefined' ? style.top + rowHeight + "px" : '0px',
              width: "100%",
              overflow: "auto",
            }} 
          >
            {renderCollapsableComponent}
          </div>
        )
        if(typeof childInModal !== 'undefined' && childInModal === true) {
          childComponent =  (
            <Modal
              open={true}
              onClose={handleModalClose}
            >
              <div style={{width: 250, height: 300, position: 'absolute', top: positions.top + headerHeight + style.top + "px", left: positions.left + style.width + "px", overflow: 'hidden auto', background: '#424242', padding: 10}}>
                {
                  childComponent
                }
              </div>
            </Modal>
          )
        }
      }
      if((optionalKey !== undefined && rowSelected !== undefined && rowSelected.includes(rowData[optionalKey])) || (selectedKey !== undefined && rowSelected !== undefined && rowSelected.includes(rowData[selectedKey])) || (selected !== undefined && selectedKey !== undefined && highlightRow !== undefined && highlightRow === true && selected.includes(rowData[selectedKey])) || (selected !== undefined && selectedKey !== undefined && selected.includes(rowData[selectedKey]))) {
        selectedRow = true
      }  
      /* console.log("selectedRow", selected, selectedKey, rowData) */
      return (      
        <React.Fragment key={key}>
        <TableRow
          className={clsx(className, `rowIndex_${index}`, {['noBorderLines']: typeof noBorderLines !== 'undefined' ? true : false}, { ['highlightRow']: highlightRow !== undefined && highlightRow === true && selected !== undefined && selectedKey !== undefined && selected.includes(rowData[selectedKey]) ? true : false }, {['highlightWithCol']: highlightRow !== undefined && highlightRow === true &&  !selected.includes(rowData[selectedKey]) && ( (optionalKey !== undefined && rowSelected !== undefined && rowSelected.includes(rowData[optionalKey])) || (selectedKey !== undefined && rowSelected !== undefined && rowSelected.includes(rowData[selectedKey]))) ? true : false }) }
          style={{
            ...style,
            height:
              collapsable === true && selectedIndex == rowData[selectedKey]
                ? disableRow === true
                  ? 
                    childCounterColumn != undefined
                    ?
                      typeof childCounterColumn == 'string' 
                      ? 
                        rowData[childCounterColumn] * rowHeight < childHeight
                        ?
                          rowData[childCounterColumn] * rowHeight + (childHeader === true ? headerHeight : 0) 
                        :  
                          childHeight + rowHeight
                      :
                        childCounterColumn * rowHeight + (childHeader === true ? headerHeight : 0)
                    :
                      rowData[disableRowKey] * rowHeight < childHeight
                      ? 
                        rowData[disableRowKey] * rowHeight + rowHeight
                      :
                        childHeight + rowHeight
                    : collapseRowHeight
                : rowHeight,
            alignItems:
              collapsable === true && selectedIndex == rowData[selectedKey]
                ? "flex-start"
                : "center",
            backgroundColor:  
              backgroundRow === true ? rowData[backgroundRowKey] : '',
           
          }}
          component={"div"}
          role={rowData.role}
          onMouseOver = {
            event => {
              hover && onMouseOver(event, rowData, 0)
            }
          } 
          onMouseOut = {
            event => {
              hover && onMouseOut(event, rowData, 0)
            }
          }
          onDoubleClick = { event => {
            typeof onDoubleClick === 'function' && onDoubleClick(event, rowData)
          }}
          onClick={event => {
            currentScrollIndex = index            
            onSelect(
              event,
              rowData,
              collapsable === true && selectedIndex == rowData[selectedKey]
                ? 1
                : 0,
            );
            checkRowCollapse(childInModal, collapsable, index, rowData, tableRef)
            if(forceChildWaitCall != undefined && forceChildWaitCall === true) {
              updateNewHeight(2000)
            }            
          }}          
          selected={selectedRow}
        >
          {columns}
        </TableRow>
        {
          childComponent
        }
      </React.Fragment>
    )
  },
    [
      selected,
      hover,
      onMouseOver,
      onMouseOut,
      onDoubleClick,
      onSelect,
      rowSelected,
      selectedIndex,
      selectedKey,
      collapsable,
      childInModal,
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
    if(typeof sortDataLocal !== 'undefined' && sortDataLocal === false && sortBy != 'channel') {
      return filteredRows
    } else {
      if(typeof sortMultiple !== 'undefined' && typeof sortMultipleConditionColumn !== 'undefined' && sortMultiple === true && sortBy === sortMultipleConditionColumn[0]) {
        filteredRows.sort(function (a, b) {
          if(a['asset_type'] == 0 && b['asset_type'] == 0) {
            const sortA = !isNaN(Number(a[sortBy])) ? Number(a[sortBy]) :  sortBy == 'date' ? new Date(a[sortBy]).getTime() : a[sortBy]
            const sortB = !isNaN(Number(b[sortBy])) ? Number(b[sortBy]) :  sortBy == 'date' ? new Date(b[sortBy]).getTime() : b[sortBy]
            
            if (sortA < sortB) {
              return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (sortA > sortB) {
              return sortDirection === SortDirection.ASC ? 1 : -1;
            }
            return 0;
          } else {
            return 0
          }
        });
        return filteredRows.sort(function (a, b) {
          if(a['asset_type'] == 1 && b['asset_type'] == 1) {
            const sortA = !isNaN(Number(a[sortBy])) ? Number(a[sortBy]) :  sortBy == 'date' ? new Date(a[sortBy]).getTime() : a[sortBy]
            const sortB = !isNaN(Number(b[sortBy])) ? Number(b[sortBy]) :  sortBy == 'date' ? new Date(b[sortBy]).getTime() : b[sortBy]
            
            if (sortA < sortB) {
              return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (sortA > sortB) {
              return sortDirection === SortDirection.ASC ? 1 : -1;
            }
            return 0;
          } else {
            return 0
          }
        });
      } else {        
        return filteredRows.sort((a, b) => {
          const sortA = !isNaN(Number(a[sortBy])) && sortBy != 'channel' ? Number(a[sortBy]) :  sortBy == 'date' ? new Date(a[sortBy]).getTime() : a[sortBy]
          const sortB = !isNaN(Number(b[sortBy])) && sortBy != 'channel' ? Number(b[sortBy]) :  sortBy == 'date' ? new Date(b[sortBy]).getTime() : b[sortBy]
          
          if (sortA < sortB && sortA != undefined && sortB != undefined) {
            return sortDirection === SortDirection.ASC ? -1 : 1;
          }
          if (sortA > sortB && sortA != undefined && sortB != undefined) {
            return sortDirection === SortDirection.ASC ? 1 : -1;
          }
          return 0;
        });
      }
    }        
  }, [rows, sortBy, sortDirection, filters]);



  const rowGetter = useMemo(() => ({ index }) => items[index], [items]);

  const getRowHeight = useMemo(
    () => ({ index }) => {
      const rowData = items[index];
      let height = rowHeight
      if (collapsable === true && selectedIndex == rowData[selectedKey] && typeof childInModal === 'undefined') {
        height = 
          disableRow === true
          ?
            childCounterColumn != undefined
            ?
              typeof childCounterColumn == 'string' 
              ? 
                rowData[childCounterColumn] * rowHeight < childHeight
                ?
                  rowData[childCounterColumn] * rowHeight + (childHeader === true ? headerHeight : 0) 
                :  
                  childHeight
              :
                childCounterColumn * rowHeight + (childHeader === true ? headerHeight : 0)
            :
              rowData[disableRowKey] * rowHeight < childHeight
              ? 
                rowData[disableRowKey] * rowHeight + rowHeight
              :
                childHeight + rowHeight
          : collapseRowHeight + rowHeight;
      }
      return height
    },
    [
      items,
      collapsable,
      childInModal,
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

  const getSelectedItemIndex = useMemo(() => {
    let findIndex = -1
    if( typeof rowSelected !== 'undefined' && typeof items !== 'undefined' && rowSelected.length > 0 && items.length > 0) {
      findIndex = items.findIndex(row => row[selectedKey] === rowSelected[0])
    }
    return findIndex
  }, [items, rowSelected, selectedKey])
  

  const isRowLoaded =  ({ index }) => {
    return !!items[index]
  } 

  const loadMoreRows = ({ startIndex, stopIndex }) => { 
    if(typeof getMoreRows !== 'undefined') {
      getMoreRows(startIndex, stopIndex)
    }    
  } 

  const onScroll = ({scrollTop}) => {
    if(typeof onScrollTable !== 'undefined') {
      onScrollTable(scrollTop)
    }
  }
  return (
    <div ref={containerRef} className={classes.tableRootContainer}>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}  
        rowCount={totalRows}
        minimumBatchSize={500}
        threshold={500}
      >
        {({ onRowsRendered, registerChild }) => (
        <AutoSizer {...(responsive === false ? "disableWidth" : "")} ref={registerChild}>
          {({ height, width: tableWidth }) => (
            <Table
              size={"small"}            
              ref={tableRef}  
              height={height}
              width={responsive === false ? width : tableWidth}            
              rowHeight={getRowHeight}
              headerHeight={headerHeight}
              {...(typeof scrollTop !== 'undefined'  ? {scrollTop: scrollTop} : {})}   
              onRowsRendered={onRowsRendered}
              className={`${classes.table} ${
                headerRowDisabled === true ? "disable_header" : ""
              }`}
              rowCount={items.length}
              /* {...(typeof scrollToIndex !== 'undefined' && scrollToIndex === true ? {scrollToIndex: getSelectedItemIndex} : {})}    */
              scrollToIndex={ scrollToIndex === true ? getSelectedItemIndex : currentScrollIndex}                     
              {...tableProps}
              sortBy={sortBy}
              sortDirection={sortDirection}  
              rowRenderer={rowRenderer}
              rowGetter={rowGetter}
              rowClassName={getRowClassName}
              onScroll={onScroll}
            >
              {columns.map(({ dataKey, fullWidth, style, ...other }, index) => {
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
        )}
      </InfiniteLoader>
    </div>
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
