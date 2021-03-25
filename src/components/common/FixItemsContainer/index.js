import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import useStyles, { useMatStyles } from './styles'
import Grid from '@material-ui/core/Grid'
import FullWidthSwitcher from '../FullWidthSwitcher'
import PerfectScrollbar from 'react-perfect-scrollbar'
import classnames from 'classnames'
import Loader from '../Loader'
import TabsContainer from '../Tabs'
import CustomTab from '../CustomTab'
import Checkbox from '@material-ui/core/Checkbox'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import RecordItemsContainer from '../RecordItemsContainer'

import { getErrorItems, setErrorTabIndex, setCurrentCollectionID,
  setCurrentAsset,
  setCurrentAssetType,
  setIllustrationUrl,
  getComments,
  getAssetsOutsource,
  getAssets,
  getCollectionIllustration,setTimelineTabIndex } from '../../../actions/patenTrackActions'


const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

const  getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator)=>{
  const stabilizedThis = array.map((el, index) => [ el, index ])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const classesMat = useMatStyles()
  const headCells = [
    { id: 'id', numeric: true, disablePadding: false, label: '#' },
    { id: 'asset', numeric: false, disablePadding: false, label: 'Asset' },
    { id: 'comment', numeric: false, disablePadding: false, label: 'Comment' },
    { id: 'firm_name', numeric: false, disablePadding: false, label: 'Company Name' },
    { id: 'telephone', numeric: false, disablePadding: false, label: 'Telephone' },
    { id: 'created_at', numeric: false, disablePadding: false, label: 'Created At' },
  ]


  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow className={classesMat.tablehHeaderRow}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classnames(classesMat.tableHeader) }
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}



