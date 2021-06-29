import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paper } from "@material-ui/core";
import { Clear, NotInterested } from '@material-ui/icons';
import moment from "moment";

import useStyles from "./styles";
import _orderBy from "lodash/orderBy";
import VirtualizedTable from "../VirtualizedTable";
import PatenTrackApi, { DEFAULT_CUSTOMERS_LIMIT } from "../../../api/patenTrack2";

import {
  setMainCompaniesRowSelect,
  setAssetTypeSelectedRow,
  setAssetTypeCustomerSelectedRow,
  setSelectedAssetsTransactions,
  setChildSelectedAssetsTransactions,
  setChildSelectedAssetsPatents,
  setSlackMessages,
  setMoveAssets,
  setTemplateDocument,
  setMaintainenceAssetsList,
  setChannelID,
  getChannels
} from "../../../actions/patentTrackActions2";

import {
  setConnectionBoxView,
  setPDFView,
} from "../../../actions/patenTrackActions";

import {
  toggleUsptoMode,
  toggleShow3rdParities,
  toggleFamilyMode,
  toggleFamilyItemMode,
  toggleLifeSpanMode,
  setDriveTemplateFrameMode
} from "../../../actions/uiActions";

import { numberWithCommas, applicationFormat, capitalize } from "../../../utils/numbers";

import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";

import Loader from "../Loader";

import  { controlList } from '../../../utils/controlList'

