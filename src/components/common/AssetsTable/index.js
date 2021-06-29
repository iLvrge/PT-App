import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paper } from "@material-ui/core";
import Loader from "../Loader";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../api/patenTrack2";
import {
  setAssetTypesPatentsSelected,
  getCustomerAssets,
  getAssetTypeAssignmentAssets,
  getAssetTypeAssignmentAllAssets,
  setAssetTypeAssignmentAllAssets,  
  setAssetsIllustration,
  setSelectedAssetsPatents,
  setCommentsEntity,
  getChannelID,
  getSlackMessages,
  setSlackMessages,
  setChildSelectedAssetsPatents,
  setSelectedAssetsTransactions,
  setMainCompaniesRowSelect,
  setAssetTypeSelectedRow,
  setAssetTypeCustomerSelectedRow,
  setChildSelectedAssetsTransactions,
  setDriveTemplateFile,
  setTemplateDocument,
  setChannelID,
  getChannels
} from "../../../actions/patentTrackActions2";

import {
  assetLegalEvents,
  assetFamily,
  setConnectionBoxView,
  setPDFView,
  setFamilyItemDisplay,
  assetFamilySingle,
  setAssetFamily,
  setPDFFile
} from "../../../actions/patenTrackActions";

import {
  toggleUsptoMode,
  toggleFamilyMode,
  toggleFamilyItemMode,
  toggleLifeSpanMode,
  setDriveTemplateFrameMode
} from "../../../actions/uiActions";

import { numberWithCommas, applicationFormat, capitalize } from "../../../utils/numbers";

import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";

import ChildTable from "./ChildTable";

