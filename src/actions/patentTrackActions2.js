import * as types from './actionTypes2'
import PatenTrackApi, { DEFAULT_CUSTOMERS_LIMIT, DEFAULT_TRANSACTIONS_LIMIT, DEFAULT_PATENTS_LIMIT } from '../api/patenTrack2'

import { 
  toggleLifeSpanMode, 
  setDriveTemplateFrameMode, 
  setDriveTemplateMode, 
  resetUiStates,
  toggleUsptoMode, 
  toggleFamilyMode,
  toggleFamilyItemMode
} from './uiActions'
import {
  setConnectionBoxView,
  setPDFView,
  setPDFFile,
  setPdfTabIndex
} from "./patenTrackActions";


export const setAuthenticateAuthToken = data => {
  return {
    type: types.SET_AUTHENTICATE_AUTH_TOKEN,
    data,
  }
}

export const setCompaniesList = data => {
  return {
    type: types.SET_COMPANIES_LIST,
    data,
  }
}

export const fetchCompaniesList = () => async dispatch => {
  const { data } = await PatenTrackApi.getCompaniesList()
  dispatch(setCompaniesList(data))
}

export const setSelectedCompaniesList = data => {
  return {
    type: types.SET_SELECTED_COMPANIES_LIST,
    data,
  }
}

export const setSelectedAssetsTypes = data => {
  return {
    type: types.SET_SELECTED_ASSETS_TYPES,
    data,
  }
}

export const setAssetsCompanies = (assetType, data) => {
  return {
    type: types.SET_ASSETS_COMPANIES,
    assetType,
    data,
  }
}

export const setAssetsCustomers = (assetType, data, { append = false }) => {
  return {
    type: types.SET_ASSETS_CUSTOMERS,
    assetType,
    data,
    append,
  }
}

export const setAssetsCustomersLoading = data => {
  return {
    type: types.SET_ASSETS_CUSTOMERS_LOADING,
    payload: data,
  }
}

export const setAssetsCustomersLoadingMore = data => {
  return {
    type: types.SET_ASSETS_CUSTOMERS_LOADING_MORE,
    payload: data,
  }
}

export const getAssetsCustomers = (assetType, companyIds) => {
  return async dispatch => {
    dispatch(setAssetsCustomersLoading(true))
    const { data } = await PatenTrackApi.fetchAssetsCustomers(assetType, companyIds)
    dispatch(setAssetsCustomersLoading(false))
    dispatch(setAssetsCustomers(assetType, data, { append: false }))
  }
}

export const  getMoreAssetsCustomers = (assetType, companyIds, offset) => {
  return async dispatch => {
    dispatch(setAssetsCustomersLoadingMore(true))
    const { data } = await PatenTrackApi.fetchMoreAssetsCustomers(assetType, companyIds, { offset, limit: DEFAULT_CUSTOMERS_LIMIT })
    dispatch(setAssetsCustomersLoadingMore(false))
    dispatch(setAssetsCustomers(assetType, data, { append: true }))
  }
}

export const setSelectedAssetsCustomers = data => {
  return {
    type: types.SET_SELECTED_ASSETS_CUSTOMERS,
    data,
  }
}


export const setAssetsTransactions = (assetType, companyId, customerId, data) => {
  return {
    type: types.SET_ASSETS_TRANSACTIONS,
    assetType,
    companyId,
    customerId,
    data,
  }
}

export const setAssetsTransactionsLoading = data => {
  return {
    type: types.SET_ASSETS_TRANSACTIONS_LOADING,
    payload: data,
  }
}

export const getAssetsTransactions = (assetType, companyId, customerId, offset) => {
  return async dispatch => {
    dispatch(setAssetsTransactionsLoading(true))
    const { data } = await PatenTrackApi.getAssetsTransactions(assetType, companyId, customerId, { offset, limit: DEFAULT_TRANSACTIONS_LIMIT })
    dispatch(setAssetsTransactionsLoading(false))
    dispatch(setAssetsTransactions(assetType, companyId, customerId, data))
  }
}

export const setSelectedAssetsTransactions = data => {
  return {
    type: types.SET_SELECTED_ASSETS_TRANSACTIONS,
    data,
  }
}

export const setChildSelectedAssetsTransactions = data => {
  return {
    type: types.SET_CHILD_SELECTED_ASSETS_TRANSACTIONS,
    data,
  }
}


export const setAssetsTransactionsLifeSpan = (assetType, companyId, customerId, transactionId, data) => {
  return {
    type: types.SET_ASSETS_TRANSACTIONS_LIFE_SPAN,
    assetType,
    companyId,
    customerId,
    transactionId,
    data,
  }
}


export const getAssetsAllTransactionsEvents = (type, companies, tabs, customers, rfIDs) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getAllAssetsTransactionsEvents(type, companies, tabs, customers, rfIDs)
    dispatch(toggleLifeSpanMode(true))
    dispatch(setAssetsTransactionsLifeSpan(type, companies, tabs, customers, data))
  }
}


export const getAssetsTransactionsEvents = (assetType, companyId, customerId, transactionId) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getAssetsTransactionsEvents(assetType, companyId, customerId, transactionId)
    dispatch(toggleLifeSpanMode(true))
    dispatch(setAssetsTransactionsLifeSpan(assetType, companyId, customerId, transactionId, data))
  }
}   

export const getAssetsByTransactionsEvents = (transactionId) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getAssetsByTransactionsEvents(transactionId)
    dispatch(toggleLifeSpanMode(true))
    dispatch(setAssetsTransactionsLifeSpan(null, 0, 0, transactionId, data))
  }
}


export const setAssetsPatents = (assetType, companyId, customerId, transactionId, data) => {
  return {
    type: types.SET_ASSETS_PATENTS,
    assetType,
    companyId,
    customerId,
    transactionId,
    data,
  }
}

export const setAssetsPatentsLoading = data => {
  return {
    type: types.SET_ASSETS_PATENTS_LOADING,
    payload: data,
  }
}

