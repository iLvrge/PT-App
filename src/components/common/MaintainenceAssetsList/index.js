import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paper } from "@mui/material";
import { Clear, NotInterested, KeyboardArrowDown } from '@mui/icons-material';
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
  getChannels,
  setClipboardAssets
} from "../../../actions/patentTrackActions2";

import {
  setConnectionBoxView,
  setPDFView,
  setAssetFamily,
  setPDFFile,
  setFamilyItemDisplay
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
import clsx from "clsx";

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
  isMobile,
  fileBar,
  driveBar
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
  const [selectedAssets, setSelectedAssets] = useState([])  
  const [movedAssets, setMovedAssets] = useState([]) 
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

  useEffect(() => {  
    if(clipboard_assets.length > 0 && clipboard_assets.length != selectedAssets.length ) {      
      setSelectedAssets([...clipboard_assets])
    }
  }, [ clipboard_assets ]) 
  
  useEffect(() => {
    if(move_assets.length > 0 && move_assets.length != movedAssets.length ) {      
      setMovedAssets([...move_assets])
    }
  }, [ move_assets ])

  useEffect(() => {
    dispatch(setClipboardAssets(selectedAssets))
  }, [selectedAssets])

  useEffect(() => {
    dispatch(setMoveAssets(movedAssets))
  }, [movedAssets])

  const Clipboard = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className='clipboard' fill="#fff" enableBackground="new 0 0 80 80" viewBox="0 0 80 80"><path d="M40,5c-3.3085938,0-6,2.6914062-6,6v3h-5c-0.4199219,0-0.7949219,0.262207-0.9394531,0.6567383l-0.880188,2.4077148	h-9.0836792C16.9404297,17.0644531,16,18.0048828,16,19.1611328v53.7421875C16,74.0595703,16.9404297,75,18.0966797,75h43.8066406
C63.0595703,75,64,74.0595703,64,72.9033203V19.1611328c0-1.15625-0.9404297-2.0966797-2.0966797-2.0966797H52.755188
L51.875,14.6567383C51.7304688,14.262207,51.3554688,14,50.9355469,14H46v-3C46,7.6914062,43.3085938,5,40,5z M53.1289062,22
c0.3261719,0,0.6328125-0.1591797,0.8193359-0.4267578c0.1875-0.2680664,0.2324219-0.6098633,0.1201172-0.9165039
l-0.5820923-1.5922852h8.4170532C61.9541016,19.0644531,62,19.1103516,62,19.1611328v53.7421875
C62,72.9541016,61.9541016,73,61.9033203,73H18.0966797C18.0458984,73,18,72.9541016,18,72.9033203V19.1611328
c0-0.0507812,0.0458984-0.0966797,0.0966797-0.0966797h8.3526001l-0.5820923,1.5922852
c-0.1123047,0.3066406-0.0673828,0.6484375,0.1201172,0.9165039C26.1738281,21.8408203,26.4804688,22,26.8066406,22H53.1289062z
M50.2363281,16l1.4619141,4H28.2373047l1.4619141-4H35c0.5527344,0,1-0.4477539,1-1v-4c0-2.2055664,1.7939453-4,4-4
s4,1.7944336,4,4v4c0,0.5522461,0.4472656,1,1,1H50.2363281z" ></path><path d="M23,38h8V28h-8V38z M25,30h4v6h-4V30z" ></path><rect width="23" height="2" x="34" y="32" ></rect><rect width="17" height="2" x="23" y="44" ></rect><rect width="34" height="2" x="23" y="54" ></rect><rect width="34" height="2" x="23" y="64" ></rect><rect width="2" height="4" x="38.968" y="9" ></rect></svg>
    )
  }

  const dropdownList = [
    {
      id: 99,
      name: 'No action' ,
      icon: <NotInterested />,
      image: ''
    },
    {
      id: -1,
      name: '', 
      icon: <KeyboardArrowDown />,
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
    },
    {
      id: 5,
      name: 'Add to Clipboard',
      image: '',
      icon: <Clipboard />
    }
  ]
  
  const onHandleDropDownlist = ( event, asset, row ) => {    
    if(event.target.value == 5) {
      setSelectedAssets(prevItems => {
        const findIndex = prevItems.findIndex( r => r.asset == asset)
        if( findIndex !== -1 ) {
          const items = [...prevItems]
          items.splice( findIndex, 1 )
          return items
        } else {
          return [...prevItems, row]
        }
      })          
    } else if (event.target.value === 99) {
      setSelectedAssets(prevItems => {
        const findIndex = prevItems.findIndex( r => r.asset == asset)
        if( findIndex !== -1 ) {
          const items = [...prevItems]
          items.splice( findIndex, 1 )
          return items
        } else {
          return [...prevItems]
        }
      }) 
    }   
    const currentLayoutIndex = controlList.findIndex(r => r.type == 'menu' && r.category == selectedCategory )
    if(currentLayoutIndex !== -1) {
      setDropOpenAsset(null)
      setMovedAssets(prevItems => {
        const findIndex = prevItems.findIndex(row => row.asset == asset)  
        if(findIndex !== -1) {
          const items = [...prevItems]
          items.splice( findIndex, 1 )
          return items
        } else {
          if(event.target.value !== 99) {
            return [...prevItems, { 
              asset,
              move_category: event.target.value,
              currentLayout: controlList[currentLayoutIndex].layout_id,
              grant_doc_num: row.grant_doc_num,
              appno_doc_num: row.appno_doc_num,
            }]
          } else {
            return prevItems
          } 
        }
      })
    }
  }
  
  const COLUMNS = [
    {
      width: 10,
      minWidth: 10,
      label: "", 
      dataKey: "asset",
      role: "checkbox",
      disableSort: true,
      enable: false
    },
    {
      width: 25,
      minWidth: 25,
      disableSort: true,
      headingIcon: 'assets',  
      checkboxSelect: true,
      label: "",
      dataKey: "asset",
      role: "static_dropdown",
      list: dropdownList,
      onClick: onHandleDropDownlist
    },
    {
      width: isMobile === true ? 150 : 100,  
      minWidth: isMobile === true ? 150 : 100,  
      label: "Assets",
      dataKey: "asset",
      staticIcon: "US",
      format: numberWithCommas,
      formatCondition: 'asset_type',
      formatDefaultValue: 0,
      secondaryFormat: applicationFormat,
      align: "center",
      show_selection_count: true,
      badge: true,
      /* textBold: true */
    },
    {
      width: isMobile === true ? 60 : 40,
      minWidth: isMobile === true ? 60 : 40,
      label: "",
      dataKey: "channel",
      formatCondition: 'asset',
      headingIcon: 'slack_image',
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
      if(slackToken && slackToken!= '' && slackToken!= null && slackToken!= 'null' ) {
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
        dispatch(
          setPDFFile(
            { 
              document: null, 
              form: null, 
              agreement: null 
            }
          )
        )
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
      } else {
        resetAll()
      }
    },
    [dispatch, selectedAssetsPatents],
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
    dispatch(toggleLifeSpanMode(true));
    dispatch(toggleFamilyMode(false));
    dispatch(toggleFamilyItemMode(false));

    dispatch(setDriveTemplateFrameMode(false))
    /* if(openChartBar === true || openAnalyticsBar === true) {
      closeAnalyticsAndCharBar()
    } */
  }

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
    <Paper className={clsx(classes.root, {[classes.mobile]: isMobile === true && (fileBar === true || driveBar)})} square id={`maintainence_assets`}>
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
