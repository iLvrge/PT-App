import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Paper } from "@material-ui/core";
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
  getAssetsAllTransactionsEvents,
  setChildSelectedAssetsTransactions,
  setChildSelectedAssetsPatents,
  getAssetTypeAssignmentAssets,
  setAssetsTransactionsLifeSpan,
  setDriveTemplateFile,
  setTemplateDocument,
  getChannelIDTransaction,
  setChannelID,
  getChannels
} from "../../../actions/patentTrackActions2";

import {
    setConnectionBoxView,
    setPDFView,
  } from "../../../actions/patenTrackActions";

import {
  toggleUsptoMode, 
  toggleFamilyMode,
  toggleFamilyItemMode,
  toggleLifeSpanMode,
  setDriveTemplateFrameMode
} from "../../../actions/uiActions";

import { updateHashLocation } from "../../../utils/hashLocation";

import { numberWithCommas } from "../../../utils/numbers";

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
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);

  const COLUMNS = [
    {
      width: 29,
      minWidth: 29,
      label: "",
      dataKey: "rf_id",
      role: "checkbox",
      disableSort: true,
    },
    {
      width: 15,
      minWidth: 15,
      label: "",
      dataKey: "rf_id",
      role: "arrow",
      disableSort: true,
    },
    {
      width: 100,
      minWidth: 100,
      label: "Transactions",
      dataKey: "date",
      align: "left",
      badge: true,
    },
    {
      width: 22,
      minWidth: 22,
      label: "",
      dataKey: "channel",
      formatCondition: 'asset',
      role: 'slack_image',      
    },
    {
      width: 100,
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
    setRows(assignmentList)
  }, [assignmentList])

  /**
   * Adding channel to transaction list
   */

  useEffect(() => {
    const checkAssetChannel = async () => {
      if(assignmentList.length > 0 && slack_channel_list.length > 0) {
        let findChannel = false, oldAssets = [...assignmentList]
        const promises = slack_channel_list.map( channelAsset => {
          const findIndex = oldAssets.findIndex(rowTransaction => rowTransaction.rf_id == channelAsset)
          if(findIndex !== -1) {
            oldAssets[findIndex]['channel'] = channelAsset
            if(findChannel === false) {
              findChannel = true
            }
          }
        })
        await Promise.all(promises)
        if(findChannel === true){
          setRows(oldAssets)
        }      
      }
    }    
    checkAssetChannel()
  },[ slack_channel_list, assignmentList])

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
      cols[0].role = 'radio'
      cols.push(
        {
          width: 150,
          label: "Recorded Company", 
          dataKey: "recorded_company_name",
        },
        {
          width: 150,
          label: "Recorded Correspondence", 
          dataKey: "cname",
        }
      )
      setHeaderColumns(cols)
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
    }
  }, [dispatch, assignmentList, defaultLoad, selectedRow, initialize, search_string]);
  

  useEffect(() => {
    if (defaultLoad === true || defaultLoad === undefined) {
      const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
        tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
        customers =
          assetTypesCompaniesSelectAll === true
            ? []
            : assetTypesCompaniesSelected;
      if (selectedCompaniesAll === true || selectedCompanies.length > 0) {
        dispatch(
          getCustomerTransactions(
            selectedCategory == '' ? '' : selectedCategory, 
            companies, 
            tabs, 
            customers, 
            false));
        dispatch(getChannels())
        
      } else {
        dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }));
      }
    } else if (type != 1) {
      dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }, true));
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
      dispatch(setAllAssignments(checked));
    },
    [dispatch, assignmentList],
  );