export const getAssetsPatents = (assetType, companyId, customerId, transactionId, offset) => {
  return async dispatch => {
    dispatch(setAssetsPatentsLoading(true))
    const { data } = await PatenTrackApi.getAssetsPatents(assetType, companyId, customerId, transactionId, { offset, limit: DEFAULT_PATENTS_LIMIT })
    dispatch(setAssetsPatentsLoading(false))
    dispatch(setAssetsPatents(assetType, companyId, customerId, transactionId, data))
  }
}

export const getAssetsUSPTO = (type, patentNumber, flag) => {
  return dispatch => {
    dispatch(setAssetsUSPTOLoading(true))
    PatenTrackApi.geteAssetUSPTOByPatentNumber(type, patentNumber, flag)
      .then(({ data }) => {
        dispatch(setAssetsUSPTO(data));
      })
    dispatch(setAssetsUSPTOLoading(false))
  }
}

export const getAssetsByPatentNumber = (patentNumber) => {
  return dispatch => {
    dispatch(setAssetsIllustrationLoading(true))
    PatenTrackApi.getAssetsByPatentNumber(patentNumber)
      .then(({ data }) => {
        dispatch(setAssetsIllustration(data));
      })
    dispatch(setAssetsIllustrationLoading(false))
  }
}

export const getCollectionIllustration = (rfID) => {
  return dispatch => {
    dispatch(setAssetsIllustrationLoading(true))
    PatenTrackApi.getCollectionIllustration(rfID)
      .then(({ data }) => {
        dispatch(setAssetsIllustration(data));
      })
    dispatch(setAssetsIllustrationLoading(false))
  }
}

export const getCharts = (chartId) => {
  return dispatch => {
    dispatch(setChartsLoading(true))
    PatenTrackApi.getCharts(chartId)
      .then(({ data }) => {
        dispatch(setCharts(data));
      })
    dispatch(setChartsLoading(false))
  }
}

export const getAssetsActivitiesData = () => {
  return dispatch => {
    dispatch(setIsLoadingAssetsRecordsDataCount(true))
    PatenTrackApi.getAssetsActivitiesData('record', { count: true })
      .then(({ data }) => {
        dispatch(setAssetsRecordsDataCount(data[0].count_items));
      })
    dispatch(setIsLoadingAssetsRecordsDataCount(false))
  }
}

export const setIsLoadingAssetsRecordsDataCount = data => {
  return {
    type: types.LOADING_ASSETS_RECORDS_COUNT,
    data,
  }
}

export const getAssetsCompletedActivitiesData = () => {
  return dispatch => {
    dispatch(setIsLoadingCompletedAssetsRecords(true))
    PatenTrackApi.getAssetsActivitiesData('complete', { count: true })
      .then(({ data }) => {
        dispatch(setAssetsCompletedActivitiesData(data[0].count_items));
      })
    dispatch(setIsLoadingCompletedAssetsRecords(false))
  }
}

export const getAssetsErrorsDataCount = (paramsUrl) => {
  return dispatch => {
    dispatch(setIsLoadingAssetsErrorsDataCount(true))
    PatenTrackApi.getAssetsErrorsData(paramsUrl)
      .then(({ data }) => {
        dispatch(setAssetsErrorsDataCount(data));
      })
    dispatch(setIsLoadingAssetsErrorsDataCount(false))
  }
}

export const setAssetsErrorsDataCount = data => {
  return {
    type: types.SET_ERRORS_ASSETS_RECORDS_COUNT,
    data,
  }
}

export const setIsLoadingCompletedAssetsRecords = data => {
  return {
    type: types.LOADING_COMPLETED_ASSETS_RECORDS,
    data,
  }
}

export const setIsLoadingAssetsErrorsDataCount = data => {
  return {
    type: types.LOADING_ERRORS_ASSETS_RECORDS,
    data,
  }
}

export const setAssetsRecordsDataCount = data => {
  return {
    type: types.SET_ASSETS_RECORDS_COUNT,
    data,
  }
}

export const setAssetsCompletedActivitiesData = data => {
  return {
    type: types.SET_COMPLETED_ASSETS_RECORDS,
    data,
  }
}

export const setSelectedAssetsPatents = data => {
  return {
    type: types.SET_SELECTED_ASSETS_PATENTS,
    data,
  }
}

export const setChildSelectedAssetsPatents = data => {
  return {
    type: types.SET_CHILD_SELECTED_ASSETS_PATENTS,
    data,
  }
}


// SET_ASSETS_COMPANIES
// SET_ASSETS_CUSTOMERS

export const setAssetsIllustrationLoading = data => {
  return {
    type: types.SET_ASSETS_ILLUSTRATION_LOADING,
    data,
  }
}

export const setAssetTypeSelectedRow = data => {
  return {
    type: types.SET_ASSET_TYPE_ROW_SELECT,
    data,
  }
}


export const setAssetsIllustration = data => {
  return {
    type: types.SET_ASSET_ILLUSTRATION,
    data,
  }
}


export const setAssetsIllustrationData = data => {
  return {
    type: types.SET_ASSET_ILLUSTRATION_DATA,
    data,
  }
}


export const setChartsLoading = data => {
  return {
    type: types.SET_CHARTS_LOADING,
    data,
  }
}

export const setCharts = data => {
  return {
    type: types.SET_CHARTS,
    data,
  }
}

export const setAssetsUSPTOLoading = data => {
  return {
    type: types.SET_ASSETS_USPTO_LOADING,
    data,
  }
}


export const setAssetsUSPTO = data => {
  return {
    type: types.SET_ASSETS_USPTO,
    data,
  }
}

export const setCommentsEntity = data => {
  return {
    type: types.SET_COMMENTS_ENTITY,
    data,
  }
}

export const setReviewTransactionView = (data) => {
  return {
    type: types.REVIEW_TRANSACTION_VIEW,
    data
  }
}

export const setGridWidthClassNUmber = (number) => {
  return {
    type: types.SET_GRID_WIDTH_CLASS_NUMBER,
    number
  }
}

export const setActiveMenuButton = (index) => { 
  return {
    type: types.SET_ACTIVE_MENU_BUTTON,
    index
  }
}


/**
 * New Design
 */