const MaintainenceAssetsList = ({
  assets,
  isLoading,
  loadMore,
  setAssetsIllustration,
  setSelectedAssetsPatents,
  setCommentsEntity,
  assetLegalEvents,
  assetFamily,
  setSelectedMaintainenceAssetsList,
  selectedMaintainencePatents,
  getChannelID,
  channel_id,
  getSlackMessages,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [headerRowHeight, setHeaderRowHeight] = useState(47)
  const [rowHeight, setRowHeight] = useState(40);
  const [width, setWidth] = useState(800);
  const tableRef = useRef();
  const [counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT);
  const [selectedAll, setSelectAll] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [ dropOpenAsset, setDropOpenAsset ] = useState(null)
  const [ assetsList, setAssetsLists ] = useState({list: [], total_records: 0})
  
  const [ redoId, setRedoId] = useState(0)
  const totalRecords = 0;
  const selectedAssetsPatents = useSelector(
    state => state.patenTrack2.selectedAssetsPatents,
  );

  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
  const move_assets = useSelector(state => state.patenTrack2.move_assets)
  const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list) 
  const slack_channel_list_loading = useSelector(state => state.patenTrack2.slack_channel_list_loading)
  const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
  const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)

  const dropdownList = [
    {
      id: -1,
      name: 'No action' ,
      icon: <NotInterested />,
      image: ''
    },
    {
      id: 0,
      name: 'Remove from this list', 
      icon: <Clear />,
      image: ''
    },
    {
      id: 2,
      name: 'Move to Sale',
      image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/sell.png',
      icon: ''
    },
    {
      id: 4,
      name: 'Move to License-Out',
      image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/licenseout.png',
      icon: ''
    }
  ]
  
  const onHandleDropDownlist = useCallback(async(event, asset, row ) => {
    const currentLayoutIndex = controlList.findIndex(r => r.type == 'menu' && r.category == selectedCategory )
    
    if(currentLayoutIndex !== -1) {      
      setDropOpenAsset(null)
      let oldMoveAssets = [...move_assets]
      const findIndex = oldMoveAssets.findIndex(row => row.asset == asset)
      if(findIndex !== -1) {
        oldMoveAssets.splice(findIndex, 1)
      }
      if( event.target.value != -1 ) {
        oldMoveAssets.push({
          asset,
          move_category: event.target.value,
          currentLayout: controlList[currentLayoutIndex].layout_id,
          grant_doc_num: row.grant_doc_num,
          appno_doc_num: row.appno_doc_num,
        })          
      }   
      dispatch(setMoveAssets(oldMoveAssets)) 
    }
  }, [ dispatch, controlList, assetsList, selectItems, move_assets ])
  
  const COLUMNS = [
    {
      width: 24,
      minWidth: 24,
      disableSort: true,
      label: "",
      dataKey: "asset",
      role: "static_dropdown",
      list: dropdownList,
      onClick: onHandleDropDownlist
    },
    {
      width: 29,
      minWidth: 29,
      disableSort: true,
      label: "",
      dataKey: "asset",
      role: "checkbox",
    },
    {
      width: 80,  
      minWidth: 80,    
      label: "Assets",
      headingIcon: 'assets',
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
      width: 40,
      minWidth: 40,
      label: "",
      dataKey: "channel",
      formatCondition: 'asset',
      role: 'slack_image',      
    },
    {
      width: 90,
      minWidth: 90,
      label: "Due Date",
      dataKey: "payment_due",
    },
    {
      width: 80,
      minWidth: 80,
      label: "Fee",
      dataKey: "fee_amount",
      staticIcon: "$",
      format: numberWithCommas,
    },
    {
      width: 100,
      minWidth: 100,
      label: "Grace Ends",
      dataKey: "payment_grace",
    },
    {
      width: 80,
      minWidth: 80,
      label: "Surcharge",
      dataKey: "fee_surcharge",
      staticIcon: "$",
      format: numberWithCommas,
    },
    {
      width: 100,
      label: "Expiration",
      dataKey: "remaining_year",
    },
    {
      width: 100,
      label: "Source",
      dataKey: "source",
    },
    {
      width: 100,
      label: "Citations",
      dataKey: "fwd_citation",
    },
    {
      width: 111,
      label: "Technology",
      dataKey: "technology",
    },
  ];

  const [ tableColumns, setTableColumns ] = useState(COLUMNS)

  useEffect(() => {
    if( display_clipboard === false ){
      setAssetsLists(assets)
    }    
  }, [ display_clipboard, assets ])

 
  useEffect(() => {
    if( display_clipboard === true &&  clipboard_assets.length > 0 ) {
      setTableColumns([...COLUMNS, {
        width: 400,
        minWidth: 400,
        oldWidth: 400,
        draggable: true,
        label: "Title",
        dataKey: "title",
        staticIcon: "",
        format: capitalize

      }, {
        width: 60,
        minWidth: 60,
        oldWidth: 60,
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
      }])
      //console.log("clipboard_assets", clipboard_assets)
      setWidth(1000)
      dispatch(setMaintainenceAssetsList({list: clipboard_assets, total_records: clipboard_assets.length}, { append: false }))
      setAssetsLists({list: clipboard_assets, total_records: clipboard_assets.length})
    }
  }, [ dispatch,  display_clipboard, clipboard_assets])

  /**
   * Adding channel to assets data
   */

  useEffect(() => {
    const checkAssetChannel = async () => {
      if(assets.list.length > 0 && slack_channel_list.length > 0) {
        let findChannel = false, oldAssets = [...assets.list]
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
          setAssetsLists({list: oldAssets, total_records: assets.total_records})
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
  },[ slack_channel_list, assets])

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

  
  const callSelectedAssets = useCallback(({ patent, application, asset }) => {
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
    ({ patent, application, asset }) => {
      /*TV, Comment, Family, FamilyItem, getChannelID Legal Events */
      if(!selectedRow.includes(asset)) {
        callSelectedAssets({ patent, application, asset });
        dispatch(setConnectionBoxView(false));
        dispatch(setChannelID(''))
        dispatch(setPDFView(false));
        dispatch(toggleUsptoMode(false));
        dispatch(toggleShow3rdParities(false));
        dispatch(toggleLifeSpanMode(false));
        dispatch(toggleFamilyMode(true));
        dispatch(toggleFamilyItemMode(true));
        dispatch(setChildSelectedAssetsPatents([]));
        dispatch(setSelectedAssetsTransactions([]));
        dispatch(setMainCompaniesRowSelect([]));
        dispatch(setAssetTypeSelectedRow([]));
        dispatch(setAssetTypeCustomerSelectedRow([]));
        dispatch(setChildSelectedAssetsTransactions([]));
        dispatch(setSlackMessages({ messages: [], users: [] }));
        dispatch(setDriveTemplateFrameMode(false))
        dispatch(setTemplateDocument(null))
        dispatch(setSelectedAssetsPatents([patent, application]));
        dispatch(
          setAssetsIllustration({ type: "patent", id: patent || application }),
        );
        dispatch(
          setCommentsEntity({ type: "asset", id: patent || application }),
        );
        dispatch(assetLegalEvents(application, patent));
        dispatch(assetFamily(application));
        //dispatch(getChannelID(patent, application));
        const channelID = findChannelID(patent != '' ? patent : application)
        if( channelID != '') {
          dispatch(setChannelID({channel_id: channelID}))
        }
      }
    },
    [dispatch, selectedAssetsPatents],
  );

  /**
   * Select first item by default
   */
  /* useEffect(() => {
    if (assets.list.length > 0) {
      setSelectedRow([assets.list[0].grant_doc_num]);
      setSelectedRow([assets.list[0].appno_doc_num]);
      handleOnClick({
        patent: assets.list[0].grant_doc_num,
        application: assets.list[0].appno_doc_num,
      });
    }
  }, [assets]); */

  useEffect(() => {
    if (selectedAssetsPatents.length == 0) {
      setSelectedRow([]);
    }
  }, [selectedAssetsPatents]);

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

  const handleClickSelectCheckbox = useCallback(
    (e, row) => {
      e.preventDefault();
      const { checked } = e.target;
      let updateSelected = [...selectedMaintainencePatents],
        oldSelection = [...selectItems];
        
      if (checked !== undefined) {
        if(oldSelection.includes(row.asset)) {
          updateSelected = selectedMaintainencePatents.filter(
            asset => asset[1] !== parseInt(row.appno_doc_num),
          );
        } else { 
          updateSelected.push([
            row.grant_doc_num,
            row.appno_doc_num,
            "",
            row.fee_code,
            row.fee_amount,
          ]);
          const todayDate = moment(new Date()).format("YYYY-MM-DD");
          if (
            new Date(todayDate).getTime() >=
            new Date(row.payment_grace).getTime()
          ) {
            updateSelected.push([
              row.grant_doc_num,
              row.appno_doc_num,
              "",
              row.fee_code_surcharge,
              row.fee_surcharge,
            ]);
          }
        }
        setSelectItems(prevItems =>
          prevItems.includes(row.asset)
          ? prevItems.filter(item => item !== row.asset)
          : [...prevItems, row.asset],
        ); 
        dispatch(setSelectedMaintainenceAssetsList(updateSelected));
      } else {
        if(typeof e.target.closest == 'function') {
          const element = e.target.closest('div.ReactVirtualized__Table__rowColumn')
          if(element != null) {
            const index = element.getAttribute('aria-colindex')
            const findElement = element.querySelector('div.MuiSelect-select')
            if( index == 1 && findElement != null ) {
              setDropOpenAsset(row.asset)
            } else {
              handleOnClick({
                patent: row.grant_doc_num,
                application: row.appno_doc_num,
                asset: row.asset
              });
            }
          } else {
            if( row.asset == dropOpenAsset ) {
              setDropOpenAsset(null)
            } else {
              handleOnClick({
                patent: row.grant_doc_num,
                application: row.appno_doc_num,
                asset: row.asset
              });
            }         
          }
        }        
      }      
    },
    [dispatch, selectedMaintainencePatents, selectItems, dropOpenAsset],
  );

  const handleSelectAll = useCallback(
    (event, row) => {
      event.preventDefault();
      const { checked } = event.target;
      if (checked === false) {
        setSelectItems([]);
        dispatch(setSelectedMaintainenceAssetsList([]));
      } else if (checked === true) {
        if (assets.list.length > 0) {
          let items = [];
          assets.list.map(asset => items.push(asset.asset));
          setSelectItems(items);
          dispatch(setSelectedMaintainenceAssetsList(items));
        }
      }
      setSelectAll(checked);
    },
    [dispatch, assets],
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

  if (isLoading && assets.list.length == 0) return <Loader />;

  return (
    <Paper className={classes.root} square id={`maintainence_assets`}>
      <VirtualizedTable
        classes={classes}
        openDropAsset={dropOpenAsset}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedKey={"asset"}
        rows={assetsList.list}
        dropdownSelections={move_assets}
        rowHeight={rowHeight}
        headerHeight={headerRowHeight}
        columns={tableColumns}
        onSelect={handleClickSelectCheckbox}
        onSelectAll={handleSelectAll}
        defaultSelectAll={selectedAll}
        totalRows={assetsList.total_records}
        defaultSortField={`asset`}
        defaultSortDirection={`desc`}
        responsive={false}
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

export default MaintainenceAssetsList;