const onHandleClickRow = useCallback(
  (e, row) => {
    console.log("onHandleClickRow")
    e.preventDefault();
    const { checked } = e.target;
    let oldSelection = [...selectItems]
    if (checked !== undefined) {
        if(selectedCategory == 'correct_details') {
          oldSelection = [row.rf_id]
          setSelectAll(false);
          setSelectItems(oldSelection)
          dispatch(setChannelID(''))
          dispatch(getChannelIDTransaction(row.rf_id));
        } else {
          if (!oldSelection.includes(row.rf_id)) {
            oldSelection.push(row.rf_id);
          } else {
            oldSelection = oldSelection.filter(
                customer => customer !== parseInt(row.rf_id),
            );
          }
          // setSelectItems(oldSelection);
          setSelectAll(false);
          history.push({
            hash: updateHashLocation(location, "assignments", oldSelection).join(
                "&",
            ),
          });
          setSelectItems(prevItems =>
              prevItems.includes(row.rf_id)
              ? prevItems.filter(item => item !== row.rf_id)
              : [...prevItems, row.rf_id],
          );
        }        
        dispatch(setAllAssignments(false));
        dispatch(setSelectAssignments(oldSelection));
    } else {
        console.log("CHECKBOX_SELECTION")
        const element = e.target.closest(
        "div.ReactVirtualized__Table__rowColumn",
        );
        const index = element.getAttribute("aria-colindex");
        if (index == 2) {
            if (currentSelection != row.rf_id) {
              setCurrentSelection(row.rf_id);
            } else {
              setCurrentSelection(null);
            }
        } else {
          //toggle to show illustration or timeline
          if(!selectedRow.includes(row.rf_id)){
            dispatch(setChannelID(''))
            dispatch(setSelectedAssetsPatents([]))
            getTransactionData(dispatch, row.rf_id, defaultLoad, search_string)
            dispatch(setDriveTemplateFrameMode(false));
            dispatch(setDriveTemplateFile(null));
            dispatch(setTemplateDocument(null));
            dispatch(getChannelIDTransaction(row.rf_id));
          } else {
            dispatch(setChannelID(''))
            setSelectedRow([])
            dispatch(setAssetsIllustration(null))
            dispatch(setSelectedAssetsTransactions([]))
            dispatch(setSelectedAssetsPatents([]))
            dispatch(setAssetsTransactionsLifeSpan(null, 0, 0, 0, []))
            //dispatch(toggleLifeSpanMode(false))
            //dispatch(toggleFamilyItemMode(false))
          }
        }
    }      
  },
  [dispatch, selectedCategory, selectItems, currentSelection, selectedRow, defaultLoad, search_string],
);

  const getTransactionData = (dispatch, rf_id, defaultLoad, search_string) => {
    setSelectedRow([rf_id]);
    dispatch(setSelectedAssetsTransactions([rf_id]));
    dispatch(setConnectionBoxView(false));
    dispatch(setPDFView(false));
    dispatch(toggleUsptoMode(false));
    dispatch(toggleFamilyMode(false));
    dispatch(toggleFamilyItemMode(false)); 
    dispatch(setMainCompaniesRowSelect([]));
    dispatch(setAssetTypeSelectedRow([]));
    dispatch(setAssetTypeCustomerSelectedRow([]));
    dispatch(setChildSelectedAssetsTransactions([]));
    dispatch(setChildSelectedAssetsPatents([])); 
    dispatch(setSelectedAssetsPatents([]));
    if(defaultLoad === false){
      dispatch(getAssetTypeAssignmentAssets(rf_id, false, 1, search_string)) // fill assets table 
    }
    dispatch(setAssetsIllustration({ type: "transaction", id: rf_id }));
    dispatch(getAssetsAllTransactionsEvents(selectedCategory == '' ? '' : selectedCategory, [], [], [], [rf_id]));
    dispatch(getChannelIDTransaction(rf_id));
  };

  if (assignmentListLoading ) return <Loader />;

  return (
    <Paper className={classes.root} square id={`assets_assignments`}>
      <VirtualizedTable
        classes={classes}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedIndex={currentSelection}
        selectedKey={"rf_id"}
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
        childCounterColumn={`assets`}
        showIsIndeterminate={false}
        renderCollapsableComponent={
          <ChildTable
            transactionId={currentSelection}
            headerRowDisabled={true}
          />
        }
        totalRows={totalRecords}
        grandTotal={grandTotal}
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