export const retrievePDFFromServer = (item) => {    
  PatenTrackApi.cancelDownloadRequest()
  return async dispatch => {
    const {data} = await PatenTrackApi.downloadPDFUrl(item.rf_id)
    if(data != null && typeof data.link !== 'undefined') {
        dispatch(
          setPDFFile(    
            { 
              document: data.link, 
              form: data.link, 
              agreement: data.link  
            }
          )
        )
        dispatch(
          setPdfTabIndex(0)
        )
    }
  }
}

export const fetchParentCompanies = ( offset = 0, sortFiled = 'original_ompany', sortorder = 'ASC' ) => {
  return async dispatch => {
    dispatch(setMainCompaniesLoadingMore(true))
    const { data } = await PatenTrackApi.getParentCompanies(offset, sortFiled, sortorder)
    //dispatch(getChannels())
    dispatch(setMainCompaniesLoadingMore(false))
    dispatch(setMainCompanies(data, { append: true }))
  }
}

export const updateForeightAssetsSheetSelections = (selected, names) => {
  return {
    type: types.SET_FOREIGN_ASSETS_SHEETS_SELECTIONS,
    selected,  
    names
  }
}

export const setMainCompaniesLoadingMore = data => {
  return {
    type: types.SET_MAIN_CUSTOMERS_LOADING_MORE,
    payload: data,
  }
}

export const setMainCompanies = (data, { append = false }) => {
  return {
    type: types.SET_MAIN_COMPANIES,
    data,
    append,
  }
}

export const setMainCompaniesSelected = (selected, groups) => {
  return {
    type: types.SET_MAIN_COMPANIES_SELECTED,
    selected,
    groups
  }
}

export const setMainCompaniesAllSelected = ( flag ) => {
  return { 
    type: types.SET_MAIN_COMPANIES_ALL_SELECTED,
    flag 
  }
}

export const setMainCompaniesRowSelect = (data) => {
  return {
    type: types.SET_MAIN_COMPANIES_ROW_SELECT,
    data 
  }
}

export const setMainChildCompanies = (companyID, data, flag) => {
  return {
    type: types.SET_MAIN_CHILD_COMPANIES,
    companyID,
    data,
    flag
  }
}



export const getMaintainenceAssetsEventsList = ( selectedCompanies) => {
  return async dispatch => {
    dispatch(setMaintainenceAssetsEventsLoadingMore(true))
    const { data } = await PatenTrackApi.getMaintainenceAssetsEventsList(selectedCompanies)
    dispatch(setMaintainenceAssetsEventsLoadingMore(false))
    dispatch(setMaintainenceAssetsEventsList(data))
  } 
}

export const setMaintainenceAssetsEventsLoadingMore = data => {
  return {
    type: types.SET_MAINTAINENCE_ASSETS_EVENTS_LIST_LOADING_MORE,
    payload: data,
  }
}

export const setMaintainenceAssetsEventsList = (data) => {
  return {
    type: types.SET_MAINTAINENCE_ASSETS_EVENTS_LIST,
    data
  }
}

export const getMaintainenceAssetsList = ( selectedCompanies, offset = 0, append = false) => {
  return async dispatch => {
    dispatch(setMaintainenceAssetsLoadingMore(true))
    const { data } = await PatenTrackApi.getMaintainenceAssetsList(selectedCompanies, offset)
    dispatch(setMaintainenceAssetsLoadingMore(false))
    dispatch(setMaintainenceAssetsList(data, { append }))
  } 
}

export const setMaintainenceAssetsLoadingMore = data => {
  return {
    type: types.SET_MAINTAINENCE_ASSETS_LIST_LOADING_MORE,
    payload: data,
  }
}

export const setMaintainenceAssetsList = (data, { append = false }) => {
  return {
    type: types.SET_MAINTAINENCE_ASSETS_LIST,
    data,
    append,
  }
}

export const setSelectedMaintainenceAssetsList = ( list ) => {
  return {
    type: types.SET_MAINTAINENCE_ASSETS_SELECTED_LIST,
    list
  } 
}

export const getGoogleAuthToken = ( code ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getGoogleAuthToken( code )
    dispatch(getGoogleProfile(data))  
    dispatch(setGoogleAuthToken(data))
  }
}

export const setGoogleAuthToken = ( token ) => {
  return {
    type: types.SET_GOOGLE_AUTH_TOKEN,
    token
  }
}

export const getGoogleProfile = ( token ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getGoogleProfile( token )
    if(data == 'Error while retreiving profile data') {
      localStorage.setItem('google_auth_token_info', '')
    } else {
      dispatch(setGoogleProfile(data))
    }    
  }
}  

export const setGoogleProfile = ( data ) => {
  return {
    type: types.SET_GOOGLE_PROFILE, 
    data
  }
}

export const getLayoutWithTemplates = (token, account) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getLayoutWithTemplates( token, account )
    if(data.message != '') {
      localStorage.setItem('google_auth_token_info', '')
      alert(data.message)
    } else {
      dispatch(setLayoutWithTemplatelist(data))
    } 
  } 
}

export const setTemplateDocument = (url) => {
  return {
    type: types.SET_TEMPLATE_DOCUMENT_URL,
    url
  }
}

export const setLayoutWithTemplatelist = (data) => {
  return {
    type: types.SET_GOOGLE_LAYOUT_TEMPLATE_LIST,
    data
  }
}


export const getLayoutTemplatesByID = (layoutID, userAccount) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getLayoutTemplatesByID( layoutID, userAccount )
    if(data.message != '') {
      //localStorage.setItem('google_auth_token_info', '')
      alert(data.message)
    } else {
      //dispatch(setDriveTemplateFrameMode(true))
      dispatch(setDriveTemplateMode(true))
      dispatch(setLayoutTemplatesByID(data))
    }
  }
}

export const setLayoutTemplatesByID = (data) => {
  return {
    type: types.SET_LAYOUT_TEMPLATE_LIST_BY_ID,
    data
  } 
}


