import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {useLocation} from 'react-router-dom'
import { Paper, Popover, Box, Rating } from "@mui/material";
import { Clear, NotInterested, KeyboardArrowDown, MonetizationOn } from '@mui/icons-material';
import moment from "moment";
import Loader from "../Loader";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import Googlelogin from '../Googlelogin' 
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../api/patenTrack2";
import {
  setAssetTypesPatentsSelected,
  setAssetTypesPatentsSelectAll,
  getCustomerAssets,
  getCustomerSelectedAssets,
  getAssetTypeAssignmentAssets,
  getAssetTypeAssignmentAllAssets,
  setAssetTypeAssignmentAllAssets, 
  setAssetTypesAssignmentsAllAssetsLoading, 
  setAssetsIllustration,
  setSelectedAssetsPatents,
  setCommentsEntity,
  getChannelID,
  getSlackMessages,
  setSlackMessages,
  setChildSelectedAssetsPatents,
  setSelectedAssetsTransactions,
  setDocumentTransaction,
  setMainCompaniesRowSelect,
  setAssetTypeSelectedRow,
  setAssetTypeCustomerSelectedRow,
  setChildSelectedAssetsTransactions,
  setDriveTemplateFile,
  setTemplateDocument,
  setChannelID,
  getChannels,
  setClipboardAssets,
  setMoveAssets,
  linkWithSheetSelectedAsset,
  linkWithSheet,
  linkWithSheetOpenPanel,
  setLinkAssetListSelected,
  setLinkAssetData,
  getForeignAssetsBySheet,
  setAssetTableScrollPos,
  resetAssetDetails,
  getAssetDetails,
  setSelectedMaintainenceAssetsList,
  setAssetsIllustrationData
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
  setDriveTemplateFrameMode,
  setTimelineScreen,
  setDashboardScreen
} from "../../../actions/uiActions";

import  { controlList } from '../../../utils/controlList'

import { numberWithCommas, applicationFormat, capitalize } from "../../../utils/numbers";