const AssetsTable = ({ 
    type,
    transactionId, 
    standalone, 
    openChartBar,
    openAnalyticsBar,
    openAnalyticsAndCharBar,
    closeAnalyticsAndCharBar,
    headerRowDisabled }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [rowHeight, setRowHeight] = useState(40);
  const [headerRowHeight, setHeaderRowHeight] = useState(47)
  const [width, setWidth] = useState(1500);
  const tableRef = useRef();
  const [counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT);
  const [childHeight, setChildHeight] = useState(500);
  const [childSelected, setCheckedSelected] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [asset, setAsset] = useState(null);
  const [selectedAll, setSelectAll] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const assetTypesSelected = useSelector(
    state => state.patenTrack2.assetTypes.selected,
  );
  const assetTypesSelectAll = useSelector(
    state => state.patenTrack2.assetTypes.selectAll,
  );
  const selectedCompanies = useSelector(
    state => state.patenTrack2.mainCompaniesList.selected,
  );
  const selectedCompaniesAll = useSelector(
    state => state.patenTrack2.mainCompaniesList.selectAll,
  );
  const selectedAssetCompanies = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selected,
  );
  const selectedAssetCompaniesAll = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selectAll,
  );
  const selectedAssetAssignments = useSelector(
    state => state.patenTrack2.assetTypeAssignments.selected,
  );
  const selectedAssetAssignmentsAll = useSelector(
    state => state.patenTrack2.assetTypeAssignments.selectAll,
  );
  const assetTypeAssignmentAssets = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.list,
  ); //Assets List
  const totalRecords = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.total_records,
  );
  const assetTypeAssignmentAssetsLoading = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.loading,
  );
  const assetTypeAssignmentLoadingAssets = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.loading_assets,
  );
  const assetTypeAssignmentAssetsSelected = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.selected,
  );
  const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
  const channel_id = useSelector(state => state.patenTrack2.channel_id)
  const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)
  const slack_channel_list_loading = useSelector(state => state.patenTrack2.slack_channel_list_loading)

  const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
  const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)
  const auth_token = useSelector(state => state.patenTrack2.auth_token)
  const [data, setData] = useState([])
  const [assetRows, setAssetRows] = useState([])

  const COLUMNS = [
    {
      width: 29,
      minWidth: 29,
      label: "",
      dataKey: "asset",
      role: "checkbox",
      disableSort: true,
    },
    {
      width: 15,
      minWidth: 15,
      label: "",
      dataKey: "asset",
      role: "arrow",
      disableSort: true,
    },
    {
      width: 100,  
      minWidth: 100,    
      label: "Assets",
      dataKey: "asset",
      staticIcon: "US",
      format: numberWithCommas,
      formatCondition: 'asset_type',
      formatDefaultValue: 0,
      secondaryFormat: applicationFormat,
      align: "left",
      badge: true,
      /* textBold: true */
    },
    {
      width: 35,
      minWidth: 35,
      label: "",
      dataKey: "channel",
      formatCondition: 'asset',
      role: 'slack_image',      
    }
  ];

  const [ tableColumns, setTableColumns ] = useState(COLUMNS)

  

  /* useEffect(() => {
    if(selectedCategory == 'restore_ownership') {
      COLUMNS.splice(0,1)
      setTableColumns(COLUMNS)
    }
  }, [ selectedCategory ]) */

  useEffect(() => {
    if(display_clipboard === false) {
      setTableColumns([...COLUMNS])
      setWidth(800)
      if (standalone) {
        const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
          tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
          customers =
            selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies,
          assignments =
            selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;
            if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ) {
              if (auth_token != null) {
                dispatch(
                  getCustomerAssets(
                    selectedCategory == '' ? '' : selectedCategory,
                    companies,
                    tabs,
                    customers,
                    assignments,
                    false,
                  ),
                );
                setWidth(1500)
              } else {
                dispatch(
                  setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }),
                );
              }
            } else {
              if (selectedCompaniesAll === true || selectedCompanies.length > 0) {
                dispatch(
                  getCustomerAssets(
                    selectedCategory == '' ? '' : selectedCategory,
                    companies,
                    tabs,
                    customers,
                    assignments,
                    false,
                  ),
                );
                setWidth(1500)
              } else {
                dispatch(
                  setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }),
                );
              }
            }        
      } else {
        if (transactionId != null) {
          dispatch(getAssetTypeAssignmentAssets(transactionId, false));
        }
      }
    }     
  }, [
    dispatch,
    selectedCompanies,
    selectedCompaniesAll,
    assetTypesSelectAll,
    assetTypesSelected,
    selectedAssetCompanies,
    selectedAssetCompaniesAll,
    selectedAssetAssignmentsAll,
    selectedAssetAssignments,
    display_clipboard,
    auth_token        
  ]);

  useEffect(() => {
    setAssetRows(assetTypeAssignmentAssets)
  }, [ assetTypeAssignmentAssets ])


  useEffect(() => {
    if( display_clipboard === true &&  clipboard_assets.length > 0 ) {
      let tableColumns = [...COLUMNS, {
        width: 400,
        minWidth: 400,
        oldWidth: 400,
        draggable: true,
        label: "Title",
        dataKey: "title",
        staticIcon: "",
        format: capitalize

      }, {
        width: 80,
        minWidth: 80,
        oldWidth: 80,
        draggable: true,
        label: "CPC",
        dataKey: "cpc_code",
      }, {
        width: 400,
        minWidth: 400,
        oldWidth: 400,
        draggable: true,
        label: "CPC description",
        dataKey: "defination",
        staticIcon: "",
        format: capitalize
      }]
      tableColumns[2].label = 'Clipboard'
      setTableColumns(tableColumns)
      //console.log("clipboard_assets", clipboard_assets)
      setWidth(1500)
      dispatch(setAssetTypeAssignmentAllAssets({list: clipboard_assets, total_records: clipboard_assets.length}))
    }
  }, [ dispatch,  display_clipboard, clipboard_assets])

  /**
   * Adding channel to assets data
   */

  useEffect(() => {
    const checkAssetChannel = async () => {
      if(assetTypeAssignmentAssets.length > 0 && slack_channel_list.length > 0) {
        let findChannel = false, oldAssets = [...assetTypeAssignmentAssets]
        const promises = slack_channel_list.map( channelAsset => {
          const findIndex = oldAssets.findIndex(rowAsset => `us${rowAsset.asset}`.toString().toLowerCase() == channelAsset.name)
          if(findIndex !== -1) {
            oldAssets[findIndex]['channel'] = oldAssets[findIndex].asset

            if(findChannel === false) {
              findChannel = true
            }
          }
        })
        await Promise.all(promises)
        if(findChannel === true){
          setAssetRows(oldAssets)
        }   
        /**
         * If asset selected find ChannelID
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
  },[ slack_channel_list, assetTypeAssignmentAssets, selectedRow])


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

  /* useEffect(() => {
    if (standalone && assetTypeAssignmentAssets.length > 0) {
      handleOnClick(assetTypeAssignmentAssets[0]);
    }
  }, [assetTypeAssignmentAssets, data]); */

  useEffect(() => {
    if (channel_id != "" && selectedAssetsPatents.length > 0) {
      const getSlackToken = getTokenStorage("slack_auth_token_info");
      if (getSlackToken && getSlackToken != "") {
        dispatch(getSlackMessages(channel_id));
      } else {
        //alert to user for login with slack to retrieve messages
      }
    }
  }, [dispatch, channel_id]);

  useEffect(() => {
    if (selectedAssetsPatents.length > 0 ) {
      if(selectedRow.length == 0) {
        setSelectedRow([selectedAssetsPatents[0] != "" ? selectedAssetsPatents[0].toString() : selectedAssetsPatents[1].toString()])
      }
    } else if (selectedAssetsPatents.length > 0 && selectedRow.length == 0) {
      setSelectedRow([])
    }
  }, [selectedAssetsPatents, selectedRow])

  useEffect(() => {
    
    if(assetTypeAssignmentAssetsSelected.length > 0 && (selectItems.length == 0 || selectItems.length != assetTypeAssignmentAssetsSelected.length) ){
      setSelectItems(assetTypeAssignmentAssetsSelected)
    }
  }, [ assetTypeAssignmentAssetsSelected, selectItems ])

  useEffect(() => {
    let filter = []    
    if(assetTypeAssignmentAssets.length > 0 && selectedAssetsPatents.length > 0) {
      filter = assetTypeAssignmentAssets.filter( row => row.asset == selectedAssetsPatents[0].toString() || row.asset == selectedAssetsPatents[1].toString() )
      if(filter.length === 0) {
        resetAll()
      }
    }
  }, [ assetTypeAssignmentAssets ]) 


  const callSelectedAssets = useCallback(({ grant_doc_num, appno_doc_num, asset }) => {
    /* const selectedItems = [];
    if (grant_doc_num != "") {
      selectedItems.push(grant_doc_num);
    }
    if (appno_doc_num != "") {
      selectedItems.push(appno_doc_num);
    } */
    
    setSelectedRow([asset]);    
  }, [dispatch] );

  const handleOnClick = useCallback(
    ({ grant_doc_num, appno_doc_num, asset }) => {
      console.log("grant_doc_num, appno_doc_num, asset", grant_doc_num, appno_doc_num, asset, selectedRow )
      /*TV, Comment, Family, FamilyItem, getChannelID Legal Events */
      if(!selectedRow.includes(asset)) {
        callSelectedAssets({ grant_doc_num, appno_doc_num, asset });
        dispatch(setChildSelectedAssetsPatents([]));
        dispatch(setSelectedAssetsTransactions([]));
        dispatch(setMainCompaniesRowSelect([]));
        dispatch(setAssetTypeSelectedRow([]));
        dispatch(setAssetTypeCustomerSelectedRow([]));
        dispatch(setChildSelectedAssetsTransactions([]));
        dispatch(setChannelID(''))
        dispatch(setDriveTemplateFrameMode(false));
        dispatch(setDriveTemplateFile(null));
        dispatch(setTemplateDocument(null));
        dispatch(setConnectionBoxView(false));
        dispatch(setPDFView(false));        
        //dispatch(toggleUsptoMode(false));
        dispatch(toggleLifeSpanMode(false));
        dispatch(toggleFamilyMode(true));
        dispatch(toggleFamilyItemMode(true));
        dispatch(
          setPDFFile(
            { 
              document: null, 
              form: null, 
              agreement: null 
            }
          )
        )
        dispatch(setSelectedAssetsPatents([grant_doc_num, appno_doc_num]));
        dispatch(
        setAssetsIllustration({
            type: "patent",
            id: grant_doc_num || appno_doc_num,
        }),
        );
        dispatch(
        setCommentsEntity({
            type: "asset",
            id: grant_doc_num || appno_doc_num,
        }),
        );
        dispatch(assetFamilySingle(appno_doc_num))
        dispatch(assetLegalEvents(appno_doc_num, grant_doc_num));
        dispatch(assetFamily(appno_doc_num));
        dispatch(setSlackMessages({ messages: [], users: [] }));
        const channelID = findChannelID(grant_doc_num != '' ? grant_doc_num : appno_doc_num)
        console.log("channelID", channelID)
        if( channelID != '') {
          dispatch(setChannelID({channel_id: channelID}))
        }
        //dispatch(getChannelID(grant_doc_num, appno_doc_num));
        /* if(openAnalyticsBar === false || openChartBar === false) {
            openAnalyticsAndCharBar()
        } */
      } else {
          resetAll()
      }
    },
    [ dispatch, selectedAssetsPatents, selectedRow, openAnalyticsBar, openChartBar ],
  );

const resetAll = () => {
    setSelectedRow([])
    dispatch(setAssetsIllustration(null))
    dispatch(setSelectedAssetsPatents([]))
    dispatch(setAssetFamily([]))
    dispatch(setFamilyItemDisplay({}))
    dispatch(setChannelID(''))
    dispatch(setConnectionBoxView(false));
    dispatch(setPDFView(false));

    dispatch(toggleUsptoMode(false));
    dispatch(toggleLifeSpanMode(false));
    dispatch(toggleFamilyMode(false));
    dispatch(toggleFamilyItemMode(false));

    dispatch(setDriveTemplateFrameMode(false))
    /* if(openChartBar === true || openAnalyticsBar === true) {
      closeAnalyticsAndCharBar()
    } */
}

  /**
   * Click checkbox
   */
  const handleClickSelectCheckbox = useCallback(
    (e, row) => {
        e.preventDefault()
        const { checked } = e.target
        if(checked !== undefined) {
            let oldSelection = [...selectItems]
            if (!oldSelection.includes(row.asset)) {
              oldSelection.push(row.asset);
            } else {
              oldSelection = oldSelection.filter(
                asset => asset != row.asset,
              );
            }
            
            dispatch(setAssetTypesPatentsSelected(oldSelection))
            setSelectItems(prevItems =>
                prevItems.includes(row.asset)
                ? prevItems.filter(item => item !== row.asset)
                : [...prevItems, row.asset],
            );            
        } else {
            const element = e.target.closest('div.ReactVirtualized__Table__rowColumn')
            const index = element.getAttribute('aria-colindex')           
            if(index == 2) {
                if(currentSelection != row.asset) {
                    setCurrentSelection(row.asset) 
                    setAsset(row.appno_doc_num)
                } else { 
                    setCurrentSelection(null)
                    setAsset(null)
                }
            } else {                    
                handleOnClick(row)
            }             
        }         
    },
    [dispatch, selectedAssetsPatents, selectItems, currentSelection],
  );

  /**
   * Click All checkbox
   */

  const onHandleSelectAll = useCallback(
    (event, row) => {
      event.preventDefault();
      const { checked } = event.target;
      if (checked === false) {
        setSelectItems([]);
      } else if (checked === true) {
        let items = [],
          list = [];
        if (standalone && assetTypeAssignmentAssets.length > 0) {
          list = [...assetTypeAssignmentAssets];
        } else if (!standalone && data.length > 0) {
          list = [...data];
        }
        const promise = list.map(item =>
          items.push(
            item.grant_doc_num != "" ? item.grant_doc_num : item.appno_doc_num,
          ),
        );
        Promise.all(promise);
        setSelectItems(items);
      }
      setSelectAll(checked);
    },
    [dispatch, standalone, assetTypeAssignmentAssets, data],
  );

  const findChannelID = useCallback((asset) => {
    let channelID = ''
    if(slack_channel_list.length > 0) {
      const findIndex = slack_channel_list.findIndex( channel => channel.name == `us${asset}`.toString().toLocaleLowerCase())
  
      if( findIndex !== -1) {
        channelID = slack_channel_list[findIndex].id
      }
    }
    return channelID
  }, [ slack_channel_list ]) 


  const resizeColumnsWidth = useCallback((dataKey, data) => {
    let previousColumns = [...tableColumns]
    const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

    if( findIndex !== -1 ) {
      previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
      previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
    }
    setTableColumns(previousColumns)
  }, [ tableColumns ] )

  const resizeColumnsStop = useCallback((dataKey, data) => {
    let previousColumns = [...tableColumns]
    const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

    if( findIndex !== -1 ) {
      previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width + data.x
    }
    setTableColumns(previousColumns)
  }, [ tableColumns ] )

  if (
    (!standalone && assetTypeAssignmentLoadingAssets) ||
    (standalone && assetTypeAssignmentAssetsLoading)
  )
    return <Loader />;

  return (
    <Paper
      className={classes.root}
      square
      id={`assets_type_assignment_all_assets`}
    >
      <VirtualizedTable
        classes={classes}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedIndex={currentSelection}
        selectedKey={"asset"}
        rows={assetRows}
        rowHeight={rowHeight}
        headerHeight={headerRowHeight}
        columns={tableColumns}
        onSelect={handleClickSelectCheckbox}
        onSelectAll={onHandleSelectAll}
        defaultSelectAll={selectedAll}
        resizeColumnsWidth={resizeColumnsWidth}
        resizeColumnsStop={resizeColumnsStop}
        collapsable={true}
        childHeight={childHeight}
        childSelect={childSelected}
        childRows={data}
        childCounterColumn={`child_count`}
        showIsIndeterminate={false}
        renderCollapsableComponent={
          <ChildTable asset={asset} headerRowDisabled={true} />
        }
        forceChildWaitCall={true}
        totalRows={totalRecords}
        defaultSortField={`asset`}
        defaultSortDirection={`desc`}
        /* columnTextBoldList={slack_channel_list} */
        responsive={true}
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

export default AssetsTable;