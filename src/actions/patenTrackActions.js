import *as types from './actionTypes'
import PatenTrackApi from '../api/patenTrack'
import { toggleFamilyMode } from './uiActions'

export const setProfile = (data) => {
  return {
    type: types.SET_PROFILE,
    data
  }
}

export const getProfile = ( flag ) => {
  return dispatch => {
    return PatenTrackApi.getProfile()
      .then(res => {
        if(flag){
          dispatch(setProfile(res.data))
        }        
      })
      .catch(err => {
        throw(err)
      })
  } 
}

export const setValidateCounter = (data) => {
  return {
    type: types.SET_VALIDATE_COUNTER,
    data
  }
}

export const setValidateLoading = (data) => {
  return {
    type: types.SET_VALIDATE_COUNTER_LOADING,
    data
  }
}

export const getValidateCounter = (companyName, flag, load) => {
  return dispatch => {
    dispatch(setValidateLoading(typeof load != 'undefined' && load === false ? false : true))
    return PatenTrackApi
      .getValidateCounter(companyName)
      .then(res => {
        //console.log("getValidateCounterFlag", flag);
        if (flag) {
          dispatch(setValidateLoading(false))
          let data = res.data
          if(data == null) {
            data = { application: 0, patent: 0, encumbered: 0, current: 0, difference: 0 }
          }
          dispatch(setValidateCounter(data))
        }
      })
      .catch(err=> {
        throw(err)
      })
  }
}


export const setCustomers = (customerType, data) => {
  return {
    type: types.SET_CUSTOMERS,
    customerType,
    data
  }
}

export const setCustomersLoading = (data) => {
  return {
    type: types.SET_CUSTOMERS_LOADING,
    data
  }
}