import { getAuthConnectToken, getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";

import PatenTrackApi from '../../../api/patenTrack2'

import ChildTable from "./ChildTable";
import clsx from "clsx";

var applicationNumber = null, assetNumber = null, hoverTimer = null

const AssetsTable = ({ 
    type,
    assets,
    transactionId, 
    standalone, 
    openChartBar,
    openAnalyticsBar,
    openIllustrationBar,
    commentBar,
    openAnalyticsAndCharBar,
    closeAnalyticsAndCharBar,
    handleChartBarOpen,
    handleAnalyticsBarOpen,
    handleIllustrationBarOpen,
    handleVisualBarSize,
    setIllustrationBarSize,
    headerRowDisabled,
    isMobile,
    fileBar,
    driveBar,
    changeVisualBar,
    handleCommentBarOpen
  }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()
  const tableRef = useRef()
  const assetsAssignmentRef = useRef()
  const googleLoginRef = useRef(null)
  const [offsetWithLimit, setOffsetWithLimit] = useState([0, DEFAULT_CUSTOMERS_LIMIT])
  const [maintainenceItems, setMaintainenceItems] = useState([])
  const [ratingOnFly, setRatingOnFly] = useState({})
  const [rowHeight, setRowHeight] = useState(40)
  const [headerRowHeight, setHeaderRowHeight] = useState(47)
  const [width, setWidth] = useState(1500) 
  const [counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
  const [sortField, setSortField] = useState(`asset`)
  const [sortOrder, setSortOrder] = useState(`DESC`)
  const [checkBar, setCheckBar] = useState(true)
  const [childHeight, setChildHeight] = useState(500)
  const [childSelected, setCheckedSelected] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [asset, setAsset] = useState(null);
  const [selectedAll, setSelectAll] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([])  
  const [movedAssets, setMovedAssets] = useState([])  
  const [ dropOpenAsset, setDropOpenAsset ] = useState(null)
  const [ assetRating, setAssetRating ] = useState([])
  const [ callByAuthLogin, setCallByAuth ] = useState(false)
  const [ anchorEl, setAnchorEl ] = useState(null)
  const [optionType, setOptionType] = useState('multiple')
  const [defaultViewFlag, setDefaultViewFlag] = useState(0)
  const [assetRows, setAssetRows] = useState([])
  const [ googleAuthLogin, setGoogleAuthLogin ] = useState(true)
  const [ selectedDefaultItem, setSelectedDefaultItem ] = useState(false)
  const google_auth_token = useSelector(state => state.patenTrack2.google_auth_token)
  const google_profile = useSelector(state => state.patenTrack2.google_profile)
  const openModal = Boolean(anchorEl);
  const assetTableScrollPosition = useSelector(
    state => state.patenTrack2.assetTableScrollPosition,
  );
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

  const assetTypeAssignmentAssetsSelectedAll = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.selectAll,
  );

  const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
  const move_assets = useSelector(state => state.patenTrack2.move_assets)
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
  const channel_id = useSelector(state => state.patenTrack2.channel_id)
  const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)
  const slack_channel_list_loading = useSelector(state => state.patenTrack2.slack_channel_list_loading)
  const usptoMode = useSelector(state => state.ui.usptoMode)
  const display_clipboard = useSelector(state => state.patenTrack2.display_clipboard)
  const display_sales_assets = useSelector(state => state.patenTrack2.display_sales_assets)
  const clipboard_assets = useSelector(state => state.patenTrack2.clipboard_assets)
  const auth_token = useSelector(state => state.patenTrack2.auth_token)
  const link_assets_sheet_type = useSelector(state => state.patenTrack2.link_assets_sheet_type)
  const switch_button_assets = useSelector(state => state.patenTrack2.switch_button_assets)
  const foreignAssets = useSelector(state => state.patenTrack2.foreignAssets)
  const dashboardScreen = useSelector(state => state.ui.dashboardScreen) 
  const companiesList = useSelector( state => state.patenTrack2.mainCompaniesList.list);

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

  const onHandleRating = (event, newValue, props) => {
    if(event.type == 'mousemove') {
      setRatingOnFly({label: props.label, rating_value: newValue})
    } else {
      setRatingOnFly({})
    }    
  }

  const RatingBox = (props) => {
    const findValue = useMemo(() => {
      if(typeof props.data !== 'undefined' && props.data.length > 0) {
        let value = 0
        props.data.forEach( item => {
          if(props.label == item.name && item.value != '') {
            value = item.value
          } 
        })
        return value;
      } else {
        return 0;
      }
    }, [props])
    return (
      <Box className={classes.rating_container}>
        <span className={classes.rating_label}><label>{props.label}</label></span>
        <Rating
          name={props.name}
          onChangeActive={(event, newValue) => onHandleRating(event, newValue, props)}
          value={findValue}
        />
      </Box>
    )
  }

  const RatingImportant = (props) => {
    return (
      <RatingBox
        label={`Important`}
        name={`virtual-rating-important`}
        data={props.item}
      />
    )
  }


  const RatingNecessary = (props) => {
    return (
      <RatingBox
        label={`Necessary`}
        name={`virtual-rating-necessary`}
        data={props.item}
      />
    )
  }

  const TeamBarIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 64" className="team"><path d="M53.55,37.65H45.92v2H60V37.46a13.61,13.61,0,0,0-3.06-8.67c-.24-.3-.5-.58-.78-.87a12.52,12.52,0,0,0-1.78-1.58l-.4-.31-.51-.31A13.4,13.4,0,0,0,52.2,25a14.77,14.77,0,0,0-2.47-.94A7.17,7.17,0,0,0,50.93,23a7.65,7.65,0,0,0,2-4.49,4.23,4.23,0,0,0,.07-.89v-.28a7.88,7.88,0,0,0-2-5A7.57,7.57,0,0,0,49.49,11,7.91,7.91,0,0,0,39,12.55,7.93,7.93,0,0,0,39.27,23a8.8,8.8,0,0,0,1.11,1,12.31,12.31,0,0,0-2.72,1,8.61,8.61,0,0,0-1.11.61,7.92,7.92,0,0,0-4.35-1.3,8,8,0,0,0-4.54,1.42l-.09-.05A13.4,13.4,0,0,0,26.35,25a15,15,0,0,0-2.46-.94A7.59,7.59,0,0,0,25.09,23a7.71,7.71,0,0,0,2.05-4.49,6.23,6.23,0,0,0,.06-.89v-.28a7.83,7.83,0,0,0-2-5A7.72,7.72,0,0,0,23.65,11a8,8,0,0,0-8.94.12,8.43,8.43,0,0,0-1.53,1.39A7.95,7.95,0,0,0,13.42,23a8.8,8.8,0,0,0,1.11,1,12.78,12.78,0,0,0-2.73,1,9.1,9.1,0,0,0-1.14.63l-.51.31-.39.3a13.74,13.74,0,0,0-1.87,1.63,9.42,9.42,0,0,0-.78.88,13.61,13.61,0,0,0-3.06,8.67v2.19h14v-2H10.46V31.3l-1.12-2a11.08,11.08,0,0,1,1.71-1.49l.55-.36.32-.19A10.9,10.9,0,0,1,14.84,26a5,5,0,0,0,8.48,0,12.44,12.44,0,0,1,2.81,1.16,7.95,7.95,0,0,0,.21,10.48H20.08v2h4.66a10.59,10.59,0,0,0-1.14.63l-.51.31-.39.3a13.16,13.16,0,0,0-1.87,1.64,8.18,8.18,0,0,0-.78.87A13.61,13.61,0,0,0,17,52.08v2.19H31v-2H23.4V45.92l-1.12-2A11.08,11.08,0,0,1,24,42.41l.55-.36.32-.19a10.9,10.9,0,0,1,2.92-1.23,5,5,0,0,0,8.48,0,12.29,12.29,0,0,1,3,1.27l.32.18.53.39a9.85,9.85,0,0,1,1.65,1.44l-1.12,2v6.35H33v2H47V52.08A13.61,13.61,0,0,0,44,43.41c-.25-.3-.5-.58-.77-.87A12.51,12.51,0,0,0,41.42,41L41,40.65l-.52-.31a13.4,13.4,0,0,0-1.22-.68h4.63v-2H38.05a7.88,7.88,0,0,0,2-4.48,5,5,0,0,0,.06-.88V32a7.83,7.83,0,0,0-2-4.95h0a10.57,10.57,0,0,1,2.52-1,5,5,0,0,0,8.49,0,12.13,12.13,0,0,1,3,1.27l.31.18.54.39a10.72,10.72,0,0,1,1.65,1.44l-1.12,2Zm-45.09,0H6.05v-.19A11.83,11.83,0,0,1,8,31l.48.83Zm4.86-20v0a5.83,5.83,0,0,1,1.52-3.95,5.93,5.93,0,0,1,1.58-1.28,6,6,0,0,1,2.84-.71,5.84,5.84,0,0,1,2.6.6,5.94,5.94,0,0,1,1.67,1.22A5.85,5.85,0,0,1,25,16.21l-2.45-1-2.56-1-2.54-1-.12.14-1.81,1.94Zm3.78,8c.26,0,.51,0,.79,0h2.37c.27,0,.54,0,.79,0A3.06,3.06,0,0,1,17.1,25.63Zm4.07-2.34a6.07,6.07,0,0,1-1.91.32A5.91,5.91,0,0,1,17,23.16a1.13,1.13,0,0,1-.21-.12,6.12,6.12,0,0,1-2-1.5,5.87,5.87,0,0,1-.94-1.49l.94-1,2.43-2.62,0-.05.78-.83.84.35.56.21,1.32.54.43.15,2.22.88,1.77.73a5.89,5.89,0,0,1-1.77,3.52A5.78,5.78,0,0,1,21.17,23.29Zm.23,29H19v-.19a11.82,11.82,0,0,1,1.94-6.49l.48.83Zm21.24-5.85.47-.83a11.74,11.74,0,0,1,1.94,6.49v.19H42.64ZM26.26,32.3h0a5.84,5.84,0,0,1,1.52-4h0a5.7,5.7,0,0,1,1.57-1.27h0a6.18,6.18,0,0,1,5.43-.12h0a6.22,6.22,0,0,1,1.65,1.21l0,0A5.85,5.85,0,0,1,38,30.83l-2.45-1h0l-2.53-1h0l-2.5-1L30.3,28l-1.81,1.94-.06.06ZM30,40.24H34A3,3,0,0,1,30,40.24Zm6.29-3.69,0,0a6,6,0,0,1-2.19,1.33h0a6.06,6.06,0,0,1-1.9.32,5.91,5.91,0,0,1-2.28-.45h0a1.28,1.28,0,0,1-.2-.11,6.12,6.12,0,0,1-2-1.5h0a6.13,6.13,0,0,1-.93-1.49l.93-1h0l2.38-2.56.09-.12.78-.82.82.34h0l.56.21,1.3.53h0l.41.14h0l2.19.87h0L38.1,33A5.89,5.89,0,0,1,36.33,36.55Zm2.84-18.87v0a5.83,5.83,0,0,1,1.51-3.95,6.13,6.13,0,0,1,1.59-1.28,6,6,0,0,1,2.84-.71,5.92,5.92,0,0,1,2.61.6,5.75,5.75,0,0,1,1.66,1.22,5.85,5.85,0,0,1,1.5,2.67l-2.46-1-2.56-1-2.52-1-.13.14-1.8,1.94Zm3.78,8c.26,0,.52,0,.78,0h2.38c.27,0,.54,0,.79,0A3.06,3.06,0,0,1,43,25.63ZM47,23.29a6,6,0,0,1-1.91.32,5.82,5.82,0,0,1-2.27-.45,1,1,0,0,1-.23-.12,5.88,5.88,0,0,1-2.94-3l.94-1,2.44-2.62.05-.05.76-.83.86.35.55.21,1.33.54.42.15,2.21.88,1.78.73a5.85,5.85,0,0,1-1.78,3.52A5.74,5.74,0,0,1,47,23.29Zm8.53,8.51L56,31A11.76,11.76,0,0,1,58,37.46v.19H55.55Z" ></path></svg>
    )
}

  const Slack = () => {
    
    return (
      <Box className={classes.slack_container}>
        {
          getAuthConnectToken() === 2 
          ?
              <svg fill="#fff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="21px" height="21px"><path d="M26 21H12c-.552 0-1 .448-1 1s.448 1 1 1h6v19c0 .552.447 1 1 1s1-.448 1-1V23h6c.552 0 1-.448 1-1S26.552 21 26 21zM55.5 27c3.033 0 5.5-2.467 5.5-5.5S58.533 16 55.5 16 50 18.467 50 21.5 52.467 27 55.5 27zM55.5 18c1.93 0 3.5 1.57 3.5 3.5S57.43 25 55.5 25 52 23.43 52 21.5 53.57 18 55.5 18z"/><path d="M46 27h-8c0 0 0 0 0 0v-4.261C38.951 23.526 40.171 24 41.5 24c3.033 0 5.5-2.467 5.5-5.5S44.533 13 41.5 13c-1.329 0-2.549.474-3.5 1.261V6.384c0-.889-.391-1.727-1.071-2.298-.682-.572-1.57-.812-2.45-.657L5.305 8.578C3.39 8.916 2 10.572 2 12.517l0 38.966c0 1.945 1.39 3.602 3.305 3.939l29.174 5.148c.175.031.35.046.523.046.699 0 1.381-.245 1.927-.703.68-.57 1.071-1.408 1.071-2.297v-8.16C38.901 49.803 39.896 50 41 50c4.573 0 6.559-3.112 6.97-4.757C47.99 45.163 48 45.082 48 45V29C48 27.897 47.103 27 46 27zM41.5 15c1.93 0 3.5 1.57 3.5 3.5S43.43 22 41.5 22 38 20.43 38 18.5 39.57 15 41.5 15zM35.643 58.382c-.133.112-.422.29-.816.219L5.652 53.453C4.695 53.284 4 52.456 4 51.483V12.517c0-.973.695-1.801 1.652-1.97l29.174-5.148c.394-.069.683.106.816.219C35.775 5.731 36 5.978 36 6.384l0 51.232C36 58.022 35.776 58.27 35.643 58.382zM46 44.855C45.82 45.396 44.756 48 41 48c-1.167 0-2.174-.245-3-.73V29h8V44.855zM60 29h-8c-1.103 0-2 .897-2 2v14c0 .39.226.744.58.907C51.401 46.288 53.542 47 55 47c4.573 0 6.559-3.112 6.97-4.757C61.99 42.163 62 42.082 62 42V31C62 29.897 61.103 29 60 29zM60 41.855C59.82 42.396 58.756 45 55 45c-.837 0-2.146-.364-3-.674V31h8V41.855z"/></svg>
          :
              getAuthConnectToken() === 1
              ?
                <svg version="1.1" width="36px" height="36px" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg> 
              :
                  <TeamBarIcon/>  
        }
      </Box>
    )
  }

  const companyname = useMemo(() => {
    return selectedCompanies.length > 0 && companiesList.filter( company => company.representative_id === selectedCompanies[0])
  }, [selectedCompanies, companiesList])


  const actionList = [
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
    /* {
      id: 0,
      name: 'Remove from this list', 
      icon: <Clear />,
      image: ''
    }, */
    {
      id: 2,
      name: 'Sell',
      image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/sell.png',
      icon: ''
    }, 
    {
      id: 4,
      name: 'License-Out',
      image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/licenseout.png',
      icon: ''
    },
    {
      id: 5,
      name: 'Add to Clipboard',
      image: '',
      icon: <Clipboard />
    },
    {
      id: 6,
      name: <RatingNecessary item={assetRating}/>,
      image: '',
      icon: <Clipboard />,
      item: false
    },
    {
      id: 7,
      name: <RatingImportant item={assetRating}/>,
      image: '',
      icon: <Clipboard />,
      item: false
    },
    {
      id: 9,
      name:  'Add a task/review',
      image: '',
      icon: <Slack />,
      item: false
    },
    /* {
      id: 6,
      name: 'Link to Our Products',
      image: '',
      icon: <Clipboard />
    },
    {
      id: 7,
      name: 'Link to Technology',
      image: '',
      icon: <Clipboard />
    },
    {
      id: 8,
      name: 'Link to Competition',
      image: '',
      icon: <Clipboard />
    } */
  ]

  const maintainanceActionList = [
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
    /* {
      id: 0,
      name: 'Abandon', 
      icon: <Clear />,
      image: ''
    }, */
    {
      id: 2,
      name: 'Sell',
      image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/sell.png',
      icon: ''
    }, 
    {
      id: 4,
      name: 'License-Out',
      image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/licenseout.png',
      icon: ''
    },
    {
      id: 5,
      name: 'Add to Clipboard',
      image: '',
      icon: <Clipboard />
    },
    {
      id: 6,
      name: <RatingNecessary item={assetRating}/>,
      image: '',
      icon: <Clipboard />,
      item: false
    },
    {
      id: 7,
      name: <RatingImportant item={assetRating}/>,
      image: '',
      icon: <Clipboard />,
      item: false
    },
    {
      id: 9,
      name:  'Add a task/review',
      image: '',
      icon: <Slack />,
      item: false
    },
    {
      id: 10,
      name: 'Pay Maintainence Fee', 
      icon: <MonetizationOn />,
      image: ''
    }
    /* {
      id: 6,
      name: 'Link to Our Products',
      image: '',
      icon: <Clipboard />
    },
    {
      id: 7,
      name: 'Link to Technology',
      image: '',
      icon: <Clipboard />
    },
    {
      id: 8,
      name: 'Link to Competition',
      image: '',
      icon: <Clipboard />
    } */
  ]

  let dropdownList = selectedCategory == 'pay_maintainence_fee' ? [...maintainanceActionList] : [...actionList]

  useEffect(() => {
    if(openChartBar === false && openAnalyticsBar === false && usptoMode === false) {
      /**
       * Change Visualbarwidth
       */
      changeVisualBar('0%')
    }
  }, [checkBar, usptoMode])


  useEffect(() => {
    if(display_sales_assets > 0) {
      dropdownList.splice(3,2)
    } else {
      dropdownList = selectedCategory == 'pay_maintainence_fee' ? [...maintainanceActionList] : [...actionList]
    }
  }, [display_sales_assets])

  useEffect(() => {
    if(selectedCategory == 'restore_ownership') {
      setOptionType(prevItem => 
        prevItem !== 'single' ? 'single' : prevItem
      )
    } 
  }, [selectedCategory])
    
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
    if(assetRows.length > 0 && (process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE')) {
      if(assetRows.length == 1 && selectedDefaultItem === false) {
        setSelectedDefaultItem(true)
        dispatch(setAssetTypesPatentsSelected([assetRows[0].asset]))
        setSelectItems([assetRows[0].asset])
        handleOnClick(assetRows[0])
      }
    }
  }, [assetRows, selectedDefaultItem])

  useEffect(() => {
    assetsAssignmentRef.current = assetTypeAssignmentAssets
  }, [assetTypeAssignmentAssets])

  useEffect(() => {
    dispatch(setClipboardAssets(selectedAssets))
  }, [selectedAssets])

  useEffect(() => {
    dispatch(setMoveAssets(movedAssets))
  }, [movedAssets])

  useEffect(() => {
    if(callByAuthLogin === true) {
      if(google_auth_token !== null && google_auth_token != '' && google_profile !== null && google_profile != '' && link_assets_sheet_type.type !== null && link_assets_sheet_type.asset !== null){
        setCallByAuth(false)
        const form = new FormData()
        form.append('access_token', google_auth_token.access_token)
        form.append('user_account', google_profile.email)
        dispatch(linkWithSheet(link_assets_sheet_type.type, form))
      }
    }
  }, [callByAuthLogin, google_auth_token, google_profile])

  useEffect(() => {
    if(Object.keys(ratingOnFly).length > 0 && ratingOnFly?.asset != '' && ratingOnFly?.asset != undefined){
      const getSlackToken = getTokenStorage("slack_auth_token_info");
      if (getSlackToken && getSlackToken != "") {
        /**
         * Find slack channel 
         * send message to this channel
         */
        const channelID = findChannelID(ratingOnFly.asset)
        if(channelID != '') {
          dispatch(setChannelID({channel_id: channelID}))          
        }
        sendRatingMessageToSlack(channelID, ratingOnFly)
      } else {
        /**
         * Alert user to login with slack first
         */
        alert("Please login to slack first");
      }
    }
  }, [ratingOnFly])

  const sendRatingMessageToSlack = async(channelID, rowData) => {
    try{
      const formData = new FormData()
      formData.append('text',  `${rowData.label.toUpperCase()} ${rowData.rating_value} star rating applied to this asset via PatenTrack` )
      formData.append('asset', rowData.asset)
      formData.append('asset_format', `us${rowData.asset}`)
      formData.append('user', '')
      formData.append('reply', '' )
      formData.append('edit', '')
      formData.append('file', '')
      formData.append('remote_file', '')
      formData.append('channel_id', channelID)
      const slackToken = getTokenStorage( 'slack_auth_token_info' )
      if( slackToken  && slackToken != null ) {
        const { access_token, bot_token, bot_user_id } = JSON.parse(slackToken)
        if( access_token != undefined) {  
          formData.append('auth', bot_token)
          formData.append('auth_id', bot_user_id)
          const { data } = await PatenTrackApi.sendMessage(access_token, formData)             
          if(data != '' && Object.keys(data).length > 0) {
            setRatingOnFly({})
          }
        }
      }
    } catch( err ) {
      console.error(err)
    }    
  }

  const openGoogleWindow = () => {
      if(googleLoginRef.current != null) {
          if(googleLoginRef.current.querySelector('button') !== null) {
              setCallByAuth(true)
              googleLoginRef.current.querySelector('button').click()
          } else {
              setTimeout(openGoogleWindow, 1000)
          }          
      } else {
          setTimeout(openGoogleWindow, 1000)
      }
  }

  const getSlackToken = () => {
    let token =  '';
    const slackToken = getTokenStorage( 'slack_auth_token_info' )
    if(slackToken && slackToken!= '' && slackToken!= null && slackToken!= 'null' ) {
      token = JSON.parse(slackToken)
        
      if(typeof token === 'string') {
        token = JSON.parse(token)
      }
    }
    return token
  }

  const onHandleDropDownlist = async(event, asset, row ) => { 
    if( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
      alert('Message....')
    } else {
      if(event.target.value  == 9) {
        /**
         * Slack review box
         */
        if(commentBar === false) {
          handleCommentBarOpen()
          dispatch(setAssetTypesPatentsSelected([row.asset]))
          setSelectItems([row.asset])
          handleOnClick(row)
        }
      } else if(event.target.value >= 6 && event.target.value <= 8) {
        //6=>Product,7=>Technology,8=>Competition
        /* setDropOpenAsset(null)
        const type = event.target.value === 7 ? 'technology' : event.target.value === 8 ? 'competitors' : 'products'
        dispatch(linkWithSheetOpenPanel(true))
        dispatch(linkWithSheetSelectedAsset(type, encodeURIComponent(row.asset_type == 1 ? `US${applicationFormat(asset)}` : `US${numberWithCommas(asset)}`))) */    
        setRatingOnFly( previousItem => {
          if(Object.keys(previousItem).length > 0) {
            return {...previousItem, ...row}            
          } else {
            return previousItem
          }
        })    
      } else {
        if(type === 9 && event.target.value === 0) {
          /***
          * Asset remove from spreadsheet
          */
          const googleToken = getTokenStorage( 'google_auth_token_info' )
          const googleProfile = getTokenStorage('google_profile_info')
          const token = JSON.parse(googleToken)  
          const profile = JSON.parse(googleProfile)
          if( token !== null && profile !== null) {
            const { access_token } = token  
            const form = {
              user_account: profile.email,
              item_type: 'delete',
              access_token: access_token,
              sheet_name: foreignAssets.selectNames[foreignAssets.selectNames.length - 1],
              sheet_id: foreignAssets.selected[foreignAssets.selected.length - 1],
              delete_item: asset
            }
            const {data} = await PatenTrackApi.deleteItemFromExternalSheet(form)
            if(data !== null && typeof data.message !== 'undefined' && data.message == 'Row deleted') {
              const oldAssets = [...assetsAssignmentRef.current]
              const findIndex = oldAssets.findIndex( item => item.asset == asset)
              if(findIndex !== -1) {
                setDropOpenAsset(null)
                oldAssets.splice(findIndex, 1)
                dispatch(
                  setAssetTypeAssignmentAllAssets({ list: oldAssets, total_records: oldAssets.length }),
                );
              }
            }
          }
        } else {
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
          } else if (event.target.value == 2 || event.target.value == 4) {
            /**
             * Assets for Sale or LicenseOut
             * Check Slack Auth
             */
            let token =  getSlackToken();

            if(token !== '') {
              const { access_token, bot_token, bot_user_id } = JSON.parse(token)
              const formData = new FormData()
              formData.append('appno_doc_num', row.appno_doc_num)
              formData.append('grant_doc_num', row.grant_doc_num)
              formData.append('auth', bot_token)
              formData.append('auth_id', bot_user_id)
              formData.append('code', access_token)
              formData.append('type', event.target.value)
              const { data } = await PatenTrackApi.moveAssetForSale(formData)
              if( data  !== null) {
  
              }
            } else {
              /**
               * Alert user to login with slack first
              */
              alert("Please login to slack first");
            }
          } else if (event.target.value === 0) {
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
          } else if (event.target.value === 10) {
            updateMaintainenceSelection(asset, row)
          } 
          const currentLayoutIndex = controlList.findIndex(r => r.type == 'menu' && r.category == selectedCategory )
          if(currentLayoutIndex !== -1) {
            setDropOpenAsset(null)
            setMovedAssets(prevItems => {
              const findIndex = prevItems.findIndex(row => row.asset == asset)
              
              if(findIndex !== -1) {
                const items = [...prevItems]
                if(items[findIndex].move_category === 10) {
                  /**
                   * Pay Maintainence Fee
                   */
                  updateMaintainenceSelection(asset, row)
                }
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
      }      
    }    
  }

  const updateMaintainenceSelection = (asset, row) => {
    let token =  getSlackToken();

    if(token !== '') {
      let updateSelected = [];
      const { access_token, bot_token, bot_user_id } = JSON.parse(token)
      let message = `${row.grant_doc_num != '' ? numberWithCommas(row.grant_doc_num) : applicationFormat(row.appno_doc_num)} `
      setMaintainenceItems(prevItems => {
        updateSelected = [...prevItems];
        const findIndex = prevItems.findIndex( r => r.asset == asset)
        if( findIndex !== -1 ) {
          message += `removed `
          updateSelected = maintainenceItems.filter(
            item => item[1] !== parseInt(row.appno_doc_num)
          );
        } else {
          message += `added `
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
        return updateSelected
      }) 
      message += ` to maintainence list. `  
      
      
      dispatch(setSelectedMaintainenceAssetsList(updateSelected));

      (async() => {
        let name = companyname[0].original_name
        let formattedName = name.replace(/\s/g,'').replace(/["']/g, "").trim().substr(0, 20)

        let channelID = ''
        if(slack_channel_list.length > 0 && formattedName != '') {
          const findIndex = slack_channel_list.findIndex( channel => channel.name == formattedName.toString().toLocaleLowerCase())
      
          if( findIndex !== -1) {
            channelID = slack_channel_list[findIndex].id
          }
        }
        const formData = new FormData()
        formData.append('text',  message)
        formData.append('asset', name)
        formData.append('asset_format', formattedName.toLocaleLowerCase())
        formData.append('user', '')
        formData.append('reply', '' )
        formData.append('edit', '')
        formData.append('file', '')
        formData.append('remote_file', '')
        formData.append('channel_id', channelID)
        formData.append('auth', bot_token)
        formData.append('auth_id', bot_user_id)
        const { data } = await PatenTrackApi.sendMessage(access_token, formData) 
        console.log(`maintainenece`, data)
      })() 
    } else {
      /**
       * Alert user to login with slack first
      */
      alert("Please login to slack first");
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
    /* {
      width: 20,
      minWidth: 20,
      label: "",
      dataKey: "asset",
      role: "arrow",
      disableSort: true,
      headingIcon: 'assets',
    },  */
    {
      width: isMobile === true ? 150 : 100,  
      minWidth: isMobile === true ? 150 : 100,  
      label: "Assets",  
      /* dataKey: "format_asset", */
      dataKey: "asset",
      staticIcon: "US",
      format: numberWithCommas,
      formatCondition: 'asset_type',
      formatDefaultValue: 0,
      secondaryFormat: applicationFormat,
      align: "center",
      show_selection_count: true,
      badge: true,
      /* styleCss: true,
      justifyContent: 'center' */
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
    }
  ];

  const MAINTAINCE_COLUMNS = [
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
    /* {
      width: 20,
      minWidth: 20,
      label: "",
      dataKey: "asset",
      role: "arrow",
      disableSort: true,
      headingIcon: 'assets',
    },  */
    {
      width: isMobile === true ? 150 : 100,  
      minWidth: isMobile === true ? 150 : 100,  
      label: "Assets",  
      /* dataKey: "format_asset", */
      dataKey: "asset",
      staticIcon: "US",
      format: numberWithCommas,
      formatCondition: 'asset_type',
      formatDefaultValue: 0,
      secondaryFormat: applicationFormat,
      align: "center",
      show_selection_count: true,
      badge: true,
      /* styleCss: true,
      justifyContent: 'center' */
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
      width: 100,
      minWidth: 100,
      label: "Grace Ends",
      dataKey: "payment_grace",
    }
  ];

  

  const [ tableColumns, setTableColumns ] = useState( selectedCategory == 'pay_maintainence_fee' ? MAINTAINCE_COLUMNS : COLUMNS)

  useEffect(() => {
    //console.log('ASSETS', display_clipboard, selectedAssetCompanies, selectedAssetCompaniesAll)
    if(display_clipboard === false) {
      setTableColumns(selectedCategory == 'pay_maintainence_fee' ? [...MAINTAINCE_COLUMNS] : [...COLUMNS])
      setWidth(1500)
      if (standalone) {
        if( type === 9 ) {
          if(foreignAssets.selected.length > 0 ) {
            if( assetTypeAssignmentAssets.length === 0 ) {
              const googleToken = getTokenStorage( 'google_auth_token_info' )
              const token = JSON.parse(googleToken)  
              const { access_token } = token  
              if(access_token) {
                const form = new FormData()
                form.append('account', google_profile.email)
                form.append('token', access_token)
                form.append('sheet_names', JSON.stringify(foreignAssets.selectNames))
                dispatch(getForeignAssetsBySheet(form))
              }   
            }                     
          } else {
            dispatch(  
              setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }),
            );
            dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) )
          }          
        }  else {
          console.log('selectedAssetCompanies', selectedAssetCompanies)
          if(assetTypeAssignmentAssets.length === 0 && assetTypeAssignmentAssetsLoading === false) { 
            loadDataFromServer(offsetWithLimit[0], offsetWithLimit[1], sortField, sortOrder)   
          }         
          if(selectedCategory == 'restore_ownership') {    
            /* let cols = [...COLUMNS] */
            /* cols[1].role = 'radio'
            delete cols[1].show_selection_count  */
            /* cols.splice(1,1)
            setTableColumns(cols) */
          }
        }
      } else {
        console.log('Assets FromTransaction', transactionId)
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
    display_sales_assets,
    auth_token,
    switch_button_assets        
  ]);


  useEffect(() => {
    setAssetRows(assetTypeAssignmentAssets)
    if(assetTypeAssignmentAssets.length > 0 && assetTypeAssignmentAssetsSelected.length > 0) {
      const excludeSelections = []
      const checkElement = assetTypeAssignmentAssetsSelected.map( asset => {
        const findIndex = assetTypeAssignmentAssets.findIndex(row => row.asset == asset)
        if(findIndex === -1) {
          excludeSelections.push(asset)
        }
      })      
      Promise.all(checkElement)
      if(excludeSelections.length > 0) {        
        const newSelectedAssets = [...assetTypeAssignmentAssetsSelected]
        const mapSelection = excludeSelections.map( asset => {
          const findIndex = newSelectedAssets.findIndex( item => item == asset)
          if(findIndex !== -1) {
            newSelectedAssets.splice(findIndex, 1)
          }
        })
        Promise.all(mapSelection)
        dispatch(setAssetTypesPatentsSelected(newSelectedAssets));
        setSelectItems(newSelectedAssets)
      }
      if(selectedAssetsPatents.length > 0) {
        const findIndex = assetTypeAssignmentAssets.findIndex(row => row.asset == selectedAssetsPatents[0] || row.rf_id == selectedAssetsPatents[1])
        if(findIndex === -1) {
          resetAll()
        }        
      }
    } 
  }, [ assetTypeAssignmentAssets ])

  /* useEffect(() => {
    const getSaleOrLiceOutAssets = async () => {
      const {data} = await PatenTrackApi.getSaleOrLiceOutAssets()
      if(data != null && data.length > 0) {

      }
    }
    getSaleOrLiceOutAssets()
  }, []) */

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
      tableColumns.splice(3,1)
      setTableColumns(tableColumns)
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
      } else {
        const oldAssets = [...assetTypeAssignmentAssets]
        const newArray = oldAssets.map(({channel, ...keepOtherAttrs}) => keepOtherAttrs)
        setAssetRows(newArray)
      }
    }    
    checkAssetChannel()
  },[ slack_channel_list, assetTypeAssignmentAssets, selectedRow])


  useEffect(() => {
    if(slack_channel_list.length == 0 && slack_channel_list_loading === false) {
      const slackToken = getTokenStorage( 'slack_auth_token_info' )
      if(slackToken && slackToken!= '' && slackToken!= null && slackToken!= 'null' ) {
        let token = JSON.parse(slackToken)
        
        if(typeof token === 'string') {
          token = JSON.parse(token)
          setTokenStorage( 'slack_auth_token_info', token )

        }
        
        if(typeof token === 'object' && token !== null) {
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
    } else if (selectedAssetsPatents.length == 0 && selectedRow.length > 0) {
      setSelectedRow([])
    }
  }, [selectedAssetsPatents, selectedRow])


  

  useEffect(() => {    
    if(assetTypeAssignmentAssetsSelected.length > 0 && (selectItems.length == 0 || selectItems.length != assetTypeAssignmentAssetsSelected.length) ){
      setSelectItems(assetTypeAssignmentAssetsSelected)
    } else if(assetTypeAssignmentAssetsSelected.length == 0 && selectItems.length > 0 ) {
      setSelectItems([])
    }
  }, [ assetTypeAssignmentAssetsSelected, selectItems ])

  useEffect(() => {
    if(assetTypeAssignmentAssetsSelectedAll !== selectedAll) {
      setSelectAll(assetTypeAssignmentAssetsSelectedAll)
    }
  }, [assetTypeAssignmentAssetsSelectedAll])

  useEffect(() => {
    let filter = []    
    if(assetTypeAssignmentAssets.length > 0 && selectedAssetsPatents.length > 0) {
      filter = assetTypeAssignmentAssets.filter( row => row.asset == selectedAssetsPatents[0].toString() || row.asset == selectedAssetsPatents[1].toString() )
      if(filter.length === 0) {
        resetAll()
      }
    }
  }, [ assetTypeAssignmentAssets ]) 

  const loadDataFromServer = (startIndex, endIndex, column, direction) => {
    
    const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
          tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
          customers = selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies,
          assignments = selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;   
     
    if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
      if (auth_token != null && assetTypeAssignmentAssetsLoading === false ) {  
        console.log('ASSETS LOAD loadDataFromServer')        
        dispatch(
          process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD'
          ? 
            getCustomerAssets(
              selectedCategory == '' ? '' : selectedCategory,
              companies,
              tabs,
              customers,
              assignments,
              true,
              startIndex,
              endIndex,
              column,
              direction
            )
          :
          getCustomerSelectedAssets(location.pathname.replace('/', ''))
        );          
        setWidth(1900)
      } else {
        dispatch(
          setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }),
        );
        dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) )
      }
    } else {
      if ((selectedCompaniesAll === true || selectedCompanies.length > 0) && assetTypeAssignmentAssetsLoading === false ) {
        console.log('ASSETS LOAD loadDataFromServer')
        PatenTrackApi.cancelAssetsRequest()
        dispatch(
          getCustomerAssets(
            selectedCategory == '' ? '' : selectedCategory,
            companies,
            tabs,
            customers,
            assignments,
            false,
            startIndex,
            endIndex,
            column,
            direction,
            0,
            display_sales_assets
          ),
        );
        setWidth(1900)
      } else {
        //PatenTrackApi.cancelAssets()
        dispatch(
          setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 }),
        );
        dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) ) 
      }
    }
  }
  
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

  /**
   * Row Click
   */

  const handleOnClick = useCallback(
    ({ grant_doc_num, appno_doc_num, asset }) => {     
      /*TV, Comment, Family, FamilyItem, getChannelID Legal Events */
      if(!selectedRow.includes(asset)) {
        if(selectedCategory == 'restore_ownership') {
          dispatch(setAssetTypesPatentsSelected([asset]))
          setSelectItems([asset])
        }
        if(selectedCategory == 'technical_scope') {
          dispatch(linkWithSheetOpenPanel(true))
          dispatch(linkWithSheetSelectedAsset('products', encodeURIComponent(grant_doc_num  == '' ? `US${applicationFormat(appno_doc_num)}` : `US${numberWithCommas(grant_doc_num)}`)))     
        }
        callSelectedAssets({ grant_doc_num, appno_doc_num, asset });
        if(defaultViewFlag === 0) {
          let changeBar = false
          if(openIllustrationBar === false) {
            changeBar = true
            handleIllustrationBarOpen() 
          }
          if(commentBar === false) {
            changeBar = true
            handleCommentBarOpen() 
          }
          if(openChartBar === false) {
            changeBar = true
            handleChartBarOpen()
          }
          if(openAnalyticsBar === false) {
            changeBar = true
            handleAnalyticsBarOpen()
          }

          if(changeBar === true) {
            handleVisualBarSize(true, true, true, true)
          }
          setDefaultViewFlag(1)
        }
        if(selectedCategory == 'incorrect_names' || selectedCategory == 'pay_maintainence_fee' || selectedCategory == 'late_maintainance' || selectedCategory == 'ptab' || selectedCategory == 'to_be_monitized' ){
          /**
           * Check if Right Pane is close then open it and close the TV
           */
          /* if(defaultViewFlag === 0) {
            if(selectedCategory == 'to_be_monitized') {
              if(openChartBar === true) {
                handleChartBarOpen()
              }
              if(openAnalyticsBar === false) {
                handleAnalyticsBarOpen()
              }
            } else {
              if(openChartBar === false) {
                handleChartBarOpen()
              }
              if(openAnalyticsBar === false) {
                handleAnalyticsBarOpen()
              }
              if(openIllustrationBar === true && selectedCategory != 'late_maintainance') {
                handleIllustrationBarOpen('100%')
                handleVisualBarSize(false, true, false, false)
              }
            }
            setDefaultViewFlag(1)
          }  */
        } else if (selectedCategory == 'top_non_us_members') {
          /* if(defaultViewFlag === 0) {
            if(openChartBar === false) {
              handleChartBarOpen()
              if(openIllustrationBar === true) {
                handleIllustrationBarOpen('100%')
                handleVisualBarSize(false, true, false, false)
              }
            }
            setDefaultViewFlag(1)
          } */
        }
        setCheckBar(!checkBar)        
        dispatch(setChildSelectedAssetsPatents([]));
        dispatch(setSelectedAssetsTransactions([]));
        //dispatch(setDocumentTransaction([]));
        dispatch(setMainCompaniesRowSelect([]));
        dispatch(setAssetTypeSelectedRow([]));
        dispatch(setAssetTypeCustomerSelectedRow([]));
        dispatch(setChildSelectedAssetsTransactions([]));
        dispatch(setAssetFamily([]));
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
        PatenTrackApi.cancelFamilyCounterRequest()
        PatenTrackApi.cancelClaimsCounterRequest()
        PatenTrackApi.cancelFiguresCounterRequest()
        PatenTrackApi.cancelPtabCounterRequest()
        PatenTrackApi.cancelCitationCounterRequest()
        PatenTrackApi.cancelFeesCounterRequest()
        PatenTrackApi.cancelStatusCounterRequest()
        dispatch(getAssetDetails(appno_doc_num, grant_doc_num))
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
            flag: grant_doc_num !== '' && grant_doc_num !== null ? 1 : 0
        }),
        );
        dispatch(
        setCommentsEntity({
            type: "asset",
            id: grant_doc_num || appno_doc_num,
        }),
        );
        

        dispatch(assetFamilySingle(appno_doc_num))
        dispatch(assetLegalEvents(appno_doc_num, grant_doc_num))
        dispatch(assetFamily(appno_doc_num))
        dispatch(setSlackMessages({ messages: [], users: [] }))
        const channelID = findChannelID(grant_doc_num != '' ? grant_doc_num : appno_doc_num)        
        if( channelID != '') {
          dispatch(setChannelID({channel_id: channelID}))
        }
        //dispatch(getChannelID(grant_doc_num, appno_doc_num));
        /* if(openAnalyticsBar === false || openChartBar === false) {
            openAnalyticsAndCharBar()
        } */
      } else {
        setCheckBar(!checkBar)
        resetAll()
        console.log('selectedCategory', selectedCategory)
        if(selectedCategory == 'restore_ownership') {
          dispatch(setAssetTypesPatentsSelected([]))
          setSelectItems([])
        } else if (selectedCategory == 'incorrect_names') {
          console.log('selectedCategory', openChartBar, openAnalyticsBar, openIllustrationBar)
          /* if(openChartBar === true) {
            handleChartBarOpen()
          }
          if(openAnalyticsBar === true) {
            handleAnalyticsBarOpen()
          }
          if(openIllustrationBar === false) {
            handleIllustrationBarOpen('0%')
            handleVisualBarSize(false, false, false, true)
          } */
        }
      }
    },
    [ dispatch, defaultViewFlag, selectedAssetsPatents, selectedRow, openAnalyticsBar, openChartBar ],
  );

