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
  import PatenTrackApi, { DEFAULT_CUSTOMERS_LIMIT } from "../../../api/patenTrack2";
  import {capitalizeEachWord} from '../../../utils/numbers'
  import Loader from "../Loader";
import { setAssetTypeAssignmentAllAssets, setAssetTypeAssignments, setAssetTypesPatentsSelected, setCPCData, setLineChartRequest, setLineChartReset, setSelectAssignments, setSelectedAssetsPatents, setSelectedAssetsTransactions, setSelectLawFirm } from "../../../actions/patentTrackActions2";

  
  const LawFirmTable = ({ checkChartAnalytics, chartsBar, analyticsBar, defaultLoad, type }) => {
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
    const [loadingData, setLoadingData] = useState(false);
    const [initialize, setIntialize] = useState(false);
    const [selectedAll, setSelectAll] = useState(false);
    const [selectItems, setSelectItems] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [scrollToIndex, setScrollToIndex] = useState(0);
    const [rows, setRows] = useState([]);
    const [childSelected, setCheckedSelected] = useState(0);
    const [currentSelection, setCurrentSelection] = useState(null); 
    const selectedCompanies = useSelector(
      state => state.patenTrack2.mainCompaniesList.selected,
    );  
  
    const COLUMNS = [
        {
            width: 10,
            minWidth: 10,
            label: "",
            dataKey: "id",
            role: "radio",
            disableSort: true,
            enable: false,
            show: false
          }, 
        {
            width: 300,
            minWidth: 300,
            label: "Law Firms",
            dataKey: "lawfirm",
            align: "left",
            show_selection_count: true,
            badge: true, 
        },
    ];
  
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
  
    
    useEffect(() => {
        const getLawFirmList = async() => {
          if(selectedCompanies.length > 0) {
            setLoadingData(true)
            const {data} = await PatenTrackApi.getLawFirmsByCompany(selectedCompanies)
            setLoadingData(false)
            setRows(data)
            setGrandTotal(data.length)
          }
        }
        getLawFirmList()
    }, [selectedCompanies])
  
    const onHandleSelectAll = useCallback(
      (event, row) => {
        event.preventDefault();
       
      },
      [dispatch],
    );
  
  const onHandleClickRow = useCallback(
    (e, row) => {
      e.preventDefault();
      dispatch(setAssetTypesPatentsSelected([]))
      dispatch(setSelectedAssetsPatents([]))
      dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false)) 
      
      let oldItems = [...selectItems], ID = 0 , allIDs = [];
      if(!oldItems.includes(row.id)) { 
        oldItems = [row.id]
        ID = row.id
        if(typeof row.grp != 'undefined' && typeof row.grp != '') {
          allIDs = row.grp.toString().split(',');
        } else {
          allIDs.push(ID)
        }
      } else {
        oldItems = []
      }
      setSelectItems(oldItems)
      dispatch(setSelectLawFirm(ID))
      dispatch(setAssetTypeAssignments({ list: [], total_records: 0 }, false))
      dispatch(setCPCData({list:[], group: [], sales: []}))
      dispatch(setLineChartReset()) 
      /* dispatch(setSelectedAssetsTransactions(allIDs))
      dispatch(setSelectAssignments(allIDs)) */

    },
    [dispatch, selectItems]
  );
  
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
  
    if (loadingData ) return <Loader />;
  
    return (
      <Paper className={classes.root} square id={`lawfirms_container`}>
        <VirtualizedTable
          classes={classes}
          selected={selectItems}
          rowSelected={selectedRow}
          selectedIndex={currentSelection}
          selectedKey={"id"}
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
          resizeColumnsWidth={resizeColumnsWidth}
          resizeColumnsStop={resizeColumnsStop}
          showIsIndeterminate={false}
          defaultSortField={`lawfirm`}
          defaultSortDirection={`asc`}
          totalRows={grandTotal}
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
  
  export default LawFirmTable;
  