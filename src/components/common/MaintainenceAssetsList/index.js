import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paper } from "@material-ui/core";
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
  setMoveAssets
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
} from "../../../actions/uiActions";

import { numberWithCommas, applicationFormat } from "../../../utils/numbers";

import { getTokenStorage } from "../../../utils/tokenStorage";

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

  useEffect(() => {
    setAssetsLists(assets)
  }, [ assets ])

  const dropdownList = [
    {
      id: 0,
      name: 'Remove from this list'
    },
    {
      id: 2,
      name: 'Move to Sale'
    },
    {
      id: 4,
      name: 'Move to LicenseOut'
    }
  ]
  
  const onHandleDropDownlist = useCallback(async(event, asset, row ) => {
    const currentLayoutIndex = controlList.findIndex(r => r.type == 'menu' && r.category == selectedCategory )
    const assetSelected = selectItems.includes(asset) ? true : false
    if(currentLayoutIndex !== -1) {
      if( assetSelected === false ) {
        const addData = {
          asset,
          move_category: event.target.value,
          currentLayout: controlList[currentLayoutIndex].layout_id,
          grant_doc_num: row.grant_doc_num,
          appno_doc_num: row.appno_doc_num,
        }
        const form = new FormData()
        form.append('moved_assets', JSON.stringify(addData))
        const { data } = await PatenTrackApi.moveAssetToLayout(form)        
        if(data.length > 0 ) {
          setRedoId(data.asset_id)
          setDropOpenAsset(null)
          const list = assetsList.list;
          const filterList = list.filter( row => row.asset != asset )
          setAssetsLists({list: filterList, total_records: assetsList.total_records - 1})
        } else {
          console.log("Error")
          alert('Error while moving asset')
        }
      } else {
        setDropOpenAsset(null)
        let oldMoveAssets = [...move_assets]
        const findIndex = oldMoveAssets.findIndex(row => row.asset == asset)
        if(findIndex !== -1) {
          oldMoveAssets.splice(findIndex, 1)
        }
        oldMoveAssets.push({
          asset,
          move_category: event.target.value,
          currentLayout: controlList[currentLayoutIndex].layout_id,
          grant_doc_num: row.grant_doc_num,
          appno_doc_num: row.appno_doc_num,
        })
        dispatch(setMoveAssets(oldMoveAssets))
      }  
    }
  }, [ dispatch, controlList, assetsList, selectItems, move_assets ])
  
  const COLUMNS = [
    {
      width: 15,
      minWidth: 15,
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
      dataKey: "asset",
      staticIcon: "US",
      format: numberWithCommas,
      formatCondition: 'asset_type',
      formatDefaultValue: 0,
      secondaryFormat: applicationFormat,
      align: "left",
      badge: true,
      textBold: true
    },
    {
      width: 90,
      minWidth: 90,
      label: "Payment Due",
      dataKey: "payment_due",
    },
    {
      width: 80,
      minWidth: 80,
      label: "Amount",
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
        dispatch(setSelectedAssetsPatents([patent, application]));
        dispatch(
          setAssetsIllustration({ type: "patent", id: patent || application }),
        );
        dispatch(
          setCommentsEntity({ type: "asset", id: patent || application }),
        );
        dispatch(assetLegalEvents(application, patent));
        dispatch(assetFamily(application));
        dispatch(getChannelID(patent, application));
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
        rowHeight={rowHeight}
        headerHeight={rowHeight}
        columns={COLUMNS}
        onSelect={handleClickSelectCheckbox}
        onSelectAll={handleSelectAll}
        defaultSelectAll={selectedAll}
        totalRows={assetsList.total_records}
        defaultSortField={`asset`}
        defaultSortDirection={`desc`}
        columnTextBoldList={slack_channel_list}
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