export const getCustomers = (type, flag) => {
  return dispatch => {
    dispatch(setCustomersLoading(true))
    return PatenTrackApi
      .getCustomers(type)
      .then(res => {
        if (flag) {
          const data = res.data
          dispatch(setCustomers(type, data))
          dispatch(setCustomersLoading(false))
        }
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setAssetsCount = (data) => {
  return {
    type: types.SET_ASSETS_COUNT,
    data
  }
}

export const setAssetCountLoading = (data) => {
  return {
    type: types.SET_ASSETS_COUNT_LOADING,
    data
  }
}

export const getAssetsCount = (companyName, flag, load) => {
  return dispatch => {
    dispatch(setAssetCountLoading(typeof load != 'undefined' && load === false ? false : true))
    return PatenTrackApi
      .getAssetsCount(companyName)
      .then(res => {
        if (flag) {
          dispatch(setAssetCountLoading(false))
          let data = res.data
          if(data == null) {
            data = { weekly_transactions: 0, weekly_applications: 0, monthly_transactions: 0, montly_applications: 0, quaterly_transactions: 0, quaterly_applications: 0 }
          }
          dispatch(setAssetsCount(data))
        }
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setTransactions = (data) => {
  return {
    type: types.SET_TRANSACTIONS,
    data
  }
}

export const setTransactionsLoading = (data) => {
  return {
    type: types.SET_TRANSACTIONS_LOADING,
    data
  }
}

export const getTransactions = (companyName, flag, load) => {
  return dispatch => {
    dispatch(setTransactionsLoading(typeof load != 'undefined' && load === false ? false : true))
    return PatenTrackApi
      .getTransactions(companyName)
      .then(res => {
        if (flag) {
          dispatch(setTransactionsLoading(false))
          let data = res.data
          if(data == null) {
            data = { buy: 0, sale: 0, security: 0, release: 0, license_in: 0, license_out: 0 }
          }
          dispatch(setTransactions(data))
        }
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setCustomersNameParties = (name, tabId, parentNode, data) => {  
  return {
    type: types.SET_CUSTOMERS_NAME_PARTIES,
    name,
    tabId,
    parentNode,
    data
  }
}

export const setCustomersNamePartiesLoading = (data) => {
  return {
    type: types.SET_CUSTOMERS_NAME_PARTIES_LOADING,
    data
  }
}

export const getCustomersParties = (name, tabId, parentNode) => {
  //console.log("tabIdddddd", tabId, parentCompany);
  return dispatch => {
    dispatch(setCustomersNamePartiesLoading(true))
    return PatenTrackApi
      .getCustomersParties(name, tabId) 
      .then(res => {
        /*console.log("tabId", name, tabId, parentNode);*/
        dispatch(setCustomersNameParties(name, tabId, parentNode, res.data))
        dispatch(setCustomersNamePartiesLoading(false))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setCustomersNameCollections = (name, tabId, parentNode, currentNode,  data) => {  
  return {
    type: types.SET_CUSTOMERS_NAME_COLLECTIONS,
    name,
    tabId,
    parentNode,
    currentNode,
    data
  }
}

export const setCustomersNameCollectionsLoading = (data) => {
  return {
    type: types.SET_CUSTOMERS_NAME_COLLECTIONS_LOADING,
    data
  }
}

export const getCustomersNameCollections = (name, tabId, parentNode, currentNode, parentCompany) => {
  //console.log("tabIdddddd", tabId, parentCompany);
  return dispatch => {
    dispatch(setCustomersNameCollectionsLoading(true))
    return PatenTrackApi
      .getCustomersNameCollections(name, parentCompany, tabId) 
      .then(res => {
        //console.log("tabId", tabId);
        dispatch(setCustomersNameCollections(name, tabId, parentNode, currentNode, res.data))
        dispatch(setCustomersNameCollectionsLoading(false))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setCustomerRFIDAssets = (rfID, tabId, parentNode, parentNode1, currentNode, data) => {
  return {
    type: types.SET_CUSTOMER_RFID_ASSETS,
    rfID,
    tabId, 
    parentNode, 
    parentNode1, 
    currentNode,
    data
  }
}

export const setCustomersRFIDAssetsLoading = (data) => {
  return {
    type: types.SET_CUSTOMER_RFID_ASSETS_LOADING,
    data
  }
}

export const getCustomerRFIDAssets = (rfID, tabId, parentNode, parentNode1, currentNode) => {
  return dispatch => {
    dispatch(setCustomersRFIDAssetsLoading(true))
    return PatenTrackApi.getCustomerRFIDAssets(rfID)
      .then(res => {
        dispatch(setCustomerRFIDAssets(rfID, tabId, parentNode, parentNode1, currentNode, res.data))
        dispatch(setCustomersRFIDAssetsLoading(false))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setErrorItems = (itemType, data) => {
  return {
    type: types.SET_ERRORS_ITEMS,
    itemType,
    data
  }
}

export const setErrorItemsAppend = (itemType, data, currentTab) => {
  return {
    type: types.SET_ERRORS_ITEMS_APPEND,
    itemType,
    currentTab,
    data
  }
}

export const setErrorItemsLoading = (data) => {
  return {
    type: types.SET_ERRORS_ITEMS_LOADING,
    data
  }
}

export const getErrorItems = (type, companyName, flag, load) => {  
  return dispatch => {
    dispatch(setErrorItemsLoading(typeof load != 'undefined' ? load : true))
    return PatenTrackApi
      .getErrorItems(type, companyName)
      .then(res => {
        dispatch(setErrorItemsLoading(false))
        dispatch(setErrorItems(type, res.data))
      }) 
      .catch(err => {
        throw(err)
      })
  }
}

export const fetchMoreFixItItems = (currentTab, from, companyName) => { 
  return dispatch => {
    return PatenTrackApi
      .getErrorItems('list', companyName, `from=${from}&tab=${currentTab}`)
      .then(res => {
        dispatch(setErrorItemsAppend('list', res.data, currentTab))
      }) 
      .catch(err => {
        throw(err)
      })
  }
}

export const assetFamilySingle = (applicationNumber) => { 
  return dispatch => {
    dispatch(setFamilyItemDataEventRetrieved(false))
    return PatenTrackApi
      .assetFamilySingle(applicationNumber)
      .then(res => {
        dispatch(setFamilyItemDataEventRetrieved(true))
        dispatch(toggleFamilyMode(true))
        dispatch(setFamilyItemDisplay(res.data))
      }) 
      .catch(err => {
        throw(err)
      })
  }
}


export const assetFamily = (applicationNumber) => { 
  return dispatch => {
    dispatch(setFamilyItemDataEventRetrieved(false))
    return PatenTrackApi
      .assetFamily(applicationNumber)
      .then(res => {
        dispatch(toggleFamilyMode(true))
        dispatch(setFamilyItemDataEventRetrieved(true))
        dispatch(setAssetFamily(res.data))
      }) 
      .catch(err => {
        throw(err)
      })
  }
}

export const setAssetFamily = (family) => {
  return {
    type: types.SET_ASSET_FAMILY,
    family
  }
}

export const assetLegalEvents = (applicationNumber, patentNumber) => { 
  return dispatch => {
    dispatch(setLegalDataEventRetrieved(true))
    return PatenTrackApi
      .assetLegalEvents(applicationNumber, patentNumber)
      .then(res => {        
        dispatch(setLegalDataEventRetrieved(false))
        dispatch(setAssetLegalEvents(res.data))
      }) 
      .catch(err => {
        throw(err)
      })
  }
}

export const allAssetsSurchargeLegalEvents = (companies) => { 
  return dispatch => {
    dispatch(setLegalDataEventRetrieved(true))
    return PatenTrackApi
      .allAssetsSurchargeLegalEvents(companies)
      .then(res => {        
        console.log('allAssetsSurchargeLegalEvents', res.data)
        dispatch(setLegalDataEventRetrieved(false))
        dispatch(setAssetLegalEvents(res.data))
      }) 
      .catch(err => {
        throw(err)
      })
  }
}

export const setFamilyItemDisplay = (item) => {
  return {
    type: types.SET_FAMILY_ITEM_DETAIL,
    item
  }
}

export const setAssetLegalEvents = (events) => {
  return {
    type: types.SET_ASSET_LEGAL_EVENTS,
    events
  }
}

export const selectTreeCompany = (companyName) => {
  return {
    type: types.SET_TREE_COMPANY_SELECT,
    company_name: companyName
  }
}

export const setRecordItems = (itemType, itemOption, data) => {
  return {
    type: types.SET_RECORD_ITEMS,
    itemType,
    itemOption,
    data
  }
}

export const setRecordItemsLoading = (data) => {
  return {
    type: types.SET_RECORD_ITEMS_LOADING,
    data
  }
}

export const getRecordItems = (type, option, flag) => {
  return dispatch => {
    dispatch(setRecordItemsLoading(true))
    return PatenTrackApi
      .getRecordItems(type, option)
      .then(res => {
        if (flag) {
          dispatch(setRecordItemsLoading(false))
          dispatch(setRecordItems(type, option, res.data))
        }
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const postRecordItems = (data, type) => {
  return dispatch => {
    return PatenTrackApi
      .postRecordItems(data, type)
      .then(res => {        
        if(typeof res == 'object') {
          if(typeof res.data !== 'undefined') {
            dispatch(findRecord(res.data.activity_id))                       
            //dispatch(setShareUrl( res.data.share_url ));
            if(typeof res.data.share_url !== 'undefined' && type < 3) {
              let body  = `${res.data.comment} \n\n\n ${res.data.document} \n\n\n ${res.data.share_url}`
              window.open(`mailto:${res.data.email_address}?subject=Fix it&body=${encodeURIComponent(body)}`,'_BLANK')
            }
          } else {
            //
          }
        }
        
        dispatch(getRecordItems(type, 'count', 1))
        dispatch(getRecordItems(type, 'list', 1))        
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setRecord = (data) => {
  return {
    type: types.SET_RECORD,
    data
  }
}

export const findRecord = (ID) => {
  return dispatch => {
    dispatch(setCommentsLoading(true))
    return PatenTrackApi
      .findRecord(ID)
      .then(res => {   
        dispatch(setCommentsLoading(false))
        dispatch(setComments([]))
        dispatch(setRecord(null))
        if(res.data.id > 0) {
          if(res.data.subject != '' && res.data.type == '1') {
            dispatch(setCurrentAsset(res.data.subject))
            dispatch(setCurrentCollectionID(''))
            dispatch(setIllustrationUrl('about:blank'))
            dispatch(getAssets(res.data.subject))
            dispatch(getAssetsOutsource(1, res.data.subject))
          }
          if(res.data.type == '2' || res.data.type == '1'){ 
            if(res.data.type == '1'){
              res.data.documents = { file: '' }
            }            
            dispatch(setRecord(res.data))
          }
        }
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const completeRecord = (data, ID, type) => {
  return dispatch => {
    return PatenTrackApi
      .completeRecord(data, ID)
      .then(res => {   
        dispatch(getRecordItems(1, 'count', 1))
        dispatch(getRecordItems(1, 'list', 1))

        dispatch(getRecordItems(2, 'count', 1))
        dispatch(getRecordItems(2, 'list', 1))
        
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setLawyerItems = (data) => {
  return {
    type: types.SET_LAWYERS_LIST,
    data
  }
}

export const getLawyers = (flag) => {
  return dispatch => {    
    return PatenTrackApi
      .getLawyers()
      .then(res => {
        if (flag)
          dispatch(setLawyerItems(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const addLawyer = ( user ) => {
  return dispatch => {    
    return PatenTrackApi
      .addLawyer( user )
      .then(res => {
        dispatch(getLawyers())
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const updateLawyer = ( user, ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateLawyer( user, ID )
      .then(res => {
        dispatch(setEditRow(true))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const deleteLawyer = ( ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteLawyer( ID )
      .then(res => {
        dispatch(setDeleteRow(true))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const addAddress = ( address, companyID ) => {
  return dispatch => {    
    return PatenTrackApi
      .addAddress( address, companyID )
      .then(res => {
        dispatch(getAddressList(companyID))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
} 

export const addCompanyLawyer = ( companyLawyer, companyID ) => {
  return dispatch => {    
    return PatenTrackApi
      .addCompanyLawyer( companyLawyer, companyID )
      .then(res => {
        dispatch(getCompanyLawyerList(companyID))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const addTelephone = ( telephone, companyID ) => {
  return dispatch => {    
    return PatenTrackApi
      .addTelephone( telephone, companyID )
      .then(res => {
        dispatch(getTelephoneList(companyID))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const getAddressList = (companyID) => {
  return dispatch => {    
    return PatenTrackApi
      .getAddresses(companyID)
      .then(res => {
        dispatch(setAddressList(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setAddressList = (data) => {
  return {
    type: types.SET_ADDRESS_LIST,
    data
  }
}

export const getTelephoneList = (companyID) => {
  return dispatch => {    
    return PatenTrackApi
      .getTelephones(companyID)
      .then(res => {
        dispatch(setTelephoneList(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setTelephoneList = (data) => {
  return {
    type: types.SET_TELEPHONE_LIST,
    data
  }
}

export const getCompanyLawyerList = (companyID) => {
  return dispatch => {    
    return PatenTrackApi
      .getCompanyLawyers(companyID)
      .then(res => {
        dispatch(setCompanyLawyerList(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setCompanyLawyerList = (data) => {
  return {
    type: types.SET_COMPANY_LAWYER_LIST,
    data
  }
}


export const setDocumentItems = (data) => {
  return {
    type: types.SET_DOCUMENTS_LIST,
    data
  }
}

export const setDocumentsLoading = (t) => {
  return {
    type: types.SET_DOCUMENT_ITEMS_LOADING,
    payload: t
  }
}

export const getDocuments = (flag) => {
  return dispatch => {    
    return PatenTrackApi
      .getDocuments()
      .then(res => {
        dispatch(setDocumentItems(res.data))          
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const addDocument = ( document ) => {
  return dispatch => {    
    dispatch(setDocumentsLoading(true))
    return PatenTrackApi
      .addDocument( document )
      .then(res => {
        dispatch(setDocumentsLoading(false))
        dispatch(getDocuments())
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const updateDocumentRow = (row) => {
  return {
    type: types.SET_DOCUMENT_UPDATE_ROW,
    row
  }
}

export const updateDocument = ( user, ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateDocument( user, ID )
      .then(res => {
        dispatch(setEditRow(true))
        dispatch(updateDocumentRow(res.data))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const deleteDocument = ( ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteDocument( ID )
      .then(res => {
        dispatch(setDeleteRow(true))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const setCompanies = (data) => {
  return {
    type: types.SET_COMPANIES_LIST,
    data
  }
}

export const setCompanyLoading = ( t ) => {
  return {
    type: types.SET_COMPANY_LOADING,
    payload: t
  }
}

export const getCompanies = () => {
  return dispatch => {    
    dispatch(setCompanyLoading(true))
    return PatenTrackApi
      .getCompanies()
      .then(res => {
          dispatch(setCompanyLoading(false))
          dispatch(setCompanies(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const deleteCompany = (list) => {
  return dispatch => {
    return PatenTrackApi.deleteCompany(list)
      .then(res => {
        dispatch(getCompanies())
      })
      .catch(err => {
        throw( err )
      })
  }
}


export const setMainCompanyChecked = ( t ) => {
  return {
    type: types.SET_MAIN_COMPANY_SELECTED,
    payload: t
  }
}

export const setSelectedCompany = ( name ) => {
  return {
    type: types.SET_SUB_COMPANY_SELECTED_NAME,
    name
  }
}

export const setSelectedSearchCompanies = ( name ) => {
  return {
    type: types.SET_SEARCH_COMPANY_SELECTED,
    name
  }
}

export const setSettingText = ( name ) => {  
  return {
    type: types.SET_SETTING_TEXT,
    name
  }
}


export const setSearchCompanyLoading = ( t ) => {
  return {
    type: types.SET_SEARCH_COMPANY_LOADING,
    payload: t
  }
}

export const setSearchCompanies = ( data ) => {
  return {
    type: types.SET_SEARCH_COMPANY,
    list: data
  }
}



export const cancelRequest = ( ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(false))
    PatenTrackApi.cancelRequest()
    dispatch(setSearchCompanyLoading(false))
    dispatch(setSearchCompanies([]))
  }
}


export const searchCompany = ( name ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true))
    return PatenTrackApi
      .searchCompany( name )
      .then(res => {        
          dispatch(setSearchCompanyLoading(false))
          dispatch(setSearchCompanies(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const addCompany = (data) => {
  return dispatch => {
    return PatenTrackApi
      .addCompany(data)
      .then(res => {        
        if(typeof res == 'object') {
          console.log(res.data)          
        }
        dispatch(getCompanies())
        /* dispatch(getTimeLine(0, true))
        dispatch(getCustomers('employee', true)) */
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setUsers = (data) => {
  return {
    type: types.SET_USERS_LIST,
    data
  }
}

export const setUsersLoading = (data) => {
  return {
    type: types.SET_USERS_LIST_LOADING,
    data
  }
}

export const getUsers = () => {
  return dispatch => {    
    dispatch(setUsersLoading(true))
    return PatenTrackApi
      .getUsers()
      .then(res => {
        dispatch(setUsers(res.data))    
        
        dispatch(setUsersLoading(false))
      })
      .catch(err => {
        dispatch(setUsersLoading(false))
        throw(err)
      })
  }
}

export const setEditRow = (data) => {
  return {
    type: types.SET_EDIT_ROW,
    payload: data
  }
}

export const updateUser = ( user, ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateUser( user, ID )
      .then(res => {
        dispatch(setEditRow(true))
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}

export const addUser = ( user ) => {
  return dispatch => {    
    return PatenTrackApi
      .addUser( user )
      .then(res => {
        dispatch(getUsers())
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err)
      })
  }
}



export const setDeleteRow = (data) => {
  return {
    type: types.SET_DELETE_ROW,
    payload: data
  }
}

export const deleteUser = ( ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteUser( ID )
      .then(res => {
        dispatch(setDeleteRow(true))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setCurrentWidget = (data) => {
  return {
    type: types.SET_CURRENT_WIDGET,
    data
  }
}

export const setCookie = () => {
  return {
    type: types.SET_COOKIE,
  } 
}

export const initStage = () => {
  return {
    type: types.INIT_STAGE,
  }
}

export const changeWidthAndHeight = (screenHeight, screenWidth) => {
  return {
    type: types.CHANGE_WIDTH_AND_HEIGHT,
    screenHeight,
    screenWidth
  }
}

export const initEnvironment = () => {
  return dispatch => {
    dispatch(initStage())
    dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth))

    window.onresize = () => {
      dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth))
    }
  }
}

export const setMessagesCount = (data) => {
  return {
    type: types.SET_MESSAGES_COUNT,
    data
  }
}

export const getMessagesCount = () => {
  return dispatch => {
    return PatenTrackApi
      .getMessages('count')
      .then(res => {
        dispatch(setMessagesCount(res.data.count))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setAlertsCount = (data) => {
  return {
    type: types.SET_ALERTS_COUNT,
    data
  }
}

export const getAlertsCount = () => {
  return dispatch => {
    return PatenTrackApi
      .getAlerts('count')
      .then(res => {
        dispatch(setAlertsCount(res.data.count))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setCharts = (option, data) => {
  return {
    type: types.SET_CHARTS,
    option,
    data
  }
}

export const setChartOne = (data, option) => {
  return {
    type: types.SET_CHART_ONE,
    option,
    data
  }
}

export const setChartsLoading = (data) => {
  return {
    type: types.SET_CHARTS_LOADING,
    data
  }
}

export const getCharts = (option, flag) => {
  return dispatch => {
    dispatch(setChartsLoading(true))
    return PatenTrackApi
      .getCharts(option)
      .then(res => {
        dispatch(setChartsLoading(false))
        dispatch(setCharts(option, res.data[0]))  
      })
      .catch(err => {
        throw(err)
      })  
  }
}

export const getChartsOne = (option, flag) => {
  return dispatch => {
    dispatch(setChartsLoading(true))
    return PatenTrackApi
      .getChartsOne(option)
      .then(res => {
        dispatch(setChartsLoading(false))
        dispatch(setChartOne(res.data, option))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setTimeLine = (data) => {
  return {
    type: types.SET_TIME_LINE,
    data
  }
}

export const setTimeLineLoading = (data) => {
  return {
    type: types.SET_TIME_LINE_LOADING,
    data
  }
}

export const getTimeLine = (tabId, flag) => {
  return dispatch => { 
    dispatch(setTimeLineLoading(true))
    dispatch(setAddYears(true))
    return PatenTrackApi.getTimeLine(tabId)
      .then(res => {
        if (flag) {
          dispatch(setTimeLineLoading(false))
          dispatch(setTimeLine(res.data))
        }
      })
      .catch(err => { 
        throw err
      })
  }
}

export const getTimelineFilterWithDate = (groupId, startDate, endDate, scroll) => {
  return dispatch => {
    dispatch(setAddYears(false))
    return PatenTrackApi.getTimelineFilterWithDate(groupId, startDate, endDate, scroll)
      .then(res => {
        dispatch(setTimeLineLoading(false))
        dispatch(setTimeLine(res.data))
      })
      .catch(err => { 
        throw err
      })
  }
}

export const getFilterTimeLine = ( grandParent, label, depth, tabId ) => {
  setTimeLineLoading(true)
  return dispatch => {
    dispatch(setTimeLineLoading(true))    
    return PatenTrackApi.getFilterTimeLine( grandParent, label, depth, tabId )
      .then(res => {
        dispatch(setTimeLineLoading(false))
        dispatch(setTimeLine(res.data))
      })
      .catch(err => {
        throw err
      })
  }
}

export const setAddYears = (option) => {
  return {
    type: types.SET_ADD_YEARS,
    option
  }
}

export const setIllustrationUrl = (url) => {
  return {
    type: types.SET_ILLUSTRATION_URL,
    illustrationUrl: url
  }
}

export const setComments = (data) => {
  return {
    type: types.SET_COMMENTS,
    data
  }
}

export const setCommentsLoading = (data) => {
  return {
    type: types.SET_COMMENTS_LOADING,
    data
  }
}

export const getComments = (type, value) => {
  return dispatch => {
    dispatch(setCommentsLoading(true))
    dispatch(setComments([]))
    dispatch(setRecord(null))
    return PatenTrackApi.getComments(type, value)
      .then(res => {
        dispatch(setCommentsLoading(false))
        dispatch(setComments(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setPortfolioCompany = (company) => {
  return {
    type: types.SET_PORTFOLIO_COMPANY,
    company
  }
}  

export const setPortfolioCompanyCustomer = (company_customer) => {
  return {
    type: types.SET_PORTFOLIO_COMPANY_CUSTOMER,
    company_customer
  }
}

export const commentSaved = (message) => {
  return {
    type: types.SET_COMMENT_SAVED,
    message: message
  }
}

export const updateComment = ( comment, method, type, value ) => {  
  return dispatch => {
  return PatenTrackApi.updateComment(method, comment, type, value)
      .then(res => {
        dispatch(commentSaved(res.data))
        dispatch(getComments(type, value))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setAssets = (data) => {
  return {
    type: types.SET_ASSETS,
    data
  }
}

export const setPopupAssets = (data) => {
  return {
    type: types.SET_POPUP_ASSETS,
    data
  }
}

export const setDisplayPopupAsset = (d) => {
  return {
    type: types.SET_POPUP_ASSETS_DISPLAY,
    d
  }
}

export const setAssetsLoading = (data) => {
  return {
    type: types.SET_ASSETS_LOADING,
    data
  }
}

export const getAssets = (patentNumber) => {
  return dispatch => {
    dispatch(setAssetsLoading(true))
    return PatenTrackApi.getAssetsByPatentNumber(patentNumber)
      .then(res => {
        dispatch(setAssetsLoading(false))
        dispatch(setIllustrationUrl('./d3/index.html'))
        dispatch(setAssets(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const getCollectionIllustration = (rfID, changeTab) => {
  return dispatch => {
    dispatch(setAssetsLoading(true))
    return PatenTrackApi.getCollectionIllustration(rfID)
      .then(res => {
        dispatch(setAssetsLoading(false))
        dispatch(setIllustrationUrl('./d3/index.html'))
        
        if(typeof changeTab != 'undefined'){
          dispatch(setPopupAssets(res.data))    
          dispatch(setDisplayPopupAsset(''))      
        } else {
          dispatch(setAssets(res.data))        
        }
      })
      .catch(err => {
        throw(err)
      })
    }
}

export const setAssetsOutsource = (data) => {
  return {
    type: types.SET_ASSETS_OUTSOURCE,
    data
  }
}

export const setAssetsOutsourceLoading = (data) => {
  return {
    type: types.SET_ASSETS_OUTSOURCE_LOADING,
    data
  }
}

export const getAssetsOutsource = (type, patentNumber) => {
  return dispatch => {
    dispatch(setAssetsOutsourceLoading(true))
    return PatenTrackApi.geteAssetsOutsourceByPatentNumber(type, patentNumber)
      .then(res => {
        dispatch(setAssetsOutsourceLoading(false))
        dispatch(setAssetsOutsource(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const share = (data) => {
  return dispatch => {
    return PatenTrackApi
      .shareIllustration(data)
      .then(res => {     
        if(typeof res == 'object') {
          
          let shareURL = res.data
          if(shareURL.indexOf('share') >= 0){
            /**
             * just for temporary replacing
             */
            shareURL = shareURL.replace('https://share.patentrack.com','http://167.172.195.92:3000')
            window.open(shareURL,'_BLANK')
            //dispatch(setAssetShareURL(shareURL));
          }
        } 
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setConnectionData = (data) => {
  return {
    type: types.SET_CONNECTION_DATA,
    data
  }
}

export const setConnectionBoxView = (flag) => {
  return {
    type: types.SET_CONNECTION_VIEW_BOX,
    flag
  }
}

export const setPdfTabIndex = (index) => {
  return {
    type: types.SET_PDF_TAB,
    payload: index
  }
} 

export const setPDFView = (view) => {
  return {
    type: types.SET_PDF_VIEW,
    view
  }
}

export const setPDFFile = ( file ) => {
  return {
    type: types.SET_PDF_FILE,
    file
  }
}

export const setPDFViewModal = (view) => {
  return {
    type: types.SET_PDF_VIEW_MODAL,
    view
  }
}

export const setSubCompanies = (data, name) => {
  return {
    type: types.SET_SUB_COMPANIES,
    data,
    name
  }
} 

export const getSubCompanies = (name) => {
  return dispatch => {
    return PatenTrackApi.getSubCompanies(name)
      .then(res => {
        dispatch(setSubCompanies(res.data, name))
      })
      .catch(err => {
        throw(err)
      })
  }
} 

export const deleteSameCompany = (name) => {
  return dispatch => {
    return PatenTrackApi.deleteSameCompany(name)
      .then(res => {
        dispatch(getCompanies())
      })
      .catch(err => {
        throw( err )
      })
  }
}

export const setCompanyTreeOpen = (key, value) => {
  return {
    type: types.SET_COMPANY_TREE_OPEN,
    key,
    value
  }
}

export const resetCompanyTree = () => {
  return {
    type: types.RESET_COMPANY_TREE,
  }
}

export const setTreeOpen = (key, value) => {
  return {
    type: types.SET_TREE_OPEN,
    key,
    value
  }
}

export const setCurrentAsset = (data) => {
  return {
    type: types.SET_CURRENT_ASSET,
    data
  }
}

export const setCurrentAssetType = (data) => {
  return {
    type: types.SET_CURRENT_ASSET_TYPE,
    data
  }
} 

export const setCurrentCollectionID = (data) => {
  return {
    type: types.SET_CURRENT_COLLECTION_ID,
    data
  }
}

export const setSiteLogo = (data) => {
  return {
    type: types.SET_SITE_LOGO,
    data
  }
}

export const getSiteLogo = () => {
  return dispatch => {
    return PatenTrackApi.getSiteLogo()
      .then(res => {
        dispatch(setSiteLogo(res.data))
      })
      .catch(err => {
        throw(err)
      })
  }
}

export const setCurTreeLevel1 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL1,
    tabId,
    data
  }
}

export const initCurTreeLevel1 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL1,
    tabId
  }
}

export const setCurTreeLevel2 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL2,
    tabId,
    data
  }
}

export const initCurTreeLevel2 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL2,
    tabId
  }
}

export const setCurTreeLevel3 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL3,
    tabId,
    data
  }
}

export const initCurTreeLevel3 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL3,
    tabId
  }
}

export const setCurTreeLevel4 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL4,
    tabId,
    data
  }
}

export const initCurTreeLevel4 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL4,
    tabId
  }
}

export const setNestGridTabIndex = (index) => {
  return dispatch => {
    dispatch(getTimeLine(index, true))
    dispatch(updateNestGridTabIndex(index))
  }
}
export const updateNestGridTabIndex = (index) => {
  return {
    type: types.SET_NESTGRID_TAB,
    payload: index
  }
}


export const setTimelineTabIndex = (index) => {
  return {
    type: types.SET_TIMELINE_TAB,
    payload: index
  }
}

export const setChartTabIndex = (index) => {
  return {
    type: types.SET_CHART_TAB,
    payload: index
  }
}

export const setFixItTabIndex = (index) => {
  return {
    type: types.SET_FIXIT_TAB,
    payload: index
  }
}

export const setErrorTabIndex = (index) => {
  return {
    type: types.SET_ERROR_TAB,
    payload: index
  }
}

export const setRecordItTabIndex = (index) => {
  return {
    type: types.SET_RECORDIT_TAB,
    payload: index
  }
}

export const setSettingTabIndex = (index) => {
  return {
    type: types.SET_SETTING_TAB,
    payload: index
  }
}

export const treeToggle = (data) => {
  return {
    type: types.SET_TREE_TOGGLE,
    data
  }
}

export const treeExpand = (data) => {
  return {
    type: types.SET_TREE_EXPAND,
    data
  }
}

export const setLegalDataEventRetrieved = (flag) => {
  return {
    type: types.SET_LEGAL_EVENT_DATA_RETRIEVED,
    flag
  }
}

export const setFamilyItemDataEventRetrieved = (flag) => {
  return {
    type: types.SET_FAMILY_ITEM_DATA_RETRIEVED,
    flag
  }
}