export const getGoogleTemplates = (token, id) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getGoogleTemplates( token, id )
    if(data.message != '') {
      localStorage.setItem('google_auth_token_info', '')
      alert(data.message)
    } else {
      dispatch(setGoogleTemplateList(data))
    }
  }
} 

export const setGoogleTemplateList = (data) => {
  return {
    type: types.SET_GOOGLE_TEMPLATE_LIST,
    data
  } 
}


export const getSlackAuthToken = ( code ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getSlackAuthToken( code )
    dispatch(setSlackAuthToken(data))
  }
}

export const setSlackAuthToken = ( token ) => {
  return {
    type: types.SET_SLACK_AUTH_TOKEN,
    token
  }
}

export const getSlackProfile = ( token, id ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getSlackProfile( token, id )
    dispatch(setSlackProfileData(data))
  }
}
   
export const setSlackProfileData = ( data ) => {
  return {
    type: types.SET_SLACK_PROFILE_DATA,
    data
  }
}

export const sendMessage = ( frmData ) => {
  const getSlackToken = localStorage.getItem('slack_auth_token_info')
  const tokenJSON = JSON.parse( getSlackToken )
  return async dispatch => {
    const { data } = await PatenTrackApi.sendMessage( tokenJSON.access_token, frmData )
    dispatch(getSlackMessages(data.channel_id))
  }
}

export const getSlackMessages = ( channelID ) => {
  const getSlackToken = localStorage.getItem('slack_auth_token_info')
  const tokenJSON = JSON.parse( getSlackToken )
  return async dispatch => {
    try{
      const { data } = await PatenTrackApi.getMessages( tokenJSON.access_token, channelID)
      dispatch(setSlackMessages(data))
    } catch (err) {
      console.error(err)
    }    
  }
}

export const getChannels = (token) => {
  return async dispatch => {
    dispatch(setChannelLoading(true))
    const { data } = await PatenTrackApi.getChannels(token)
    dispatch(setChannelLoading(true))
    dispatch(setChannelsList(data))
  }
}

export const setChannelLoading = (flag) => {
  return {
    type: types.SET_SLACK_CHANNEL_LIST_LOADING,
    flag
  }
}

export const setChannelsList = (data) => {
  return {
    type: types.SET_SLACK_CHANNEL_LIST,
    data
  }
}

export const getSlackUsersList = () => {
  const getSlackToken = localStorage.getItem('slack_auth_token_info')
  const tokenJSON = JSON.parse( getSlackToken )
  return async dispatch => {
    const { data } = await PatenTrackApi.getSlackUsersList( tokenJSON.access_token)
    dispatch(setSlackUsers(data))
  }
}

export const setSlackUsers = (data) => {
  return {
    type: types.SET_SLACK_USERS,
    data
  }
}

export const setSlackMessages = (data) => {
  return {
    type: types.SET_SLACK_MESSAGES,
    data
  }
}

export const getChannelID = ( patent, application ) => {
  if( patent != '' ) {
    return async dispatch => {
      const { data } = await PatenTrackApi.getChannelID( patent )
      if( data == null || Object.keys(data).length == 0 ) {
        const { data } = await PatenTrackApi.getChannelID( application )
        dispatch(setChannelID(data))
      } else {
        dispatch(setChannelID(data))
      }
    }
  } else {
    return async dispatch => {
      const { data } = await PatenTrackApi.getChannelID( application )
      dispatch(setChannelID(data))
    }
  }
}

export const getChannelIDTransaction = ( transactionID ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getChannelID( transactionID )
    dispatch(setChannelID(data))
  }
}

export const setChannelID = (data) => {
  return {
    type: types.SET_CHANNEL_ID,
    data
  }
}


export const setMaintainenceFileName = (name) => {
  return {
    type: types.SET_MAINTAINENCE_FEE_FILE_NAME,
    name
  }
}

export const createDriveTemplateFile = ( formData ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.createDriveTemplateFile( formData )
    
    if( data != null && typeof data == 'object') {
      //new template created
      dispatch(setDriveTemplateFrameMode(true)) //open drive frame
      dispatch(setDriveTemplateFile(data))
    } else {
      alert(data)
      if(data == 'Token expired') {
        localStorage.setItem('google_auth_token_info', '')
      }
    }
  }
} 

export const setDriveTemplateFile = (data) => {
  return {
    type: types.SET_DRIVE_TEMPLATE_FILE,
    data
  }
}

export const createMaintainenceFeeFile = ( fileName, fileData ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.createMaintainenceFeeFile( fileName, fileData )
    
  }
} 

export const getAssetTypes = ( companies ) => {
  return async dispatch => {
    dispatch( setAssetTypesLoading( true ) )
    const { data } = await PatenTrackApi.getAssetTypes( companies )
    dispatch( setAssetTypesLoading( false ) )
    dispatch( setAssetTypes(data) )
  }
}


export const setAssetTypesLoading = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_LOADING,
    flag
  }
}

export const setAssetTypes = (data) => {
  return {
    type: types.SET_ASSET_TYPES,
    data
  }
}

export const setAllAssetTypes = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_SELECTED_ALL,
    flag
  }
}

export const setAssetTypesSelect = (data) => {
  return {
    type: types.SET_ASSET_TYPES_SELECTED,
    data
  } 
}

export const getAssetTypeIDCompanies = ( companies, tabID, layout, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesIDCompaniesLoading( tabID, true ) )
    const { data } = await PatenTrackApi.getAssetTypeIDCompanies( companies, tabID, layout )
    dispatch( setAssetTypesIDCompaniesLoading( tabID, false ) )
    dispatch( setAssetTypeIDCompanies(data, append) )
  }
}


export const setAssetTypesIDCompaniesLoading = (tabID, flag) => {
  return {
    type: types.SET_ASSET_TYPE_ID_COMPANIES_LOADING,
    flag
  }
}

export const setAssetTypeIDCompanies = (data, append) => {
  return {
    type: types.SET_ASSET_TYPE_ID_COMPANIES,
    data,
    append
  }
}

export const getAssetTypeCompanies = ( companies, tabs, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesCompaniesLoading( true ) )
    const { data } = await PatenTrackApi.getAssetTypeCompanies( companies, tabs )
    dispatch( setAssetTypesCompaniesLoading( false ) )
    dispatch( setAssetTypeCompanies(data, append) )
  }
}


