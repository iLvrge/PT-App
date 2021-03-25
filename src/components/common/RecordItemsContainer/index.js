import React, { useState, useEffect, forwardRef } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import MaterialTable from 'material-table'
import { Table, TableBody, TableHead, TableRow, TableCell, Checkbox, Typography, TableContainer } from '@material-ui/core'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons'

import Loader from '../Loader'
import TabsContainer from '../Tabs'
import CustomTab from '../CustomTab'
import useStyles, { useMatStyles } from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import {
  getRecordItems,
  setRecordItTabIndex,
  findRecord,
  completeRecord,
} from '../../../actions/patenTrackActions'

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// function EnhancedTableHead(props) {
//   const { classes, order, orderBy, onRequestSort } = props;
//   const classesMat = useMatStyles();
//   const headCells = [
//     { id: "Id", numeric: true, disablePadding: false, label: "Complete" },
//     { id: "Asset", numeric: false, disablePadding: false, label: "Asset" },
//     {
//       id: "CompanyName",
//       numeric: false,
//       disablePadding: false,
//       label: "Company Name",
//     },
//     { id: "Comment", numeric: false, disablePadding: false, label: "Comment" },
//     {
//       id: "Telephone",
//       numeric: false,
//       disablePadding: false,
//       label: "Telephone",
//     },
//     {
//       id: "CreatedAt",
//       numeric: false,
//       disablePadding: false,
//       label: "Created At",
//     },
//     {
//       id: "EmailAddress",
//       numeric: false,
//       disablePadding: false,
//       label: "EmailAddress",
//     },
//   ];
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow className={classesMat.tablehHeaderRow}>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={"center"}
//             padding={headCell.disablePadding ? "none" : "default"}
//             sortDirection={orderBy === headCell.id ? order : false}
//             className={classnames(classesMat.tableHeader)}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : "asc"}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <span className={classes.visuallyHidden}>
//                   {order === "desc" ? "sorted descending" : "sorted ascending"}
//                 </span>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

