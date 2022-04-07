import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Paper } from "@mui/material";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import ChildTable from "./ChildTable";
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../api/patenTrack2";
import {
  getCustomerTransactions,
  setAssetTypeAssignments,
  setAllAssignments,
  setSelectAssignments,
  setMainCompaniesRowSelect,
  setAssetTypeSelectedRow,
  setAssetTypeCustomerSelectedRow,
  setSelectedAssetsTransactions,
  setSelectedAssetsPatents,
  setAssetsIllustration,
  getSlackMessages,
  setSlackMessages,
  getAssetsAllTransactionsEvents,
  setChildSelectedAssetsTransactions,
  setChildSelectedAssetsPatents,
  getAssetTypeAssignmentAssets,
  setAssetsTransactionsLifeSpan,
  setDriveTemplateFile,
  setTemplateDocument,
  getChannelIDTransaction,
  setChannelID,
  getChannels,
  setMaintainenceAssetsList,
  setAssetTypeAssignmentAllAssets,
  setAssetsIllustrationData,
  setDocumentTransaction
} from "../../../actions/patentTrackActions2";

import {
    setConnectionBoxView,
    setPDFView,
    setPDFFile
  } from "../../../actions/patenTrackActions";

import {
  toggleUsptoMode, 
  toggleFamilyMode,
  toggleFamilyItemMode,
  toggleLifeSpanMode,
  setDriveTemplateFrameMode,
  setTimelineScreen,
  setDashboardScreen
} from "../../../actions/uiActions";

import { updateHashLocation } from "../../../utils/hashLocation";

import { numberWithCommas, capitalize } from "../../../utils/numbers";

import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";

import Loader from "../Loader";