export const setAssetTypesCompaniesLoading = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_COMPANIES_LOADING,
    flag
  }
}

export const setAssetTypeCompanies = (data, append) => {
  return {
    type: types.SET_ASSET_TYPE_COMPANIES,
    data,
    append
  }
}

export const setAssetTypesInventorsLoading = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_INVENTORS_LOADING,
    flag
  }
}

export const setAssetTypeInventor = (data, append) => {
  return {
    type: types.SET_ASSET_TYPE_INVENTORS,
    data,
    append
  }
}

export const setAllAssignmentCustomers = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_COMPANIES_SELECT_ALL,
    flag
  }
}

export const setSelectAssignmentCustomers = (data) => {
  return {
    type: types.SET_ASSET_TYPES_COMPANIES_SELECT,
    data 
  }
}

export const setSelectAssignmentCustomerName = (name) => {
  console.log('setSelectAssignmentCustomerName', name)
  return {
    type: types.SET_ASSET_TYPES_COMPANIES_SELECT_NAME,
    name
  }
}

export const setAssetTypeCustomerSelectedRow = (data) => {
  return {
    type: types.SET_ASSET_TYPES_COMPANIES_ROW_SELECT,
    data 
  }
} 

export const setAssetTypeChildCustomerSelectedRow = (data) => {
  return {
    type: types.SET_ASSET_TYPES_CHILD_COMPANIES_ROW_SELECT,
    data 
  }
}

export const setAssetTypeChildCustomerSelected = (data) => { 
  return {
    type: types.SET_ASSET_TYPES_CHILD_COMPANIES_SELECT,
    data 
  }
}

export const getAssetTypeAssignments = ( companies, tabs, customers, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentsLoading( true ) )
    const { data } = await PatenTrackApi.getAssetTypeAssignments( companies, tabs, customers )    
    dispatch( setAssetTypeAssignments(data, append) )
    dispatch( setAssetTypesAssignmentsLoading( false ) )
  }
}


export const setAssetTypesAssignmentsLoading = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_ASSIGNMENTS_LOADING,
    flag
  }
}

export const setAssetTypeAssignments = (data, append) => {
  return {
    type: types.SET_ASSET_TYPE_ASSIGNMENTS,
    data,
    append
  }
}

export const setAllAssignments = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_ASSIGNMENTS_SELECT_ALL,
    flag
  }
}

export const setSelectAssignments = (data) => {
  return {
    type: types.SET_ASSET_TYPE_ASSIGNMENTS_SELECT,
    data
  }
}

export const setAssetTypesPatentsSelected = (data) => {
  return {
    type: types.SET_ASSET_TYPE_ASSIGNMENTS_ASSETS_SELECTED,
    data
  }
}

export const setAssetTypesPatentsSelectAll = (flag) => {
  return {
    type: types.SET_ASSET_TYPE_ASSIGNMENTS_ASSETS_SELECT_ALL,
    flag
  } 
}

export const getAssetTypeAssignmentAssets = ( assignmentRFID, append = false, type = 0, searchString = '' ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentAssetsLoading( true ) )
    const { data } = await PatenTrackApi.getAssetTypeAssignmentAssets( assignmentRFID )    
    if(type === 1 && searchString != '' && data.length > 0) {
      const searchedRow = data.filter( row => row.asset == searchString )
      if(searchedRow.length > 1){
        const filterRow = data.filter( row => row.asset != searchString )
        data.splice(0,data.length) //clean array
        data.concat(filterRow) // fill array
        data.unshift(searchedRow) // add search item to top index
      }
    }
    dispatch( type === 1 ? setAssetTypeAssignmentAllAssets(data, append) : setAssetTypeAssignmentsAssets(assignmentRFID, data, append) )
    dispatch( setAssetTypesAssignmentAssetsLoading( false ) )
  }
}


export const setAssetTypesAssignmentAssetsLoading = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_ASSIGNMENTS_ID_ASSETS_LOADING,
    flag
  }
}

export const setAssetTypeAssignmentsAssets = (rf_id, data, append) => {
  return {
    type: types.SET_ASSET_TYPE_ASSIGNMENTS_ID_ASSETS,
    rf_id,
    data,
    append
  }
}

export const getForeignAssetsBySheet = ( form ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( true ) )
    PatenTrackApi.cancelForeignAssetsBySheet()
    const { data } = await PatenTrackApi.getForeignAssetsBySheet(form)
    //dispatch(getChannels())
    dispatch( setAssetTypeAssignmentAllAssets(data, true) )
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) )
  }
}


/**
 * Assets
 * @param {*} type 
 * @param {*} companies 
 * @param {*} tabs 
 * @param {*} customers 
 * @param {*} rfIDs 
 * @param {*} append 
 */

export const getCustomerAssets = ( type, companies, tabs, customers, rfIDs, append = false, startIndex, endIndex, column, direction, assetTableScrollPosition, salesAssets = false, callBackFn ) => {
  return async dispatch => {
    if(append === false) {
      dispatch( setAssetTypesAssignmentsAllAssetsLoading( true ) )
    }
    PatenTrackApi.cancelAssets()
    /*const { data } = await PatenTrackApi.getCustomerAssets( type, companies, type == 'due_dilligence' ? tabs : [], type == 'due_dilligence' ? customers : [], rfIDs, startIndex, endIndex, column, direction, salesAssets )    */
    const { data } = await PatenTrackApi.getCustomerAssets( type, companies, tabs, customers, rfIDs, startIndex, endIndex, column, direction, salesAssets )
    dispatch( setAssetTypeAssignmentAllAssets(data, append) )
    if(data != null && typeof data.other_data != 'undefined') {
      dispatch(setPtabData(data.other_data))
    }
    if(typeof callBackFn !== 'undefined') {
      callBackFn(false)
    }
    if(append === false) { 
      dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) )
      if(data.list.length == 0) {
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setAssetTypesPatentsSelected([]))
        dispatch(setAssetTypesPatentsSelectAll(false))
      }
    } else if(append === true && typeof assetTableScrollPosition !== 'undefined' && assetTableScrollPosition !== -1) {
      dispatch( setAssetTableScrollPos( assetTableScrollPosition ) )
    }
  } 
}