const resetAll = useCallback(() => {
    setSelectedRow([])
    dispatch(setAssetsIllustration(null))
    dispatch(setAssetsIllustrationData(null))
    dispatch(setSelectedAssetsPatents([]))
    dispatch(setAssetFamily([]))
    dispatch(setFamilyItemDisplay({}))
    dispatch(setChannelID(''))
    dispatch(setConnectionBoxView(false))
    dispatch(setPDFView(false))

    dispatch(toggleUsptoMode(false))
    dispatch(toggleLifeSpanMode(true))
    dispatch(toggleFamilyMode(false))
    dispatch(toggleFamilyItemMode(false))

    dispatch(setDriveTemplateFrameMode(false))

    dispatch(linkWithSheetOpenPanel(false))
    dispatch(linkWithSheetSelectedAsset(null, null))
    dispatch(setLinkAssetData([]))
    dispatch(setLinkAssetListSelected([]))
    dispatch(resetAssetDetails())
    
}, [dispatch, openChartBar, openAnalyticsBar])

/* const onDoubleClick = (e, row, flag) => {
  setCurrentSelection(row.asset) 
  setAsset(row.appno_doc_num)
  setClientEvent({x: e.clientX, y: e.clientY})    
} */

/**
 * On Mouseover open Child list on Modal
 */