const AssignmentsTable = ({ defaultLoad, type }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [offset, setOffset] = useState(0);
  const [headerRowHeight, setHeaderRowHeight] = useState(47)
  const [rowHeight, setRowHeight] = useState(40);
  const [width, setWidth] = useState(800);
  const [childHeight, setChildHeight] = useState(500);
  const tableRef = useRef();
  const [counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT);
  const [ grandTotal, setGrandTotal ] = useState( 0 )
  const [data, setData] = useState([]);
  const [initialize, setIntialize] = useState(false);
  const [selectedAll, setSelectAll] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [scrollToIndex, setScrollToIndex] = useState(0);
  const [rows, setRows] = useState([]);
  const [childSelected, setCheckedSelected] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  const search_string = useSelector(state => state.patenTrack2.search_string)
  const selectedCompanies = useSelector(
    state => state.patenTrack2.mainCompaniesList.selected,
  );
  const selectedCompaniesAll = useSelector(
    state => state.patenTrack2.mainCompaniesList.selectAll,
  );
  const assetTypesSelected = useSelector(
    state => state.patenTrack2.assetTypes.selected,
  );
  const assetTypesSelectAll = useSelector(
    state => state.patenTrack2.assetTypes.selectAll,
  );
  const assetTypesCompaniesSelected = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selected,
  );
  const assetTypesCompaniesSelectAll = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selectAll,
  );
  const assignmentList = useSelector(
    state => state.patenTrack2.assetTypeAssignments.list,
  );
  const totalRecords = useSelector(
    state => state.patenTrack2.assetTypeAssignments.total_records,
  );
  const assignmentListLoading = useSelector(
    state => state.patenTrack2.assetTypeAssignments.loading,
  );
  const selectedAssetsTransactions = useSelector(
    state => state.patenTrack2.assetTypeAssignments.selected,
  );

  const currentRowSelection = useSelector(
    state => state.patenTrack2.selectedAssetsTransactions
  )

  const selectedAssetsPatents = useSelector(
    state => state.patenTrack2.selectedAssetsPatents,
  );
  const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)
  const slack_channel_list_loading = useSelector(state => state.patenTrack2.slack_channel_list_loading)
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
  const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
  const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
  const channel_id = useSelector(state => state.patenTrack2.channel_id)
  const dashboardScreen = useSelector(state => state.ui.dashboardScreen)

  const COLUMNS = [
    /* {
      width: 29,
      minWidth: 29,
      label: "",
      dataKey: "rf_id",
      role: "radio",
      disableSort: true,
      show_selection_count: true
    }, */
    {
      width: 20,
      minWidth: 20,
      label: "",
      dataKey: "rf_id",
      role: "arrow",      
      disableSort: true,
    },
    {
      width: 110,
      minWidth: 110,
      label: "Transactions",
      headingIcon: 'transactions',
      dataKey: "date",
      align: "left",
      badge: true, 
    },
    {
      width: 40,
      minWidth: 40,
      label: "",
      dataKey: "channel",
      formatCondition: 'rf_id',
      role: 'slack_image',   
      headingIcon: 'slack_image',   
    },
    { 
      width: 70,
      minWidth: 70,
      label: "Assets", 
      dataKey: "assets",
      staticIcon: "",
      format: numberWithCommas,
      align: "center",
      showGrandTotal: true,     
    },
  ];

  const [headerColumns, setHeaderColumns] = useState(COLUMNS)

  useEffect(() => {
    if( selectedCompanies.length > 0  || selectedCompaniesAll === true ) {
      setRows(assignmentList)
      if(assignmentList.length > 0 ) {
        if(selectedAssetsTransactions.length > 0) {
          const excludeSelections = []
          const checkElement = selectedAssetsTransactions.map( transaction => {
            const findIndex = assignmentList.findIndex(row => row.rf_id == transaction)
            if(findIndex === -1) {
              excludeSelections.push(transaction)
            }
          })      
          Promise.all(checkElement)
          if(excludeSelections.length > 0) {        
            const newSelectedTransaction = [...selectedAssetsTransactions]
            const mapSelection = excludeSelections.map( transaction => {
              const findIndex = newSelectedTransaction.findIndex( item => item == transaction)
              if(findIndex !== -1) {
                newSelectedTransaction.splice(findIndex, 1)
              }
            })
            Promise.all(mapSelection)
            dispatch(setSelectAssignments(newSelectedTransaction));
            setSelectItems(newSelectedTransaction)
          }
        }
        if(currentRowSelection.length > 0) {
          const findIndex = assignmentList.findIndex(row => row.rf_id == currentRowSelection[0])
          if(findIndex === -1) {
            setCurrentSelection(null)
            setSelectedRow([])
            dispatch(setSelectedAssetsTransactions([]));
            dispatch(setChannelID(''))
            dispatch(setAssetsIllustration(null))
          }        
        }
      }
    } else {
      setRows([])
      setGrandTotal(0)
    }     
  }, [assignmentList])

  /**
   * Adding channel to transaction list
   */

  useEffect(() => {
    const checkAssetChannel = async () => {
      if(assignmentList.length > 0 && slack_channel_list.length > 0) {
        let findChannel = false, oldAssets = [...assignmentList]
        const promises = slack_channel_list.map( channelAsset => {
          const findIndex = oldAssets.findIndex(rowTransaction => rowTransaction.rf_id.toString().toLowerCase() == channelAsset.name)
          if(findIndex !== -1) {
            oldAssets[findIndex]['channel'] = oldAssets[findIndex].rf_id
            if(findChannel === false) {
              findChannel = true
            }
          }
        })
        await Promise.all(promises)
        if(findChannel === true){
          setRows(oldAssets)
        } 
        
        /**
         * If transaction selected find ChannelID
         */
        if(selectedRow.length > 0) {
          const channelID = findChannelID(selectedRow[0])
          if( channelID != '') {
            dispatch(setChannelID({channel_id: channelID}))
          }
        }
      }
    }    
    checkAssetChannel()
  },[ slack_channel_list, assignmentList, selectedRow])

  useEffect(() => {
   
    if( selectedRow.length > 0 && assignmentList.length > 0) {
      const findIndex = assignmentList.findIndex(rowTransaction => rowTransaction.rf_id === selectedRow[0])
      
      if(findIndex !== -1) {
        setScrollToIndex(findIndex)
      }
    }
  }, [selectedRow])


  useEffect(() => {
    if (channel_id != "" && selectedRow.length > 0) {
      const getSlackToken = getTokenStorage("slack_auth_token_info");
      if (getSlackToken && getSlackToken != "") {
        dispatch(getSlackMessages(selectedRow[0])); 
      } else {
        //alert to user for login with slack to retrieve messages
      }
    }
  }, [dispatch, channel_id, selectedRow]);



  useEffect(() => {
    if(slack_channel_list.length == 0 && slack_channel_list_loading === false) {
      const slackToken = getTokenStorage( 'slack_auth_token_info' )
      if(slackToken && slackToken!= '') {
        let token = JSON.parse(slackToken)
        
        if(typeof token === 'string') {
          token = JSON.parse(token)
          setTokenStorage( 'slack_auth_token_info', token )

        }
        
        if(typeof token === 'object') {
          const { access_token } = token          
          if(access_token && access_token != '') {
            dispatch(getChannels(access_token))
          }
        }
      }      
    }
  }, [slack_channel_list, slack_channel_list_loading])

  useEffect(() => {
    if (currentSelection > 0) { 
      const findIndex = assignmentList.findIndex(
        assignment => parseInt(assignment.rf_id) === parseInt(currentSelection),
      );
      if (findIndex >= 0) {
        setData(
          assignmentList[findIndex]["children"] != undefined &&
            assignmentList[findIndex]["children"]["list"] != undefined
            ? assignmentList[findIndex]["children"]["list"]
            : [],
        );
      }
    } else {
      setData([]);
    }
  }, [currentSelection]);

  useEffect(() => {
    if(selectedCategory == 'correct_details') {
      const cols = [...COLUMNS]
      /* cols[0].role = 'radio' */
      cols.push(
        {
          width: 250,
          minWidth: 250,
          oldWidth: 250,
          draggable: true,
          label: "Assignee",
          staticIcon: "",
          format: capitalize, 
          dataKey: "recorded_company_name",
        },
        {
          width: 300,
          minWidth: 300,
          oldWidth: 300,
          draggable: true,
          label: "Assignee Address", 
          dataKey: "assignee_address",
          staticIcon: "",
          format: capitalize,
          align: "left"
        },
        {
          width: 250,
          minWidth: 250,
          oldWidth: 250,
          draggable: true,
          label: "Correspondence", 
          staticIcon: "",
          format: capitalize,
          dataKey: "cname",
        },
        {
          width: 300,
          minWidth: 300,
          oldWidth: 300,
          draggable: true, 
          label: "Correspondence Address", 
          dataKey: "correspondance_address",
          staticIcon: "",
          format: capitalize,
          align: "left"
        }
      )
      setHeaderColumns(cols)
      setWidth(2000)
    }
  }, [selectedCategory])

  useEffect(() => {
    /* if(selectedAssetsTransactions.length != selectedRow ) {
            setSelectedRow(selectedAssetsTransactions)
        } */
    setCheckedSelected("", selectedAssetsPatents, selectedAssetsPatents.length);
  }, [selectedAssetsPatents]);