function RecordItemsContainer(props) {
  const { recorditTab, setRecordItTabIndex } = props
  const classes = useStyles()
  const isExpanded = props.currentWidget === 'recordItems'
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ sortDate, setSortDate ] = useState('asc')
  const [ sortAsset, setSortAsset ] = useState('asc')
  const [ sortName, setSortName ] = useState('asc')
  const [ fixList, setFixList ] = useState({ todo: [], complete: [] })
  const [ recordList, setRecordList ] = useState({ todo: [], complete: [] })
  const [ toDoFixItemList, setToDoFixItemList ] = useState([])
  const [ toDoRecordItemList, setToDoRecordItemList ] = useState([])
  const [ toDoCompleteItemList, setToDoCompleteItemList ] = useState([])
  const [ activeRow, setActiveRow ] = useState(null)
  const [ checkedValue, setCheckedValue ] = useState(null)
  // MATERIAL UI DATATABLE START

  const [ counter, setCounter ] = useState([])

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  }

  const sortMe = e => {
    const col = e.target.getAttribute('data-col')
    const direction = e.target.getAttribute('data-sort')
    const type = e.target.getAttribute('data-type')
    const bind = e.target.getAttribute('data-bind')
    console.log(col, direction, type, bind)
    let newItems
    if (bind === '0') {
      newItems = [ ...fixList[type] ]
    } else {
      newItems = [ ...recordList[type] ]
    }
    switch (col) {
      case 'created_at':
        newItems.sort((a, b) => {
          var key = new Date(a.created_at)
          var key1 = new Date(b.created_at)
          if (key < key1) {
            return direction === 'asc' ? -1 : 1
          }
          if (key > key1) {
            return direction === 'asc' ? 1 : -1
          }
          return 0
        })
        break
      case 'asset':
        newItems.sort((a, b) => {
          if (a[col] < b[col]) {
            return direction === 'asc' ? -1 : 1
          }
          if (a[col] > b[col]) {
            return direction === 'asc' ? 1 : -1
          }
          return 0
        })
        break
      case 'name':
        newItems.sort((a, b) => {
          var key = a.professionals.first_name
          var key1 = b.professionals.first_name
          if (key < key1) {
            return direction === 'asc' ? -1 : 1
          }
          if (key > key1) {
            return direction === 'asc' ? 1 : -1
          }
          return 0
        })
        break
      default:
        break
    }
    col === 'created_at'
      ? setSortDate(direction === 'asc' ? 'desc' : 'asc')
      : col === 'asset'
      ? setSortAsset(direction === 'asc' ? 'desc' : 'asc')
      : setSortName(direction === 'asc' ? 'desc' : 'asc')

    if (bind === '0') {
      setFixList(
        Object.assign(
          {},
          {
            ...fixList,
            [type]: newItems,
          },
        ),
      )
    } else {
      setRecordList(
        Object.assign(
          {},
          {
            ...recordList,
            [type]: newItems,
          },
        ),
      )
    }
  }

  const columns = [
    { field: 'asset', title: 'Asset' },
    { field: 'name', title: 'Name' },
    { field: 'company_name', title: 'Firm Name' },
    { field: 'telephone', title: 'Telephone' },
    { field: 'comment', title: 'comment' },
    { field: 'created_at', title: 'Created' },
  ]

  useEffect(() => {
    let totalRecord = 0
    if (
      props.fixItemList &&
      (props.fixItemList.todo.length > 0 ||
        props.fixItemList.complete.length > 0)
    ) {
      totalRecord += props.fixItemList.todo.length
      setFixList(props.fixItemList)
      const toDoItems = props.fixItemList.todo.map(item => ({
        id: item.id,
        asset: item.subject,
        name:
          item.professionals !== null
            ? item.professionals.first_name + ' ' + item.professionals.last_name
            : item.users.first_name + ' ' + item.users.last_name,
        comment: item.comment,
        company_name:
          item.professionals !== null
            ? item.professionals.firms.firm_name
            : item.users.organisation.firm_name,
        telephone:
          item.professionals !== null
            ? item.professionals.telephone
            : item.users.telephone,
        created_at: new Intl.DateTimeFormat('en-US').format(
          new Date(item.created_at),
        ),
      }))
      setToDoFixItemList(toDoItems)
    }

    if (
      props.recordItemList &&
      (props.recordItemList.todo.length > 0 ||
        props.recordItemList.complete.length > 0)
    ) {
      totalRecord += props.recordItemList.todo.length
      totalRecord += props.recordItemList.complete.length
      setRecordList(props.recordItemList)
      if (props.recordItemList.todo.length > 0) {
        const toDoRecordItems = props.recordItemList.todo.map(item => ({
          id: item.id,
          asset: item.subject,
          name:
            item.professionals !== null
              ? item.professionals.first_name +
                ' ' +
                item.professionals.last_name
              : item.users.first_name + ' ' + item.users.last_name,
          comment: item.comment,
          company_name:
            item.professionals !== null
              ? item.professionals.firms.firm_name
              : item.users.organisation.firm_name,
          telephone:
            item.professionals !== null
              ? item.professionals.telephone
              : item.users.telephone,
          created_at: new Intl.DateTimeFormat('en-US').format(
            new Date(item.created_at),
          ),
        }))
        setToDoRecordItemList(toDoRecordItems)
      }
      if (props.recordItemList.complete.length > 0) {
        const toDoCompleteItems = props.recordItemList.complete.map(item => ({
          id: item.id,
          asset: item.subject,
          name:
            item.professionals !== null
              ? item.professionals.first_name +
                ' ' +
                item.professionals.last_name
              : item.users.first_name + ' ' + item.users.last_name,
          comment: item.comment,
          company_name:
            item.professionals !== null
              ? item.professionals.firms.firm_name
              : item.users.organisation.firm_name,
          telephone:
            item.professionals !== null
              ? item.professionals.telephone
              : item.users.telephone,
          created_at: new Intl.DateTimeFormat('en-US').format(
            new Date(item.created_at),
          ),
        }))
        setToDoCompleteItemList(toDoCompleteItems)
      }
    }
    setCounter(totalRecord)
    /*console.log("In RECORD", props.errorTab);*/
  }, [ props.fixItemList, props.recordItemList ])

  const openAllData = (ID) => {
    console.log('ID', ID)
    setActiveRow(ID)
    props.findRecord(ID)
  }

  const completeItem = (e, type) => {
    let complete = 0
    if( e.target.checked ) {
      complete = 1
    }
    let formData = new FormData()
    formData.append( 'complete', complete )
    props.completeRecord(formData, e.target.value, type == 0 ? 1 : type)     
  }

  const handleSelectionChange = (rows) => {
    /*const displayedIds = data.results.map(result => result.id)
    const selectedRowsNotDisplayed = selectedRows.filter(selectedRow => {
        return !displayedIds.includes(selectedRow.id)
    })
    setSelectedRows([...selectedRowsNotDisplayed, ...rows]);
    console.log("selectedRows", selectedRows);*/
    console.log('rows', rows)
  }

  const renderItemList = (t, type) => {
    const items = t === 0 ? fixList[type] : recordList[type]
    
    const itemsExpand =
      t === 0
        ? toDoFixItemList
        : t === 2
        ? toDoCompleteItemList
        : toDoRecordItemList
    let selection = true
    if (t === 2 && type === 'complete') {
      selection = false
    }

    if (!isExpanded) {
      return (
        <div className={`todo-list ${classes.column}`}>
          {items ? (
            <Table
              aria-labelledby="tableTitle"
              size={'small'}
              aria-label="short table"
              className={classes.sortTable}
            >
              <TableHead>
                <TableRow>
                <TableCell
                    align="left"
                    style={{ width:'20px' }}
                    data-bind={t}
                    data-type={type}
                  >
                    #
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ width:'7rem' }}
                    onClick={sortMe}
                    data-bind={t}
                    data-type={type}
                    data-col={'created_at'}
                    data-sort={sortDate}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ width:'7rem' }}
                    onClick={sortMe}
                    data-bind={t}
                    data-type={type}
                    data-col={'asset'}
                    data-sort={sortAsset}
                  >
                    Asset
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ width:'7rem' }}
                    onClick={sortMe}
                    data-bind={t}
                    data-type={type}
                    data-col={'name'}
                    data-sort={sortName}
                  >
                    Lawyer
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(item => {
                  const createdAt =
                    type === 'todo'
                      ? new Date(item.created_at)
                      : new Date(item.updated_at)
                  const name =
                    item.professionals !== null
                      ? item.professionals.first_name +
                        ' ' +
                        item.professionals.last_name
                      : item.users.first_name + ' ' + item.users.last_name

                  return (
                    <TableRow hover className={activeRow === item.id ? classes.active : null} tabIndex={-1} key={item.id} onClick={() => openAllData(item.id)}>
                      <TableCell align="left">
                      <Checkbox
                        checked={checkedValue == item.id ? true : (t == 2 && type == 'complete') ? true : false}
                        onChange={(event) => completeItem(event, t)}
                        value={item.id}                        
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                      </TableCell>
                      <TableCell align="left">
                        <span
                          className={`white ${classnames(
                            classes.displayBlock,
                            classes.ellipsis,
                          )}`}
                        >
                          {new Intl.DateTimeFormat('en-US').format(createdAt)}
                        </span>
                      </TableCell>
                      <TableCell align="left">
                        <span
                          className={`white ${classnames(
                            classes.displayBlock,
                            classes.ellipsis,
                            classes.width100,
                          )}`}
                        >
                          {item.subject}
                        </span>
                      </TableCell>
                      <TableCell align="left">
                        <span
                          className={`white ${classnames(
                            classes.displayBlock,
                            classes.ellipsis,
                          )}`}
                        >
                          {name}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            ''
          )}
        </div>
      )
    }
    return (
      <div className={'userSettings'}>
        <MaterialTable
          icons={tableIcons}
          columns={columns}
          data={itemsExpand}
          title=""
          options={{
            paging: false,
            search: false,
            toolbar: false,
            selection: selection,
            draggable: false,
            maxBodyHeight: props.screenHeight - (props.screenHeight * 20) / 100,
            rowStyle: rowData => ({
              backgroundColor: rowData.tableData.checked ? '#000' : '',
              color: rowData.tableData.checked ? 'white' : '',
            }),
          }}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    )
  }

  return (
    <>
      {props.errorTab === 5 && (
        <div className={classes.context}>
          <div className={classes.tableContainer}>
            <div className={`info-box userSettings ${classes.wrapper}`}>
              <div className={classes.scrollbar}>
                {props.isLoading ? (
                  <Loader />
                ) : (
                  <PerfectScrollbar
                    options={{
                      suppressScrollX: true,
                      minScrollbarLength: 20,
                      maxScrollbarLength: 25,
                    }}
                  >
                    {renderItemList(0, 'todo')}
                  </PerfectScrollbar>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {props.errorTab === 6 && (
        <div className={classes.context}>
          <div className={classes.tableContainer}>
            <div className={`info-box userSettings ${classes.wrapper}`}>
              <div className={classes.scrollbar}>
                {props.isLoading ? (
                  <Loader />
                ) : (
                  <PerfectScrollbar
                    options={{
                      suppressScrollX: true,
                      minScrollbarLength: 20,
                      maxScrollbarLength: 25,
                    }}
                  >
                    {renderItemList(1, 'todo')}
                  </PerfectScrollbar>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {props.errorTab === 7 && (
        <div className={classes.context}>
          <div className={classes.tableContainer}>
            <div className={`info-box userSettings ${classes.wrapper}`}>
              <div className={classes.scrollbar}>
                {props.isLoading ? (
                  <Loader />
                ) : (
                  <PerfectScrollbar
                    options={{
                      suppressScrollX: true,
                      minScrollbarLength: 20,
                      maxScrollbarLength: 25,
                    }}
                  >
                    {renderItemList(2, 'complete')}
                  </PerfectScrollbar>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const mapStateToProps = state => {
  const recordItems = state.patenTrack.recordItems['2']
  const fixItems = state.patenTrack.recordItems['1']
  return {
    recordItemCount:
      recordItems && recordItems.count ? recordItems.count[0].count_items : 0,
    recordItemList:
      recordItems && recordItems.list
        ? recordItems.list
        : { todo: [], complete: [] },
    fixItemCount:
      fixItems && fixItems.count ? fixItems.count[0].count_items : 0,
    fixItemList:
      fixItems && fixItems.list ? fixItems.list : { todo: [], complete: [] },
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.recordItemsLoading,
    screenWidth: state.patenTrack.screenWidth,
    screenHeight: state.patenTrack.screenHeight,
    recorditTab: state.patenTrack.recorditTab,
    errorTab: state.patenTrack.errorTab,
  }
}

const mapDispatchToProps = {
  getRecordItems,
  setRecordItTabIndex,
  findRecord,
  completeRecord,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecordItemsContainer)
