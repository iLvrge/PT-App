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
  setSelectedMaintainenceAssetsList
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

import { getTokenStorage, setTokenStorage } from "../../../utils/tokenStorage";

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
  const [assetRows, setAssetRows] = useState([])
  const [ googleAuthLogin, setGoogleAuthLogin ] = useState(true)
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

  const Slack = () => {
    return (
      <Box className={classes.slack_container}>
        <svg version="1.1" width="36px" height="36px" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg>
      </Box>
    )
  }


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
    {
      id: 0,
      name: 'Abandon', 
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
      name: <Slack label={'Add a task/review'}/>,
      image: '',
      icon: '',
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
    if(display_sales_assets === true) {
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

  }, [assets])

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
          * Asset remove from sreadsheet
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
            let token =  '';
            const slackToken = getTokenStorage( 'slack_auth_token_info' )
            if(slackToken && slackToken!= '' && slackToken!= null && slackToken!= 'null' ) {
              token = JSON.parse(slackToken)
               
              if(typeof token === 'string') {
                token = JSON.parse(token)
              }
            }

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
    let updateSelected = [];
    setMaintainenceItems(prevItems => {
      updateSelected = [...prevItems];
      const findIndex = prevItems.findIndex( r => r.asset == asset)
      if( findIndex !== -1 ) {
        updateSelected = maintainenceItems.filter(
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
      return updateSelected
    })   

    dispatch(setSelectedMaintainenceAssetsList(updateSelected));
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
          if(assetTypeAssignmentAssets.length === 0 ) {
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
      tableColumns[3].label = 'Clipboard'
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
      if (auth_token != null) {          
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
      if (selectedCompaniesAll === true || selectedCompanies.length > 0) {
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
        if(selectedCategory == 'pay_maintainence_fee' || selectedCategory == 'late_maintainance' || selectedCategory == 'ptab'){
          /**
           * Check if Right Pane is close then open it and close the TV
           */
          if(openChartBar === false) {
            handleChartBarOpen()
          }
          if(openAnalyticsBar === false) {
            handleAnalyticsBarOpen()
          }
          if(openIllustrationBar === true) {
            handleIllustrationBarOpen('100%')
            handleVisualBarSize(false, true, false, false)
          }
        } else if (selectedCategory == 'top_non_us_members') {
          if(openChartBar === false) {
            handleChartBarOpen()
            if(openIllustrationBar === true) {
              handleIllustrationBarOpen('100%')
              handleVisualBarSize(false, true, false, false)
            }
          }
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
        PatenTrackApi.cancelFamilyCounter()
        PatenTrackApi.cancelClaimsCounter()
        PatenTrackApi.cancelFiguresCounter()
        PatenTrackApi.cancelPtabCounter()
        PatenTrackApi.cancelCitationCounter()
        PatenTrackApi.cancelFeesCounter()
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
        dispatch(assetLegalEvents(appno_doc_num, grant_doc_num));
        dispatch(assetFamily(appno_doc_num));
        dispatch(setSlackMessages({ messages: [], users: [] }));
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
        if(selectedCategory == 'restore_ownership') {
          dispatch(setAssetTypesPatentsSelected([]))
          setSelectItems([])
        }
      }
    },
    [ dispatch, selectedAssetsPatents, selectedRow, openAnalyticsBar, openChartBar ],
  );

const resetAll = useCallback(() => {
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