/**
 * Delete select item if item is selected from Asset table
 * If assignment table is open again then higlight the previous selected item
 */
  useEffect(() => {
    
    //setSelectedRow(selectedAssetsTransactions);
    
    if (currentRowSelection.length != selectedRow.length  ) {
      setSelectedRow(currentRowSelection); 
    }
  }, [currentRowSelection, selectedRow]);   


  useEffect(() => {
    if( assignmentList.length > 0 ) {
      setGrandTotal(assignmentList[assignmentList.length - 1].grand_total ? assignmentList[assignmentList.length - 1].grand_total : 0)
    } else {
      setGrandTotal( 0 )
    }
  }, [ assignmentList ] )

  useEffect(() => {
    
    if(selectedAssetsTransactions.length > 0 && (selectItems.length == 0 || selectItems.length != selectedAssetsTransactions.length) ){
      setSelectItems(selectedAssetsTransactions)
    }
  }, [ selectedAssetsTransactions, selectItems ]) 



  //incase of search
  useEffect(() => {
    
    if (
      defaultLoad === false &&
      assignmentList.length > 0 &&
      selectedRow.length == 0 &&
      initialize === false
    ) {
      setIntialize(true)
      getTransactionData(dispatch, assignmentList[0].rf_id, defaultLoad) // select first row of transaction table
      dispatch(getAssetTypeAssignmentAssets(assignmentList[0].rf_id, false, 1, search_string)) // send request to get list of assets in the first rf_id
    } else if (
      (search_string == '' || search_string == null) && 
      assignmentList.length > 0 &&
      (selectedRow.length == 1 || selectedAssetsTransactions.length == 1) && 
      selectedAssetsPatents.length == 0 &&
      assetIllustration === null  
      ) {
        getTransactionData(dispatch, selectedAssetsTransactions.length > 0 ? selectedAssetsTransactions[0] : selectedRow[0], defaultLoad) 
    }
  }, [dispatch, assignmentList, defaultLoad, selectedRow, selectedAssetsTransactions, initialize, search_string, selectedAssetsPatents, assetIllustration]);  

  
  useEffect(() => {
    if (defaultLoad === true || defaultLoad === undefined) {
      const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
        tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
        customers =
          assetTypesCompaniesSelectAll === true
            ? []
            : assetTypesCompaniesSelected;
      if (selectedCompaniesAll === true || selectedCompanies.length > 0) {
        if(assignmentList.length === 0) {
          dispatch(
            getCustomerTransactions(
              selectedCategory == '' ? '' : selectedCategory, 
              companies, 
              tabs, 
              customers, 
              false));
        }
        //dispatch(getChannels())
        
      } else {
        dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }));
        setRows([])
        setGrandTotal(0)
      }
    } else if (type != 1) {
      dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }, true))
      setRows([])
      setGrandTotal(0)
    }
  }, [
    dispatch, 
    selectedCompanies,
    selectedCompaniesAll,
    assetTypesSelected,
    assetTypesSelectAll,
    assetTypesCompaniesSelected,
    assetTypesCompaniesSelectAll,
    defaultLoad,
  ]);


  const onHandleSelectAll = useCallback(
    (event, row) => {
      event.preventDefault();
      const { checked } = event.target;
      if (checked === false) {
        setSelectItems([]);
        dispatch(setSelectAssignments([]));
      } else if (checked === true) {
        if (assignmentList.length > 0) {
          let items = [];
          assignmentList.forEach(assignment => items.push(assignment.rf_id));
          setSelectItems(items);
          dispatch(setSelectAssignments(items));
        }
      }
      setSelectAll(checked);
      if(display_clipboard === false) {
        dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
        dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
      }
      dispatch(setAllAssignments(checked));
    },
    [dispatch, assignmentList],
  );