/**
 * Assets
 * @param {*} type 
 * @param {*} companies 
 * @param {*} tabs 
 * @param {*} customers 
 * @param {*} rfIDs 
 * @param {*} append 
 */

export const getCustomerSelectedAssets = ( shareCode, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( true ) )
    PatenTrackApi.cancelAssets()
    const { data } = await PatenTrackApi.getCustomerSelectedAssets( shareCode )    
    dispatch( setAssetTypeAssignmentAllAssets(data, append) )
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) )
  } 
}

/**
 * Transactions
 * @param {*} type 
 * @param {*} companies 
 * @param {*} tabs 
 * @param {*} customers 
 * @param {*} append 
 */

export const getCustomerTransactions = ( type, companies, tabs, customers, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentsLoading( true ) )
    const { data } = await PatenTrackApi.getCustomerTransactions( type, companies, type == 'due_dilligence' ? tabs : [], type == 'due_dilligence' ? customers : [])    
    dispatch( setAssetTypeAssignments(data, append) )
    dispatch( setAssetTypesAssignmentsLoading( false ) )
  } 
}
/**
 * Parties
 * @param {*} type 
 * @param {*} companies 
 * @param {*} tabs 
 */

export const getCustomerParties = ( type, companies, tabs, customerType, append = false ) => {
  return async dispatch => {
    if(customerType === 1) {
      dispatch( setAssetTypesInventorsLoading( true ) )
    } else {
      dispatch( setAssetTypesCompaniesLoading( true ) )
    }
    const { data } = await PatenTrackApi.getCustomerParties( type, companies, tabs, customerType )    
    if(customerType === 1) {
      dispatch( setAssetTypesInventorsLoading( false ) )
      dispatch( setAssetTypeInventor(data, append) )
    } else {
      dispatch( setAssetTypesCompaniesLoading( false ) )
      dispatch( setAssetTypeCompanies(data, append) )
    }
    
  } 
} 


/**
 * Address Transactions 
 * @param {*} companies ID as array
 * @param {*} tabs ID as array
 * @param {*} customers ID as array
 * @param {*} append  as Boolean
 */

export const getCustomerAdressTransactions = ( companies, tabs, customers , append = false ) => {
  return async dispatch => {
    dispatch( setAssetAddressTransactionsLoading( true ) )
    const { data } = await PatenTrackApi.getCustomerAddressTransactions( companies, tabs, customers )    
    dispatch( setAssetAddressTransactionsLoading( false ) )
    dispatch( setAssetAddressTransactions(data, append) )
  } 
}

/**
 * Address Transactions 
 * @param {*} companies ID as array
 * @param {*} tabs ID as array
 * @param {*} customers ID as array
 * @param {*} append  as Boolean
 */

export const getCustomerNormalizeNameTransactions = ( companies, tabs, customers , append = false ) => {
  return async dispatch => {
    dispatch( setNamesTransactionsLoading( true ) )
    const { data } = await PatenTrackApi.getCustomerNormalizeNameTransactions( companies, tabs, customers )    
    dispatch( setNamesTransactionsLoading( false ) )
    dispatch( setNamesTransactions(data, append) )
  } 
}

export const getAddressQueue = ( form ) => {
  return async dispatch => {
    dispatch( setAddressQueueLoading( true ) )
    const { data } = await PatenTrackApi.getAddressQueue( form )    
    dispatch( setAddressQueueLoading( false ) )
    dispatch( setAddressQueueData(data) )
  } 
}

/**
 * 
 * @param {*} form 
 */

export const getNameQueue = ( form ) => {
  return async dispatch => {
    dispatch( setNameQueueLoading( true ) )
    const { data } = await PatenTrackApi.getNameQueue( form )    
    dispatch( setNameQueueLoading( false ) )
    dispatch( setNameQueueData(data) )
  } 
}



/**
 * Activites
 * @param {*} type 
 * @param {*} companies 
 */

export const getCustomerActivites = ( type, companies, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesLoading( true ) )
    const { data } = await PatenTrackApi.getCustomerActivites( type, companies )    
    dispatch( setAssetTypesLoading( false ) )
    dispatch( setAssetTypes(data) )
  } 
}

export const getRestoreOwnershipAssets = ( companies, tabs, customers, rfIDs, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( true ) )
    const { data } = await PatenTrackApi.getRestoreOwnershipAssets( companies, tabs, customers, rfIDs )    
    dispatch( setAssetTypeAssignmentAllAssets(data, append) )
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) )
  }
}

export const getAssetTypeAssignmentAllAssets = ( companies, tabs, customers, rfIDs, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( true ) )
    const { data } = await PatenTrackApi.getAssetTypeAssignmentAllAssets( companies, tabs, customers, rfIDs )    
    dispatch( setAssetTypeAssignmentAllAssets(data, append) )
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( false ) )
  }
}

export const setAddressQueueDisplay = (flag) => {
  return {
    type: types.SET_ADDRESS_QUEUE_DISPLAY,
    flag
  }
}

export const setAddressQueueLoading = (flag) => {
  return {
    type: types.SET_ADDRESS_QUEUE_LOADING,
    flag
  }
}

export const setAddressQueueData = (data) => {
  return {
    type: types.SET_ADDRESS_QUEUES_TRANSACTIONS,
    data
  }
} 

export const setFixedTransactionAddress = (data) => {
  return {
    type: types.SET_FIXED_TRANSACTION_ADDRESS,
    data
  }
}

export const setNameQueueDisplay = (flag) => {
  return {
    type: types.SET_NAME_QUEUE_DISPLAY,
    flag
  }
}

export const setNameQueueLoading = (flag) => {
  return {
    type: types.SET_NAME_QUEUE_LOADING,
    flag
  }
}

export const setNameQueueData = (data) => {
  return {
    type: types.SET_NAME_QUEUES_TRANSACTIONS,
    data
  }
} 