const onMouseOver = (e, row, flag) => {
  applicationNumber = row.appno_doc_num
  setAnchorEl(e.currentTarget);
  assetNumber = row.asset 
  if(hoverTimer !== null) {
    clearTimeout(hoverTimer)
  }    
  hoverTimer = setTimeout(() => {
    checkMouseStillOnHover(e, assetNumber)
  }, 3000)   
}

const onMouseOut =  (e, row, flag) => {
  setCurrentSelection(null) 
  setAsset(null)
  setAnchorEl(null)
  applicationNumber = null
  assetNumber = null
  clearTimeout(hoverTimer)
}


const checkMouseStillOnHover = (e, number) => {
  if(number === assetNumber) {
    setCurrentSelection(applicationNumber) 
    setAsset(assetNumber)
  }  
}

/**
 * Retireve slack messages and also retrieve Rating and Necessary
 * @param {*} asset 
 */
const retrieveSlackMessages = async(asset) => {
  const getSlackToken = getTokenStorage("slack_auth_token_info");
  
  
  if (getSlackToken && getSlackToken != "") {
    const channelID = findChannelID(asset)
    if(channelID != '') {
      const { access_token, bot_token, bot_user_id } = JSON.parse(getSlackToken)
      if(access_token != '' && access_token != null && access_token != undefined) {
        const { data } = await PatenTrackApi.getMessages( access_token, channelID);
        if(data.messages.length > 0) {
          /**
           * Find String Necessary or Important and also via PatenTrack
           */
          const ratingItems = []
          data.messages.forEach( item => {
            if(item.type == 'message') {
              const {text} = item
              if(text != '') {
                console.log(text, text.toLowerCase().indexOf('necessary'), text.indexOf('via PatenTrack'))
                console.log(text, text.toLowerCase().indexOf('important'), text.indexOf('via PatenTrack'))
                if(text.toLowerCase().indexOf('necessary') !== -1 && text.indexOf('via PatenTrack') !== -1) {
                  /**
                   * Find Necessary
                   */
                  const value = text.match(/\d+/)[0]
                  ratingItems.push({
                    name: 'Necessary',
                    value
                  })
                }

                if(text.toLowerCase().indexOf('important') !== -1 && text.indexOf('via PatenTrack') !== -1) {
                  /**
                   * Find Important
                   */
                  const value = text.match(/\d+/)[0]
                  ratingItems.push({
                    name: 'Important',
                    value
                  })
                }
              }
            }
          });
          if(ratingItems.length > 0) {
            updateTableColumn(ratingItems)
          }
        }        
      }       
    } 
  }
}