function FixItemsContainer(props) {
  const { errorTab, setErrorTabIndex } = props
  const classes = useStyles()
  const isExpanded = props.currentWidget === 'fixItems'
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ toDoFixItemList, setToDoFixItemList ] = useState([])
  const [ sortDate, setSortDate ] = useState('desc')
  const [ sortAsset, setSortAsset ] = useState('desc')
  const [ sortName, setSortName ] = useState('desc')
  const [ itemList, setItemList ] = useState([])
  const [ errorList, setErrorList ] = useState([])
  const [ currentRecords, setCurrentRecords ] = useState(0)
  const [ toDoInventItemList, setToDoInventList ] = useState([]) 
  const [ toDoAssignItemList, setToDoAssignItemList ] = useState([])
  const [ toDoCorrItemList, setToDoCorrItemList ] = useState([])
  const [ toDoAddressItemList, setToDoAddressItemList ] = useState([])
  const [ toDoSecurityItemList, setToDoSecurityItemList ] = useState([])
  
  const classesMat = useMatStyles()
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('Asset')
  const [ page, setPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(5)
  const errorsType = [ 'Uspto', 'Patents', 'Total' ]
  const [ activeRow, setActiveRow ] = useState(null)
  const [ counter, setCounter ] = useState([])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  
  const  sortMe = (e) =>{    
    const col = e.target.getAttribute('data-col')
    const direction = e.target.getAttribute('data-sort')
    const type = e.target.getAttribute('data-type')
    const newItems = [ ...props.errorItemList[type] ]
    switch(col) {
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
          var key = a.name
          var key1 = b.name
          if (key < key1) {
            return direction === 'asc' ? -1 : 1
          }
          if (key > key1) {
            return direction === 'asc' ? 1 : -1
          }
          return 0
        }) 
        break
    }
    console.log('sortMe', e, type ,newItems)
    col === 'created_at' ? setSortDate(direction=== 'asc' ? 'desc' : 'asc') : col === 'asset' ? setSortAsset(direction=== 'asc' ? 'desc' : 'asc') : setSortName(direction=== 'asc' ? 'desc' : 'asc') 
    if(type === 'invent') {
      setToDoInventList(newItems)
    } else if(type === 'assign') {
      setToDoAssignItemList(newItems)
    } else if(type === 'corr') {
      setToDoCorrItemList(newItems)
    } else if(type === 'address') {
      setToDoAddressItemList(newItems)
    } else if(type === 'security') {
      setToDoSecurityItemList(newItems)
    }
  }
  
  function CustomHeader(props){
    return (
      <TableContainer>
        <Table aria-labelledby="Table Heading"
          size={'small'}
          aria-label="Table Heading"
          className={classes.sortTable}
        >
          <TableHead>
            <TableRow>
              <TableCell align="left" onClick={sortMe} data-type={props.type} data-col={'created_at'} data-sort={sortDate}>Date</TableCell>
              <TableCell align="center" onClick={sortMe} data-type={props.type} data-col={'asset'} data-sort={sortAsset}>Asset</TableCell>
              <TableCell align="right" onClick={sortMe} data-type={props.type} data-col={'name'} data-sort={sortName}>Lawyer</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    )
  }

  useEffect(() => {
    let totalRecord = props.errorItemCount.uspto + props.errorItemCount.patent
    setCounter(totalRecord)
    if(props.errorItemList && props.errorItemList['invent'].length > 0){     
      setCurrentRecords(props.errorItemList['invent'].length)      
      setToDoInventList(props.errorItemList['invent'])
    }
    if(props.errorItemList && props.errorItemList['assign'].length > 0){      
      setToDoAssignItemList(props.errorItemList['assign']) 
    }
    if(props.errorItemList && props.errorItemList['corr'].length > 0){      
      setToDoCorrItemList(props.errorItemList['corr'])
    }
    if(props.errorItemList && props.errorItemList['address'].length > 0){      
      setToDoAddressItemList(props.errorItemList['address'])
    }
    if(props.errorItemList && props.errorItemList['security'] &&  props.errorItemList['security'].length > 0){      
      setToDoSecurityItemList(props.errorItemList['security'])
    }
    if(props.assets && props.assets.hasOwnProperty('box')){
      props.setTimelineTabIndex(1)
    }
  },[ props.errorItemList, props.errorItemCount, props.assets, props ])

  const openTimelineIllustration = (event, itemID) => {
    /*console.log("Illustration", event.target.parentElement.parentElement, event.currentTarget);*/
    let pElement =  event.currentTarget
    if(pElement.getAttribute('data-subject') != null && pElement.getAttribute('data-subject') != undefined) {
      setActiveRow(itemID)
      const subject = pElement.getAttribute('data-subject')
      props.setCurrentCollectionID('')
      props.setCurrentAsset(subject)  
      props.setCurrentAssetType(0)
      props.setIllustrationUrl('about:blank')
      props.getComments(0, subject)
      props.getAssetsOutsource(1, subject)  
      props.getAssets(subject)      
    }
  }

  const capitalWord = (value) =>{
    const splitWord = value.toLowerCase().split(' ')
    return splitWord.map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ')
  }

  const renderItemList = ( type ) => {
    const items = type == 'invent' ? toDoInventItemList : type == 'assign' ? toDoAssignItemList : type == 'corr' ? toDoCorrItemList : type == 'address' ? toDoAddressItemList : toDoSecurityItemList
    
    if(!isExpanded) {
      return (
      <div className={`todo-list ${classes.column}`}>
        {
          items
          ?            
          <Table
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="short table"
            className={classes.sortTable}
            stickyHeader
          >   
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ width:'7rem' }} onClick={sortMe} data-type={type} data-col={'created_at'} data-sort={sortDate}>Date</TableCell>
              <TableCell align="left" style={{ width:'7rem' }} onClick={sortMe} data-type={type} data-col={'asset'} data-sort={sortAsset}>Asset</TableCell>
              <TableCell align="left" onClick={sortMe} data-type={type} data-col={'name'} data-sort={sortName}>Lawyer</TableCell>
            </TableRow>
          </TableHead>    
          <TableBody>
            {
              items.map(item => {
				const createdAt = item.created_at != '00/00/0000' ? new Date(item.created_at) : '00-00-0000'
                return (
                  <TableRow hover className={activeRow === item.asset ? classes.active : null} tabIndex={-1} key={item.id} onClick={(event) => openTimelineIllustration(event, item.asset)} data-subject={item.asset}>
                    <TableCell align="left">
                      <span className={`white ${classnames(classes.displayBlock, classes.ellipsis)}`}>{createdAt != '00-00-0000' ? new Intl.DateTimeFormat('en-US').format(createdAt) : '00-00-0000'}</span>
                    </TableCell>
                    <TableCell align="left">                      
                      <span className={`white ${classnames(classes.displayBlock, classes.ellipsis)}`}>{item.asset}</span>
                    </TableCell>
                    <TableCell align="left">
                      <span className={`white ${classnames(classes.displayBlock, classes.ellipsis)}`}><p>{`${capitalWord(item.name)}, ${capitalWord(item.lawyer_name)}`}</p></span>
                    </TableCell>
                  </TableRow>
                )
              })
            }         
          </TableBody>
        </Table>
        :
        ''
        }
      </div>)
    }
    return (
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >            
          </Table>
        </TableContainer>
    )
  }

  let classFull = ''
  if(props.display == 'true'){
    classFull = classes.expandMode
  }

  return (
    <div
      className     = {classes.fixItemsContainer}
      onMouseOver   = {() => {setShowSwitcher(true)}}
      onMouseLeave  = {() => {setShowSwitcher(false)}}
    >
      <div className={classes.container}>
        <div className={classes.context_main}>
          <div className={classes.tableContainer}>
            <div className={`info-box  ${classes.wrapper} ${classFull}`}>
              <Grid container style={{ flexGrow: 1 }}>
                <Grid
                  item lg={12} md={12} sm={12} xs={12}
                  className={classes.flexColumn}
                >
                  {
                    props.isLoading
                    ?
                    <Loader/>
                    :
                    <TableContainer>
                      <Table className={'head_box_table '} size="small" aria-label="a dense table">
                      <TableBody>                    
                          <TableRow key={1}>
                            <TableCell align="center" colSpan={2}>                            
                              <Typography variant="h6" className={'white'}>
                                {`Errors: ${(parseInt(props.errorItemCount.title) + parseInt(props.errorItemCount.address) + parseInt(props.errorItemCount.other)).toLocaleString()}`}
                              </Typography>  
                            </TableCell>
                            <TableCell align="center" className={classes.emptyColumn}></TableCell>  
                            <TableCell align="center" colSpan={2}>
                              <Typography
                                variant="h6"
                                className={'green'}
                              >
                                <span className={classes.fixedSpanWidth60}>
                                  InProcess:&nbsp;
                                </span>
                                <span className={classes.fixedSpanWidth40}>
                                  {props.fixItLoading ? (
                                    <Loader />
                                  ) : (
                                    (parseInt(props.fixItemCount) + parseInt(props.recordItemCount)).toLocaleString()
                                  )}
                                </span>
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow key={2}>
                            <TableCell>
                              <Typography variant="body1" className={'white'} align="left">
                                {'Title: '}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" className={'white'} align="right">
                                {parseInt(props.errorItemCount.title).toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" className={classes.emptyColumn}></TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                className={'white'}
                                align="left"
                              >
                                {'Fix: '}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                className={'green'}
                                align="right"
                              >
                                {props.fixItLoading ? (
                                  <Loader />
                                ) : (
                                  parseInt(props.fixItemCount).toLocaleString()
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>                          
                          <TableRow key={3}>
                            <TableCell>
                              <Typography variant="body1" className={'white'} align="left">
                                {'Address: '}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" className={'white'} align="right">
                                {parseInt(props.errorItemCount.address).toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" className={classes.emptyColumn}></TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                className={'white'}
                                align="left"
                              >
                                {'Record: '}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                className={'green'}
                                align="right"
                              >
                                {props.fixItLoading ? (
                                  <Loader />
                                ) : (
                                  parseInt(props.recordItemCount).toLocaleString()
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>     
                          <TableRow key={4}>
                            <TableCell>
                              <Typography variant="body1" className={'white'} align="left">
                                {'Other: '}
                              </Typography>
                            </TableCell>
                            <TableCell>                            
                              <Typography variant="body1" className={'white'} align="right">
                              {parseInt(props.errorItemCount.other).toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" className={classes.emptyColumn}></TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                className={'white'}
                                align="left"
                              >
                                {'Complete: '}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                className={'green'}
                                align="right"
                              >
                                {props.fixItLoading ? (
                                  <Loader />
                                ) : (
                                  props.recordItemList[
                                    'complete'
                                  ].length.toLocaleString()
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>                  
                        </TableBody>
                      </Table>
                    </TableContainer>
                  }
                </Grid> 
              </Grid>
            </div>          
          </div>  
        </div> 
        {
          errorTab === 0 &&                     
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar                      
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('invent', 0)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          errorTab === 1 &&                     
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('assign', 1)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          errorTab === 2 &&
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('corr', 2)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          errorTab === 3 &&
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('address', 3)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div> 
        }
        {
          errorTab === 4 &&
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('security', 4)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          errorTab === 5 && 
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                  <RecordItemsContainer display={'false'}/>
                </div>
              </div>
            </div>
          </div>
        }
        {
          errorTab === 6 && 
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                  <RecordItemsContainer display={'false'}/>
                </div>
              </div>
            </div>
          </div>
        }
        {
          errorTab === 7 && 
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                  <RecordItemsContainer display={'false'}/>
                </div>
              </div>
            </div>
          </div>
        }
        {
          !isExpanded && (props.screenWidth < 1335 || props.screenHeight < 420)
          ?
            <div style={{ width: '100%' }}>
              <CustomTab
                activeTabId={errorTab}
                setActiveTabId={setErrorTabIndex}
                gapIndex={5}
                tabs={[ 'Invent', 'Assign.', 'Corr', 'Address', 'Security', 'Fix', 'Record', 'Complete' ]}
              />
            </div>
          :
            <TabsContainer
              activeTabId={errorTab}
              setActiveTabId={setErrorTabIndex}
              gapIndex={5}
              tabs={[ 'Invent', 'Assign.', 'Corr', 'Address', 'Security', 'Fix', 'Record', 'Complete' ]}
            />
        }
      </div>      
      <FullWidthSwitcher show={showSwitcher} widget={'fixItems'}/>
    </div>
  )
}

const mapStateToProps = state => {
  const errorItems = state.patenTrack.errorItems
  const recordItems = state.patenTrack.recordItems['2']
  const fixItems = state.patenTrack.recordItems['1']
  return {
    errorItemCount: errorItems && errorItems.count ? errorItems.count : { title: 0, address: 0, other: 0 },
    errorItemList: (errorItems && errorItems.list) ? errorItems.list : { invent: [], assign: [], corr: [], address: [], security: [] },
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
    assets: state.patenTrack.assets,
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.errorItemsLoading,
    fixItLoading: state.patenTrack.recordItemsLoading,
    screenWidth: state.patenTrack.screenWidth,
    screenHeight: state.patenTrack.screenHeight,
    errorTab: state.patenTrack.errorTab,
  }
} 

const mapDispatchToProps = {
  getErrorItems,
  setErrorTabIndex,
  setCurrentCollectionID,
  setCurrentAsset,
  setCurrentAssetType,
  setIllustrationUrl,
  getComments,
  getAssetsOutsource,
  getAssets,
  getCollectionIllustration,
  setTimelineTabIndex
}

export default connect(mapStateToProps, mapDispatchToProps)(FixItemsContainer)