export const setFixedTransactionName = (data) => {
  return {
    type: types.SET_FIXED_TRANSACTION_NAME,
    data
  }
}

export const setNamesTransactionsLoading = (flag) => {
  return {
    type: types.SET_NAMES_TRANSACTIONS_LOADING,
    flag
  }
}

export const setNamesTransactions = (data, append) => {
  return {
    type: types.SET_NAMES_TRANSACTIONS,
    data,
    append
  }
}

export const setSelectedNamesTransactions = data => {
  return {
    type: types.SET_SELECTED_NAMES_TRANSACTIONS,
    data,
  }
}  

export const setNamesTransactionsSelectAll = (flag) => {
  return {
    type: types.SET_NAMES_TRANSACTIONS_SELECT_ALL,
    flag
  }
}

export const setNamesTransactionsSelectedRow = (data) => {
  return {
    type: types.SET_NAMES_TRANSACTIONS_ROW_SELECT,
    data 
  }
}


export const setAssetAddressTransactionsLoading = (flag) => {
  return {
    type: types.SET_ASSETS_ADDRESS_TRANSACTIONS_LOADING,
    flag
  }
}

export const setAssetAddressTransactions = (data, append) => {
  return {
    type: types.SET_ASSETS_ADDRESS_TRANSACTIONS,
    data,
    append
  }
}

export const setSelectedAssetAddressTransactions = data => {
  return {
    type: types.SET_SELECTED_ASSETS_ADDRESS_TRANSACTIONS,
    data,
  }
} 

export const setAssetAddressTransactionsSelectAll = (flag) => {
  return {
    type: types.SET_ASSETS_ADDRESS_TRANSACTIONS_SELECT_ALL,
    flag
  }
}

export const setAssetAddressTransactionsSelectedRow = (data) => {
  return {
    type: types.SET_ASSETS_ADDRESS_TRANSACTIONS_ROW_SELECT,
    data 
  }
}

export const setAllGroupRfIDs = (data) => {
  return {
    type: types.SET_ASSETS_ADDRESS_TRANSACTIONS_ALL_GROUP,
    data 
  }
}

export const setAllNameGroupRfIDs = (data) => {
  return {
    type: types.SET_NAMES_TRANSACTIONS_ALL_GROUP,
    data 
  }
}


export const setAssetTypesAssignmentsAllAssetsLoading = (flag) => {
  return {
    type: types.SET_ASSET_TYPES_ASSIGNMENTS_ASSETS_LOADING,
    flag
  }
}

export const setAssetTypeAssignmentAllAssets = (data, append) => {
  return {
    type: types.SET_ASSET_TYPE_ASSIGNMENTS_ASSETS,
    data,
    append
  }
}

export const setPtabData = (data)=> {
  return {
    type: types.SET_PTAB_DATA,
    data
  }
}


export const setBreadCrumbs = (name) => {
  return {
    type: types.SET_BREAD_CRUMBS,
    name
  }
}

export const setSearchString = (search) => {
  return {
    type: types.SET_SEARCH_STRING,
    search
  }
}  

export const setSearchRfIDs = (list) => {
  return {
    type: types.SET_SEARCH_RF_ID,
    list
  }
}

export const setFlagChartVisibility = (visibility) => {
  return {
    type: types.SET_FAMILY_CHART_VISIBILITY,
    visibility
  }
} 

export const setSelectedCategory = (category) => {
  return {
    type: types.SET_SELECTED_CATEGORY,
    category
  }
}

export const setBreadCrumbsAndCategory = (item) => {  
  return {
    type: types.SET_BREAD_CRUMBS_AND_SELECTED_CATEGORY,
    item
  }
}

export const setResetAll = (t = 0, item) => {  
  return async dispatch => {
    dispatch( resetStates() )
    dispatch( resetUiStates() ) 
    if( t === 1) {
      if(typeof item != undefined) {
        dispatch( setBreadCrumbsAndCategory(item) )
      }
      dispatch( fetchParentCompanies() )
    }
  }
}

export const transactionRowClick = (rf_id, slackChannelList, defaultLoad, search_string) => {
  
  return dispatch => {
    dispatch(setAssetTypesPatentsSelected([]))
    dispatch(toggleLifeSpanMode(true))
    dispatch(setConnectionBoxView(false))
    dispatch(setPDFView(false))
    dispatch(toggleUsptoMode(false))
    dispatch(toggleFamilyMode(false))
    dispatch(toggleFamilyItemMode(false))
    /* dispatch(setMainCompaniesRowSelect([])) */
    /* dispatch(setAssetTypeSelectedRow([])) */
    dispatch(setAssetTypeCustomerSelectedRow([]))
    dispatch(setChildSelectedAssetsTransactions([]))
    dispatch(setChildSelectedAssetsPatents([]))
    dispatch(setSelectedAssetsPatents([]))
    dispatch(setSelectedAssetsTransactions([rf_id]))
    dispatch(setSelectAssignments([rf_id]))
    if(typeof defaultLoad !== 'undefined' && defaultLoad === false){
      dispatch(setAssetTypeAssignmentAllAssets({list: [], total_records: 0}, false))  
      dispatch(getAssetTypeAssignmentAssets(rf_id, false, 1, search_string)) // fill assets table 
    }
    dispatch(setAssetsIllustrationData(null))
    dispatch(setAssetsIllustration({ type: "transaction", id: rf_id }));
    if(typeof slackChannelList !== 'undefined' && slackChannelList.length == 0) {
      const channelID = findChannelID(slackChannelList, rf_id)
      if( channelID != '') {   
        dispatch(setChannelID({channel_id: channelID}))
      }
    }
  }
}

const findChannelID = (slack_channel_list, rfID) => {
  let channelID = ''
  if(slack_channel_list.length > 0) {
    const findIndex = slack_channel_list.findIndex( channel => channel.name == rfID.toString())
    if( findIndex !== -1) {
      channelID = slack_channel_list[findIndex].id
    }
  }
  return channelID
}

