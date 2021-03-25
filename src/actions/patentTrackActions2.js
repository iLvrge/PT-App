import * as types from './actionTypes2'
import PatenTrackApi, { DEFAULT_CUSTOMERS_LIMIT, DEFAULT_TRANSACTIONS_LIMIT, DEFAULT_PATENTS_LIMIT } from '../api/patenTrack2'

import { toggleLifeSpanMode } from './uiActions'

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

export const getAssetsUSPTO = (type, patentNumber) => {
  return dispatch => {
    dispatch(setAssetsUSPTOLoading(true))
    PatenTrackApi.geteAssetUSPTOByPatentNumber(type, patentNumber)
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

export const fetchParentCompanies = ( offset = 0 ) => {
  return async dispatch => {
    dispatch(setMainCompaniesLoadingMore(true))
    const { data } = await PatenTrackApi.getParentCompanies(offset)
    dispatch(setMainCompaniesLoadingMore(false))
    dispatch(setMainCompanies(data, { append: true }))
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

export const setMainCompaniesSelected = (selected, selectedWithName) => {
  return {
    type: types.SET_MAIN_COMPANIES_SELECTED,
    selected,
    selectedWithName
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

export const getMaintainenceAssetsList = ( selectedCompanies, offset = 0, append = false) => {
  return async dispatch => {
    dispatch(setMaintainenceAssetsLoadingMore(true))
    const { data } = await PatenTrackApi.getMaintainenceAssetsList(selectedCompanies, offset)
    dispatch(setMaintainenceAssetsLoadingMore(false))
    dispatch(setMaintainenceAssetsList(data, { append: append }))
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
    dispatch(setGoogleAuthToken(data))
  }
}

export const setGoogleAuthToken = ( token ) => {
  return {
    type: types.SET_GOOGLE_AUTH_TOKEN,
    token
  }
}

export const getGoogleTemplates = () => {
  const getGoogleToken = localStorage.getItem('google_auth_token_info')
  const tokenJSON = JSON.parse( getGoogleToken )
  return async dispatch => {
    const { data } = await PatenTrackApi.getGoogleTemplates( tokenJSON )
    dispatch(setGoogleTemplateList(data))
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

export const getChannels = () => {
  return async dispatch => {
    const { data } = await PatenTrackApi.getChannels()
    dispatch(setChannelsList(data))
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

export const createMaintainenceFeeFile = ( fileName, fileData ) => {
  return async dispatch => {
    const { data } = await PatenTrackApi.createMaintainenceFeeFile( fileName, fileData )
    console.log("data", data)
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

export const getAssetTypeIDCompanies = ( companies, tabID, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesIDCompaniesLoading( tabID, true ) )
    const { data } = await PatenTrackApi.getAssetTypeIDCompanies( companies, tabID )
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

/**
 * Assets
 * @param {*} type 
 * @param {*} companies 
 * @param {*} tabs 
 * @param {*} customers 
 * @param {*} rfIDs 
 * @param {*} append 
 */

export const getCustomerAssets = ( type, companies, tabs, customers, rfIDs, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesAssignmentsAllAssetsLoading( true ) )
    const { data } = await PatenTrackApi.getCustomerAssets( type, companies, tabs, customers, rfIDs )    
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
    const { data } = await PatenTrackApi.getCustomerTransactions( type, companies, tabs, customers )    
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

export const getCustomerParties = ( type, companies, tabs, append = false ) => {
  return async dispatch => {
    dispatch( setAssetTypesCompaniesLoading( true ) )
    const { data } = await PatenTrackApi.getCustomerParties( type, companies, tabs )    
    dispatch( setAssetTypesCompaniesLoading( false ) )
    dispatch( setAssetTypeCompanies(data, append) )
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

export const setResetAll = (t = 0) => {  
  return async dispatch => {
    dispatch( resetStates() )
    if( t === 1) {
      dispatch( fetchParentCompanies() )
    }
  }
}

export const resetStates = () => {  
  return {
    type: types.SET_RESET_ALL
  }
} 