const onHandleClickRow = useCallback(
  (e, row) => {
    e.preventDefault();
    const { checked } = e.target;
    let oldSelection = [...selectItems]
    if(dashboardScreen === true) {
      dispatch(setTimelineScreen(true))
      dispatch(setDashboardScreen(false))
    }
    if(display_clipboard === false) {
      dispatch( setMaintainenceAssetsList( {list: [], total_records: 0}, {append: false} ))
      dispatch( setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }) )
    }
    if (!oldSelection.includes(row.rf_id)) {
      oldSelection = [row.rf_id]     
      dispatch(setChannelID(''))
      dispatch(setSelectedAssetsPatents([]))
      getTransactionData(dispatch, row.rf_id, defaultLoad, search_string)                    
      dispatch(setDriveTemplateFrameMode(false));
      dispatch(setDriveTemplateFile(null));
      dispatch(setTemplateDocument(null));
       
    } else {
      oldSelection = []
    }
    setSelectAll(false);
    setSelectItems(oldSelection)
    dispatch(setSelectAssignments(oldSelection));
    
    history.push({
      hash: updateHashLocation(location, "assignments", oldSelection).join(
          "&",
      ),
    });
    const element = e.target.closest(
      "div.ReactVirtualized__Table__rowColumn",
      );
    let index = -1
    if(element !== null ) {
      index = element.getAttribute("aria-colindex");
    }        
    if (index == 1) {
      if (currentSelection != row.rf_id) {
        setCurrentSelection(row.rf_id);
      } else {
        setCurrentSelection(null);
      }
    } else {
      //toggle to show illustration or timeline
      dispatch(setDocumentTransaction([]))    
      dispatch(setSlackMessages({ messages: [], users: [] }));
      if(!selectedRow.includes(row.rf_id)){
        dispatch(setChannelID(''))
        getTransactionData(dispatch, row.rf_id, defaultLoad, search_string)
        dispatch(setDriveTemplateFrameMode(false));
        dispatch(setDriveTemplateFile(null));
        dispatch(setTemplateDocument(null));
        //dispatch(setDocumentTransaction([]));   
        //dispatch(getChannelIDTransaction(row.rf_id));
      } else {
        dispatch(setChannelID(''))
        setSelectedRow([])
        dispatch(setAssetsIllustration(null))
        dispatch(setAssetsIllustrationData(null))
        dispatch(setSelectedAssetsTransactions([]))
        dispatch(setSelectedAssetsPatents([]))   
        dispatch(
          setPDFFile(
            { 
              document: '',  
              form: '', 
              agreement: '' 
            } 
          )
        )
        dispatch(
          setPDFView(false)
        )
        dispatch(toggleLifeSpanMode(true));
        dispatch(toggleFamilyMode(false));
        dispatch(toggleFamilyItemMode(false));
        //dispatch(setAssetsTransactionsLifeSpan(null, 0, 0, 0, []))
        //dispatch(toggleLifeSpanMode(false))
        //dispatch(toggleFamilyItemMode(false))
      }
    }
  },
  [dispatch, dashboardScreen, selectedCategory, selectItems, currentSelection, selectedRow, defaultLoad, search_string, display_clipboard],
);