export const linkWithSheetSelectedAsset = (link_type, asset) => {  
  return {
    type: types.SET_LINK_ASSET_SHEET,
    link_type,
    asset
  }
}

export const linkWithSheetOpenPanel = (flag) => {  
  return {
    type: types.SET_LINK_ASSET_PANEL,
    flag
  }
}

export const linkWithSheet = (type, form) => {  
  return async dispatch => {
    dispatch( setLinkAssetDataLoading( true ) )
    const { data } = await PatenTrackApi.linkWithSheet( type, form )    
    dispatch( setLinkAssetData(data) )
    dispatch( setLinkAssetDataLoading( false ) )
  }  
}

export const setLinkAssetDataLoading = (flag) => {
  return {
    type: types.SET_LINK_ASSET_DATA_LOADING,
    flag
  }
}

export const setLinkAssetData = (items) => {
  return {
    type: types.SET_LINK_ASSET_LIST,
    items
  }
}

export const setLinkAssetListSelected = (items) => {  
  return {
    type: types.SET_LINK_ASSET_LIST_SELECTED,
    items
  }
}

export const resetStates = () => {  
  return {
    type: types.SET_RESET_ALL
  }
} 

export const setMoveAssets = (items) => {  
  return {
    type: types.SET_MOVE_ASSETS,
    items
  }
} 

export const setDocumentTransaction = (data) => {  
  return {
    type: types.SET_DOCUMENT_TRANSACTION, 
    data
  }
}

export const setClipboardAssets = (data) => {  
  return {
    type: types.SET_CLIPBOARD_ASSETS, 
    data
  }
} 

export const setClipboardAssetsDisplay = (flag) => {  
  return {
    type: types.SET_CLIPBOARD_ASSETS_DISPLAY, 
    flag
  } 
} 

export const setIsSalesAssetsDisplay = (flag) => {  
  return {
    type: types.SET_SALES_ASSETS_DISPLAY, 
    flag
  } 
}

export const setSwitchAssetButton = (value) => {
  return {
    type: types.SET_SWITCH_ASSET_BUTTON,
    value
  }
}

export const setAssetTableScrollPos = (pos) => {
  return {
    type: types.SET_ASSET_TABLE_SCROLL_POSITION,
    pos
  }
} 

export const setCompanyTableScrollPos = (pos) => {
  return {
    type: types.SET_COMPANY_TABLE_SCROLL_POSITION,
    pos
  }
} 


export const getAssetDetails = (applicationNumber, patentNumber) => {
  const asset = `US${applicationNumber}`
  return async dispatch => {
    dispatch( setAssetDetails( {asset, family: 0, claims: 0, figures: 0, fees: 0, citations: 0, ptab: 0, litigation: 0, status: 0 } ) )
    try{
      const family = await PatenTrackApi.getFamilyCounter( applicationNumber )    
      if(family !== null && family.data !== null) {
        dispatch( setAssetDetails( { family: family.data } ) )
      }
    } catch (err) {
      console.log('counterError Family', err)
    }
    
    try{
      const claims = await PatenTrackApi.getClaimsCounter( asset )    
      if(claims !== null && claims.data !== null) {
        dispatch( setAssetDetails( { claims: claims.data } ) )
      }
    } catch (err) {
      console.log('counterError claims', err)
    }
    try{
      const figures = await PatenTrackApi.getFiguresCounter( asset )    
      if(figures !== null && figures.data !== null) {
        dispatch( setAssetDetails( { figures: figures.data } ) )
      }
    } catch (err) {
      console.log('counterError figures', err)
    }
    try{
      const fees = await PatenTrackApi.getFeesCounter( applicationNumber, patentNumber )    
      if(fees !== null && fees.data !== null) {
        dispatch( setAssetDetails( { fees: fees.data } ) )
      }
    } catch (err) {
      console.log('counterError fees', err)
    }
    try{
      const citation = await PatenTrackApi.getCitationCounter( patentNumber !== '' && patentNumber !== null ? patentNumber : applicationNumber )    
      if(citation !== null && citation.data !== null) {
        dispatch( setAssetDetails( { citations: citation.data } ) )
      }
    } catch (err) {
      console.log('counterError citation', err)
    }
    try{
      const ptab = await PatenTrackApi.getPtabCounter( asset )    
      if(ptab !== null && ptab.data !== null) {
        dispatch( setAssetDetails( { ptab: ptab.data } ) )
      }
    } catch (err) {
      console.log('counterError ptab', err)
    }
    try{
      const status = await PatenTrackApi.getStatusCounter( applicationNumber )    
      if(status !== null && status.data !== null) {
        dispatch( setAssetDetails( { status: status.data } ) )
      }
    } catch (err) {
      console.log('counterError ptab', err)
    }

    /* const litigation = await PatenTrackApi.getLitigationCounter( asset )    
    if(litigation !== null && litigation.data !== null) {
      dispatch( setAssetDetails( { litigation: litigation.data } ) )  
    } */
  }
} 

export const setAssetDetails = (assetData) => {
  return {
    type: types.SET_ASSET_DETAILS,
    assetData
  }
} 

export const resetAssetDetails = () => {
  return {
    type: types.SET_ASSET_DETAILS,
    assetData: {asset: null, family: 0, claims: 0, figures: 0, fees: 0, citations: 0, ptab: 0, litigation: 0, status: 0}
  }
} 

export const setDashboardPanelActiveButtonId = (ID) => {
  return {
    type: types.SET_DASHBOARD_PANNEL_ACTIVE_BUTTON_ID,  
    ID
  }
} 

export const setDashboardShareData = (data) => {
  return {
    type: types.SET_DASHBOARD_SHARE_DATA,  
    data
  }
}

export const setSelectLawFirm = (data) => {
  return {
    type: types.SET_LAWFIRM_SELECTED,  
    data
  }
} 

export const setSocialMediaConnectPopup = (flag) => {  
  return {
    type: types.SET_SOCIAL_MEDIA_CONNECT_MODAL, 
    flag
  } 
}  

export const setTimelineDataLoading = (flag) => {  
  return {
    type: types.SET_TIMELINE_DATA_LOADING, 
    flag
  } 
} 