const updateTableColumn = (ratingItems) => {
  setAssetRating(ratingItems)
  let findIndex = dropdownList.findIndex( item => item.id == 6)
  if(findIndex !== -1) {
    dropdownList[findIndex].name = <RatingNecessary item={ratingItems} />
  }
  findIndex = dropdownList.findIndex( item => item.id == 7)
  if(findIndex !== -1) {
    dropdownList[findIndex].name = <RatingImportant item={ratingItems} />
  }
  let previousColumns = [...tableColumns]
  const columnIndex = previousColumns.findIndex(item => item.role == 'static_dropdown')
  if(columnIndex !== -1) {
    previousColumns[columnIndex].list = dropdownList
    setTableColumns(previousColumns)
  }
}

  /**
   * Click checkbox
   */
  const handleClickSelectCheckbox = useCallback(
    (e, row) => {
        e.preventDefault()
        const { checked } = e.target
        let cntrlKey = e.ctrlKey ? e.ctrlKey : e.metaKey ? e.metaKey : undefined;
        if(dashboardScreen === true) {
          dispatch(setTimelineScreen(true))
          dispatch(setDashboardScreen(false))
        }
        let oldSelection = [...selectItems];
        console.log('cntrlKey', cntrlKey)
        if(cntrlKey !== undefined) {
          if(selectedCategory == 'restore_ownership' && display_clipboard === false) {
            dispatch(setAssetTypesPatentsSelected([row.asset]))
            setSelectItems([row.asset])
            handleOnClick(row)
          } else {
            let oldSelection = [...selectItems], newItem = false
            if (!oldSelection.includes(row.asset)) {
              oldSelection.push(row.asset);
              newItem = true
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
            if(oldSelection.length == 1) {
              if(newItem === true){
                handleOnClick(row)
              } else {
                const findIndex = assetRows.findIndex( item => item.asset === oldSelection[0])
                if(findIndex !== -1) {
                  handleOnClick(assetRows[findIndex])
                }
              }
            } else {
              setCheckBar(!checkBar)
              resetAll()
            }
          }
          dispatch(setAssetTypesPatentsSelectAll(false))                      
        } else {
          if(typeof e.target.closest == 'function') {
            const element = e.target.closest('div.ReactVirtualized__Table__rowColumn')
            if(element != null) {
              let index = element.getAttribute('aria-colindex')   
              const findElement = element.querySelector('div.MuiSelect-select')
                if( index == 2 && findElement != null ) {
                  setDropOpenAsset(row.asset)
                  updateTableColumn([])
                  /**
                   * Retreive slack messages for this assets
                   */
                  retrieveSlackMessages(row.asset)
                } else {                  
                  if (!oldSelection.includes(`${row.asset}`)) {
                    dispatch(setAssetTypesPatentsSelected([row.asset]))
                    setSelectItems([row.asset])
                    handleOnClick(row)
                  } else {
                    clearSelections()
                  }                  
                }
            } else {
              if( row.asset == dropOpenAsset ) {
                setDropOpenAsset(null)
              } else {
                if (!oldSelection.includes(row.asset)) {
                  dispatch(setAssetTypesPatentsSelected([row.asset]))
                  setSelectItems([row.asset])
                  handleOnClick(row)
                } else {
                  clearSelections()
                }  
              }
            }
          }                         
        }         
    },
    [dispatch, dashboardScreen, selectedAssetsPatents, selectItems, currentSelection, dropOpenAsset],
  );


  const clearSelections = () => {
    dispatch(setAssetTypesPatentsSelected([]))
    setSelectItems([]); 
    setCheckBar(!checkBar)
    resetAll()
  }
  /**
   * Click All checkbox
   */

  const onHandleSelectAll = useCallback(
    async(event, row) => {
      event.preventDefault();
      const { checked } = event.target;
      setSelectItems([]);
      dispatch(setAssetTypesPatentsSelected([]))
      setSelectAll(false);
      dispatch(setAssetTypesPatentsSelectAll(false))
      /* if (checked === false) {
        setSelectItems([]);
        dispatch(setAssetTypesPatentsSelected([]))
      } else if (checked === true) {
        let items = [],
          list = [...assetRows]
        const promise = list.map(item =>
          items.push(item.asset),
        ); 
        await Promise.all(promise);
        setSelectItems(items);
        dispatch(setAssetTypesPatentsSelected(items))
      }
      setSelectAll(checked);
      dispatch(setAssetTypesPatentsSelectAll(checked)) */
    },
    [dispatch, assetRows ],
  );

  const findChannelID = useCallback((asset) => {
    let channelID = ''
    if(slack_channel_list.length > 0 && asset != undefined) {
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
      previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width 
    }
    setTableColumns(previousColumns)
  }, [ tableColumns ] )

  const loadMoreRows =  (startIndex, endIndex) => {
   
    if(startIndex != endIndex && startIndex < totalRecords ) {
      setOffsetWithLimit([startIndex, endIndex])
      const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
            tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
            customers =
              selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies,
            assignments =
              selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;
      if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
        if (auth_token != null) {
          dispatch(
            process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ? 
            getCustomerAssets(
              selectedCategory == '' ? '' : selectedCategory,
              companies,
              tabs,
              customers,
              assignments,
              true,
              startIndex,
              endIndex,
              sortField,
              sortOrder,
              assetTableScrollPosition
            )
            : 
            getCustomerSelectedAssets(location.pathname.replace('/', ''))
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
              true,
              startIndex,
              endIndex,
              sortField,
              sortOrder,
              assetTableScrollPosition,
              display_sales_assets
            ),
          );
        }
      }
    }
  }

  const handleSortData = (direction, column) => {
    setSortField(column)
    setSortOrder(direction)
    setOffsetWithLimit([0, DEFAULT_CUSTOMERS_LIMIT])
    dispatch(setAssetTableScrollPos(0))
    
    const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
          tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
          customers =
            selectedAssetCompaniesAll === true ? [] : selectedAssetCompanies,
          assignments =
            selectedAssetAssignmentsAll === true ? [] : selectedAssetAssignments;
    if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ) {
      if (auth_token != null) {
        dispatch(
          process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ? 
          getCustomerAssets(
            selectedCategory == '' ? '' : selectedCategory,
            companies,
            tabs,
            customers,
            assignments,
            false,
            0,
            DEFAULT_CUSTOMERS_LIMIT,
            column,
            direction
          )
          : 
          getCustomerSelectedAssets(location.pathname.replace('/', ''))
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
            0,
            DEFAULT_CUSTOMERS_LIMIT,
            column,
            direction,
            0,
            display_sales_assets
          ),
        );
      }
    }
  }

  const onScrollTable = (scrollPos) => {
    dispatch(setAssetTableScrollPos(scrollPos))   
  }

  const handleModalClose = () => {
    setAnchorEl(null)
    setCurrentSelection(null)
    setAsset(null)
  }

  if (
    (!standalone && assetTypeAssignmentLoadingAssets) ||
    (standalone && assetTypeAssignmentAssetsLoading)
  )
    return <Loader />;

  return (
    <Paper
      className={clsx(classes.root, {[classes.mobile]: isMobile === true && (fileBar === true || driveBar === true)})}
      square
      id={`assets_type_assignment_all_assets`}
      data_option={optionType}
    >
      <VirtualizedTable 
        classes={classes}
        scrollTop={assetTableScrollPosition}
        openDropAsset={dropOpenAsset}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedIndex={currentSelection}
        selectedKey={"asset"}
        dropdownSelections={move_assets}
        rows={assetRows}
        rowHeight={rowHeight}
        headerHeight={headerRowHeight}
        columns={tableColumns}
        onSelect={handleClickSelectCheckbox}
        onSelectAll={onHandleSelectAll}
        defaultSelectAll={selectedAll}
        resizeColumnsWidth={resizeColumnsWidth}
        resizeColumnsStop={resizeColumnsStop}        
        showIsIndeterminate={false}
        /* hover={true}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}  */
        /*onDoubleClick={onDoubleClick}*/
        /* renderCollapsableComponent={
          <ChildTable asset={asset} headerRowDisabled={true} />
        } */
        sortDataLocal={false}
        sortDataFn={handleSortData}
        forceChildWaitCall={true}
        totalRows={totalRecords} 
        getMoreRows={loadMoreRows}
        onScrollTable={onScrollTable}
        defaultSortField={sortField}
        defaultSortDirection={sortOrder}
        selectItemWithArrowKey={true}
        /* columnTextBoldList={slack_channel_list} */
        responsive={true}
        noBorderLines={true}
        highlightRow={true} 
        higlightColums={[2]}
        width={width}
        containerStyle={{
          width: "100%",
          maxWidth: "100%",
        }}
        style={{
          width: "100%",
        }}
      />
      {
        googleAuthLogin && (
          <span ref={googleLoginRef}>
            <Googlelogin/> 
          </span>)
      }
      {
        asset !== null 
        ?
        <Popover
          open={openModal}
          anchorEl={anchorEl}
          onClose={handleModalClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }} 
        >
          <div style={{width: 200, height: 200, overflow: 'hidden auto', background: '#424242', padding: 10}}>
            <ChildTable asset={asset} headerRowDisabled={true} />
          </div>        
        </Popover>
        :
        ''
      }      
    </Paper>
  );
};

export default AssetsTable;