const findChannelID = useCallback((rfID) => {
  let channelID = ''
  if(slack_channel_list.length > 0) {
    const findIndex = slack_channel_list.findIndex( channel => channel.name == rfID.toString())

    if( findIndex !== -1) {
      channelID = slack_channel_list[findIndex].id
    }
  }
  return channelID
}, [ slack_channel_list ])

  const getTransactionData = (dispatch, rf_id, defaultLoad, search_string) => {
    setSelectedRow([rf_id]);    
    dispatch(toggleLifeSpanMode(true))
    dispatch(setConnectionBoxView(false));
    dispatch(setPDFView(false));
    dispatch(toggleLifeSpanMode(true));
    dispatch(toggleUsptoMode(false));
    dispatch(toggleFamilyMode(false));
    dispatch(toggleFamilyItemMode(false)); 
    dispatch(setMainCompaniesRowSelect([]));
    dispatch(setAssetTypeSelectedRow([]));
    dispatch(setAssetTypeCustomerSelectedRow([]));
    dispatch(setChildSelectedAssetsTransactions([]));
    dispatch(setChildSelectedAssetsPatents([])); 
    dispatch(setSelectedAssetsPatents([]));
    dispatch(setSelectedAssetsTransactions([rf_id]));
    if(defaultLoad === false){
      dispatch(getAssetTypeAssignmentAssets(rf_id, false, 1, search_string)) // fill assets table 
    }
    dispatch(setAssetsIllustration({ type: "transaction", id: rf_id }));
    //dispatch(getAssetsAllTransactionsEvents(selectedCategory == '' ? '' : selectedCategory, [], [], [], [rf_id]));
    //dispatch(getChannelIDTransaction(rf_id)); 
    const channelID = findChannelID(rf_id)
    if( channelID != '') {
      dispatch(setChannelID({channel_id: channelID}))
    }
  };

  const resizeColumnsWidth = useCallback((dataKey, data) => {
    let previousColumns = [...headerColumns]
    const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

    if( findIndex !== -1 ) {
      previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
      previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
    }
    setHeaderColumns(previousColumns)
  }, [ headerColumns ] )

  const resizeColumnsStop = useCallback((dataKey, data) => {
    let previousColumns = [...headerColumns]
    const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

    if( findIndex !== -1 ) {
      previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width 
    }
    setHeaderColumns(previousColumns)
}, [ headerColumns ] )

  if (assignmentListLoading ) return <Loader />;

  return (
    <Paper className={classes.root} square id={`assets_assignments`}>
      <VirtualizedTable
        classes={classes}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedIndex={currentSelection}
        selectedKey={"rf_id"}
        scrollToIndex={true}
        rows={rows}
        rowHeight={rowHeight}
        headerHeight={headerRowHeight}
        columns={headerColumns}
        onSelect={onHandleClickRow}
        onSelectAll={onHandleSelectAll}
        defaultSelectAll={selectedAll}
        responsive={true}
        collapsable={true}
        childHeight={childHeight}
        childSelect={childSelected}
        childRows={data}
        resizeColumnsWidth={resizeColumnsWidth}
        resizeColumnsStop={resizeColumnsStop}
        childCounterColumn={`assets`}
        showIsIndeterminate={false}
        renderCollapsableComponent={  
          <ChildTable
            transactionId={currentSelection}
            headerRowDisabled={true}
          />
        }
        defaultSortField={`date`}
        defaultSortDirection={`desc`}
        totalRows={totalRecords}
        grandTotal={grandTotal}
        noBorderLines={true}
        width={width}
        containerStyle={{
          width: "100%",
          maxWidth: "100%",
        }}
        style={{
          width: "100%",
        }}
      />
    </Paper>
  );
};

export default AssignmentsTable;
