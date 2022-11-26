import axios from 'axios'
import _toLower from 'lodash/toLower'

import { base_api_url, base_new_api_url } from '../config/config'
import { convertAssetTypeToTabId } from '../utils/assetTypes'

export const DEFAULT_CUSTOMERS_LIMIT = 1000
export const DEFAULT_TRANSACTIONS_LIMIT = 15
export const DEFAULT_PATENTS_LIMIT = 15

const getCookie = name => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const getToken = () => {
  let token = null
  if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'  || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') {
    token = localStorage.getItem('auth_signature')
  } else {
    token = localStorage.getItem('token')
    if (token === null) {
      token = getCookie('token')
    }
  }
  return token
}

const getHeader = () => {
  return {
    headers: {
      'x-auth-token': getToken()
    }
  }    
}

const getBlobHeader = () => {
  return {
    headers: {
      'x-auth-token': getToken(),
      'accept': 'application/octet-stream',
      'Content-Type': 'application/octet-stream'
    }
  }
}  

const getMultiFormUrlHeader = () => {
  return {
    headers: {
      'x-auth-token': getToken(),
      'Content-Type': 'multipart/form-data'
    }
  } 
}

const getFormUrlHeader = () => {
  return {
    headers: {
      'x-auth-token': getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  } 
}

var CancelToken = axios.CancelToken

var cancel, cancelCPC, cancelAssets, cancelLifeSpan, cancelTimeline, cancelTimelineActivity,cancelTimelineSecurity, cancelTimelineItem, cancelInitiated, cancelRecords, cancelLink, cancelSummary, cancelAbstract, cancelFamily, cancelSpecifications, cancelClaims, cancelChildCompaniesRequest, cancelDownloadURL, cancelForeignAssetsSheet, cancelForeignAssetsBySheet, cancelForeignAssetTimeline, cancelGetRepoFolder, cancelCitationData, cancelAllAssetsCitationData, cancelPtab, cancelShareTimeline, cancelShareDashboard, cancelClaimsCounter, cancelFiguresCounter, cancelPtabCounter, cancelCitationCounter, cancelSatusCounter, cancelFamilyCounter, cancelFeesCounter, cancelAllDashboardTimelineRequest, cancelAllDashboardRequest, cancelAllDashboardCountRequest, cancelStatus, cancelAssetTypeAssignmentAllAssetsWithFamily, cancelDashboardPartiesData, cancelDashboardPartiesAssignorData, cancelAgentsData, cancelCollectionIllustration;

class PatenTrackApi { 

  static getDocumentIdentifierFile(identifier) {
    return axios.get(`https://developer.uspto.gov/ptab-api/documents/${identifier}/download`, getBlobHeader())
  }

  static getSiteLogo() {
    return axios.get(`${base_api_url}/site_logo`, getHeader())
  }

  static getProfile() {  
    return axios.get(`${base_new_api_url}/profile`, getHeader())
  }

  static getCompaniesList() {
    return axios.get(`${base_new_api_url}/companies`, getHeader())
  }

  static getChildCompanies(companyID, offset = 0 ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelChildCompaniesRequest = c
    })
    return axios.get(`${base_new_api_url}/companies/${companyID}/list?offset=${offset}&limit=${DEFAULT_CUSTOMERS_LIMIT}`, header)
  }

  static cancelChildCompanies() {
    if (cancelChildCompaniesRequest !== undefined) {
      try{
        throw cancelChildCompaniesRequest('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getParentCompanies( offset = 0, column, direction ) {
    return axios.get(`${base_new_api_url}/companies/list?offset=${offset}&limit=${DEFAULT_CUSTOMERS_LIMIT}&column=${column}&direction=${direction}`,
      getHeader(),
    )
  }

  static getMaintainenceAssetsList( representative_id, offset = 0 ) {
    return axios.get(`${base_new_api_url}/companies/maintainence_assets?representative_id=${JSON.stringify(representative_id)}&offset=${offset}&limit=${DEFAULT_CUSTOMERS_LIMIT}`,
      getHeader(),
    )
  }

  static getMaintainenceAssetsEventsList( representative_id) {
    return axios.get(`${base_new_api_url}/companies/maintainence_assets_events?representative_id=${JSON.stringify(representative_id)}`,
      getHeader(),
    )
  }

  static getCompaniesUserList(companyID) {
    return axios.get(`${base_new_api_url}/companies${companyID}/users`, getHeader())
  }

  static linkWithSheet( type, form ) {
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelLink = c
    })
    return axios.post(`${base_new_api_url}/documents/sheet/${type}`, form, header)
  }

  static cancelLinkRequest() {
    if (cancelLink !== undefined) {
      try{
        throw cancelLink('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }
  
  static addCompanyRequest( form ) {
    let header = getFormUrlHeader()
    return axios.post(`${base_new_api_url}/companies/request`, form, header)    
  }

  static getCompaniesRequest( ) {
    return axios.get(`${base_new_api_url}/companies/request`, getHeader())
  } 

  static linkSheetSelectedData( type, asset, form ) {
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelLink = c
    })
    return axios.post(`${base_new_api_url}/documents/sheet/${type}/${asset}`, form, header)    
  }

  static linkSheetUpdateData( form, type  ) {
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelLink = c
    })
    return axios.put(`${base_new_api_url}/documents/sheet/${type}`, form, header)
  }

  static getSheetDetails( form ) {   
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelLink = c
    })
    return axios.post(`${base_new_api_url}/documents/sheet`, form, header)    
  }

  static getSheet( type, form ) {
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelLink = c
    })
    return axios.post(`${base_new_api_url}/documents/sheet/${type}/url`, form, header)    
  }

  static getUsers() {
    return axios.get(`${base_new_api_url}/users`, getHeader())
  }

  static addUser(user) {
    return axios.post(`${base_new_api_url}/users`, user, getMultiFormUrlHeader())
  }

  static updateUser( user, ID ) {
    return axios.put(`${base_new_api_url}/users/${ID}`, user, getMultiFormUrlHeader())
  }

  static deleteUser( ID ) {
    return axios.delete(`${base_new_api_url}/users/${ID}`, getFormUrlHeader())
  }

  static getLawyers() {
    return axios.get(`${base_new_api_url}/professionals`, getHeader())
  }

  static addLawyer( lawyer ) {
    return axios.post(`${base_new_api_url}/professionals`, lawyer, getFormUrlHeader())
  }

  static updateLawyer( user, ID ) {
    return axios.put(`${base_new_api_url}/professionals/${ID}`, user, getFormUrlHeader())
  }

  static deleteLawyer( ID ) {
    return axios.delete(`${base_new_api_url}/professionals/${ID}`, getFormUrlHeader())
  }

  static getValidateCounter(companies) { 
    return axios.get(`${base_new_api_url}/validity_counter?companies=${companies}`, getHeader())
  } 

  static getAssetTypes(companies) { 
    return axios.get(`${base_new_api_url}/customers/asset_types?companies=${JSON.stringify(companies)}`, getHeader())
  }

  static getAssetTypeIDCompanies(companies, tabID, layoutID) { 
    return axios.get(`${base_new_api_url}/customers/asset_types/${tabID}/companies?companies=${JSON.stringify(companies)}&layout=${layoutID}`, getHeader())
  }

  static getAssetTypeCompanies(companies, tabs) { 
    return axios.get(`${base_new_api_url}/customers/asset_types/companies?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}`, getHeader())
  }

  static getAssetTypeAssignments(companies, tabs, customers, layoutID) { 
    return axios.get(`${base_new_api_url}/customers/asset_types/assignments?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&layout=${layoutID}`, getHeader())
  }

  static getAssetTypeAssignmentAssets(assignmentRFID, layoutID) { 
    return axios.get(`${base_new_api_url}/customers/asset_types/assignments/${assignmentRFID}?layout=${layoutID}`, getHeader())
  }

  static getAssetTypeAssignmentAllAssets(companies, tabs, customers, rfIDs) { 
    return axios.get(`${base_new_api_url}/customers/asset_types/assets?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&assignments=${JSON.stringify(rfIDs)}`, getHeader())
  }

  static getAssetTypeAssignmentAllAssetsWithFamily(form) { 
    let header = getFormUrlHeader()  
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAssetTypeAssignmentAllAssetsWithFamily = c
    })
    return axios.post(`${base_new_api_url}/customers/asset_types/assets/family`, form, header)
  }

  static cancelAssetTypeAssignmentAllAssetsWithFamily() {
    if (cancelAssetTypeAssignmentAllAssetsWithFamily !== undefined && typeof cancelAssetTypeAssignmentAllAssetsWithFamily.cancel == 'function') {
      try{
        throw cancelAssetTypeAssignmentAllAssetsWithFamily('Cancelled request manually.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  } 
  
  static getAgentsData(form) { 
    let header = getFormUrlHeader() 
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAgentsData = c
    })
    return axios.post(`${base_new_api_url}/customers/asset_types/assets/agents`, form, header)
  }

  static cancelAgentsData() {
    if (cancelAgentsData !== undefined && typeof cancelAgentsData.cancel == 'function') {
      try{
        throw cancelAgentsData('Request cancelled for agents')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  } 

  

  static getRestoreOwnershipAssets(companies, tabs, customers, rfIDs) { 
    return axios.get(`${base_new_api_url}/customers/restore_ownership/assets?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&assignments=${JSON.stringify(rfIDs)}`, getHeader())
  }

  static getCustomerAssets(type, companies, tabs, customers, rfIDs, startIndex, endIndex, column, direction, salesAssets) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) { 
      cancelAssets = c
    })
    return axios.get(`${base_new_api_url}/customers/${type}/assets?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&assignments=${JSON.stringify(rfIDs)}&offset=${startIndex}&limit=${endIndex}&column=${column}&direction=${direction}&other_mode=${salesAssets}`, header)
  } 

  static getCustomerSelectedAssets(shareCode) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAssets = c
    })
    let type =   process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' ? 0 : process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? 2 : 1

    return axios.get(`${base_new_api_url}/share/${shareCode}/${type}`, header)
  }

  static cancelAssets() {
    if (cancelAssets !== undefined && typeof cancelAssets.cancel == 'function') {
      try{
        throw cancelAssets('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getShareDashboardList(shareCode) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelShareDashboard = c
    })
    return axios.get(`${base_new_api_url}/share/dashboard/list/${shareCode}`, header)
  }

  static cancelShareDashboard() {
    if (cancelShareDashboard !== undefined) {
      try{
        throw cancelShareDashboard('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getShareTimelineList(shareCode) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelShareTimeline = c
    })
    return axios.get(`${base_new_api_url}/share/timeline/list/${shareCode}`, header)
  }

  static cancelShareTimeline() {
    if (cancelShareTimeline !== undefined && typeof cancelShareTimeline.cancel == 'function') {
      try{
        throw cancelShareTimeline('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }
  
  static getAssetLifeSpan( form ) { 
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelLifeSpan = c
    })
    return axios.post(`${base_new_api_url}/events/assets`, form, header)
  }

  static cancelLifeSpanRequest() {
    if (cancelLifeSpan !== undefined && typeof cancelLifeSpan.cancel == 'function') {
      try{
        throw cancelLifeSpan('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getCPC( form ) { 
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelCPC = c
    })
    return axios.post(`${base_new_api_url}/assets/cpc`, form, header)
  }

  static cancelCPCRequest() {
    if (cancelCPC !== undefined && typeof cancelCPC.cancel == 'function') {
      try{
        throw cancelCPC('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static downloadPDFUrl( ID ) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelDownloadURL = c
    })
    return axios.get(`${base_new_api_url}/assets/download/${ID}`, header)
  }

  static cancelDownloadRequest() {
    if (cancelDownloadURL !== undefined && typeof cancelDownloadURL.cancel == 'function') {
      try{
        throw cancelDownloadURL('Operation canceled by the user.') 
      } catch (e){
        console.log('cancelRequest->', e)
      }  
    } 
  }

  static validateForeignAssets(form) {  
    return axios.post(`${base_new_api_url}/assets/validate/`, form, getFormUrlHeader())
  }

  static moveAssetForSale(form) { 
    return axios.post(`${base_new_api_url}/assets/assets_for_sale/`, form, getFormUrlHeader())
  }

  static assetForMaintainence(form) { 
    return axios.post(`${base_new_api_url}/assets/maintainence/`, form, getFormUrlHeader())
  }

  static saveForeignAssets(form) { 
    return axios.post(`${base_new_api_url}/assets/external_assets/`, form, getFormUrlHeader())
  }

  static deleteItemFromExternalSheet(form) { 
    const header = getHeader()
    return axios.delete(`${base_new_api_url}/assets/external_assets/`,  {headers: header.headers, data: form} )
  }

  static updateItemFromExternalSheet(form) { 
    return axios.patch(`${base_new_api_url}/assets/external_assets/`,  form, getFormUrlHeader() )
  }
 
  static appendItemFromExternalSheet(form) { 
    return axios.put(`${base_new_api_url}/assets/external_assets/`, form, getFormUrlHeader())
  }

  static getForeignAssetsSheets(form) {  
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelForeignAssetsSheet = c
    })
    return axios.post(`${base_new_api_url}/assets/external_assets/sheets`, form, header)
  }

  static cancelForeignAssetsSheet() { 
    if (cancelForeignAssetsSheet !== undefined) {
      try{
        throw cancelForeignAssetsSheet('Operation canceled by the user.') 
      } catch (e){
        console.log('cancelRequest->', e)
      }  
    } 
  }

  static getForeignAssetsBySheet(form) { 
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelForeignAssetsBySheet = c
    })
    return axios.post(`${base_new_api_url}/assets/external_assets/sheets/assets`, form, header)
  } 

  static cancelForeignAssetsBySheet() {
    if (cancelForeignAssetsBySheet !== undefined) {
      try{
        throw cancelForeignAssetsBySheet('Operation canceled by the user.') 
      } catch (e){
        console.log('cancelRequest->', e)
      }  
    } 
  }
   
  static getForeignAssetsTimeline(form) { 
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelForeignAssetTimeline = c
    })
    return axios.post(`${base_new_api_url}/assets/external_assets/sheets/timeline`, form, header)
  } 

  static cancelForeignAssetTimeline() {
    if (cancelForeignAssetTimeline !== undefined) {
      try{
        throw cancelForeignAssetTimeline('Operation canceled by the user.') 
      } catch (e){
        console.log('cancelRequest->', e)
      }  
    } 
  }
  

  static getAssetsByCPCCode( year, cpcCode, form ) { 
    return axios.post(`${base_new_api_url}/assets/cpc/${year}/${cpcCode}`, form, getFormUrlHeader())
  }

  static getTransactionByRfIds( form ) { 
    return axios.post(`${base_new_api_url}/customers/transactions/groupids`, form, getFormUrlHeader())
  }

  static getAddressQueue( form ) { 
    return axios.post(`${base_new_api_url}/customers/transactions/queues/address`, form, getFormUrlHeader())
  }

  static getNameQueue( form ) { 
    return axios.post(`${base_new_api_url}/customers/transactions/queues/name`, form, getFormUrlHeader())
  }

  static getCustomerAddressByCompanyIDs( companies) {  
    return axios.get(`${base_new_api_url}/address/companies?companies=${JSON.stringify(companies)}`, getHeader())
  } 

  static getCustomerTransactions(type, companies, tabs, customers) { 
    return axios.get(`${base_new_api_url}/customers/${type}/transactions?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}`, getHeader())
  } 

  static getCustomerParties(type, companies, tabs, customerType) {  
    return axios.get(`${base_new_api_url}/customers/${type}/parties?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&t=${customerType}`, getHeader())
  } 

  static getCustomerAddressTransactions( companies, tabs, customers) {  
    return axios.get(`${base_new_api_url}/customers/transactions/address?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}`, getHeader())
  } 
  
  static getIncorrectNames( companies) {  
    return axios.get(`${base_new_api_url}/customers/incorrectnames?companies=${JSON.stringify(companies)}`, getHeader())
  } 

  static getCustomerNormalizeNameTransactions( companies, tabs, customers) {  
    return axios.get(`${base_new_api_url}/customers/transactions/name?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}`, getHeader())
  } 

  static getCustomerActivites(type, companies) { 
    return axios.get(`${base_new_api_url}/customers/${type}/activites?companies=${JSON.stringify(companies)}`, getHeader())
  }

  static saveUserCompanySelection(saveUserCompanySelection) {
    return axios.post(`${base_new_api_url}/user_company_selection`, saveUserCompanySelection, getFormUrlHeader())
  }

  static getUserCompanySelections() {
    return axios.get(`${base_new_api_url}/user_company_selection`,  getHeader())
  }

  static updateAssetTypeSelected(saveUserActivitySelection) {
    return axios.post(`${base_new_api_url}/user_activity_selection`, saveUserActivitySelection, getFormUrlHeader())
  } 

  static deleteAssetTypeSelected(saveUserActivitySelection) {
    return axios.put(`${base_new_api_url}/user_activity_selection`, saveUserActivitySelection, getFormUrlHeader())
  }  

  static getUserActivitySelection() {
    return axios.get(`${base_new_api_url}/user_activity_selection`,  getHeader())
  }

  static getPorfolioSummary(selectedCompaniesIds) {
    return axios.get(
      `${base_new_api_url}/customers/portfolios?portfolio=${JSON.stringify(
        selectedCompaniesIds,
      )}`,
      getHeader(),
    )  
  } 

  static getAssetsLifeSpanSummary(selectedCompaniesIds) {
    return axios.get(
      `${base_new_api_url}/customers/events?portfolio=${JSON.stringify(selectedCompaniesIds)}`,
      getHeader(),
    )
  }

  static getSearch(searchString) {
    return axios.get(`${base_new_api_url}/search/${searchString}`, getHeader())
  }

  static getCompanySummary(accessToken, userEmail) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelSummary = c 
    })
    return axios.get(`${base_new_api_url}/companies/summary?access_token=${accessToken}&user_account=${userEmail}`, header)
  }

  static cancelSummaryRequest() {
    if (cancelSummary !== undefined) {
      try{
        throw cancelSummary('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getAssetsCompanies(assetsType) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/tabs/${tabId}`, getHeader())
  }

  static fetchAssetsCustomers(assetsType, companyIds) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/tabs/${tabId}/customers?companiesIds=${JSON.stringify(companyIds)}&limit=${DEFAULT_CUSTOMERS_LIMIT}`,
      getHeader(),
    )
  }

  static fetchMoreAssetsCustomers(assetsType, companyIds, { offset = 0, limit = DEFAULT_CUSTOMERS_LIMIT }) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/tabs/${tabId}/customers?companiesIds=${JSON.stringify(companyIds)}&offset=${offset}&limit=${limit}`,
      getHeader(),
    )
  }

  static getAssetsTransactions(assetsType, companyId, customerId, { offset = 0, limit = DEFAULT_TRANSACTIONS_LIMIT }) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/tabs/${tabId}/companies/${companyId}/customers/${customerId}?offset=${offset}&limit=${limit}`,
      getHeader(),
    )
  }

  static getAssetsPatents(assetsType, companyId, customerId, transactionId, { offset = 0, limit = DEFAULT_PATENTS_LIMIT }) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/tabs/${tabId}/companies/${companyId}/customers/${customerId}/transactions/${transactionId}?offset=${offset}&limit=${limit}`,
      getHeader(),
    )
  }

  static getAssetsCompaniesEvents(assetsType) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(`${base_new_api_url}/events/tabs/${tabId}`, getHeader())
  }

  static getAssetsCustomersEvents(assetsType, companyId) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/events/tabs/${tabId}/companies/${companyId}`,
      getHeader(),
    )
  }  

  static getAllAssetsTransactionsEvents(type, companies, tabs, customers, rfIDs) {
    return axios.get(
      `${base_new_api_url}/events/tabs?type=${type}&companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&rf_ids=${JSON.stringify(rfIDs)}`,
      getHeader(),
    )
  }

  static getAssetsTransactionsEvents(assetsType, companyId, customerId, transactionId) {
    const tabId = assetsType != null ? convertAssetTypeToTabId(assetsType) : undefined
    return axios.get(
      `${base_new_api_url}/events/tabs/${tabId}/companies/${companyId}/customers/${customerId}/transactions/${transactionId}`,
      getHeader(),
    )
  }

  static getAssetsPatentsEvents(assetsType, companyId, customerId, transactionId) {
    const tabId = convertAssetTypeToTabId(assetsType)
    return axios.get(
      `${base_new_api_url}/events/tabs/${tabId}/companies/${companyId}/customers/${customerId}/transactions/${transactionId}`,
      getHeader(),
    )
  }

  static getAssetsByTransactionsEvents(transactionId) {
    return axios.get(
      `${base_new_api_url}/events/transactions/${transactionId}`,
      getHeader(),
    )
  }

  static getAssetsByApplicationNumberEvents(applicationNumber) {
    return axios.get(`${base_new_api_url}/events/${applicationNumber}`, getHeader())
  }

  // static getPorfolioDataByTabId(selectedCompaniesIds, tabId, offset = 0) {
  //   return axios.get(`${base_new_api_url}/customers/portfolios?portfolio=${JSON.stringify(selectedCompaniesIds)}&tab_id=${tabId}&limit=100&offset=${offset}`, getHeader());
  // }

  static getAssetsByPatentNumber(patentNumber, flag) {
    return axios.get(
      `${base_new_api_url}/assets/${encodeURIComponent(patentNumber)}?flag=${flag}`,
      getHeader()
    )
  }

  static getCollectionIllustration(rfID) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelCollectionIllustration = c
    })
    return axios.get(
      `${base_new_api_url}/collections/${rfID}/illustration`,
      header
    )
  }

  static cancelCollectionIllustration() {
    if (cancelCollectionIllustration !== undefined && typeof cancelCollectionIllustration.cancel == 'function') {
      try{
        throw cancelCollectionIllustration('Request cancelled for illustration.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }
  

  static geteAssetUSPTOByPatentNumber(type, patentNumber, flag) {
    return axios.get(
      `${base_new_api_url}/assets/${encodeURIComponent(patentNumber)}/${type}/outsource?flag=${flag}`,
      getHeader()
    )
  }

  static getTimelineData(paramsUrl) {
    return axios.get(`${base_new_api_url}/timeline?${paramsUrl}`, getHeader())
  }

  static getTimelineItemData(itemID) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelTimelineItem = c
    })
    return axios.get(`${base_new_api_url}/timeline/item/${itemID}`, header)
  }

  static cancelTimelineItem() {
    if (cancelTimelineItem !== undefined && typeof cancelTimelineItem.cancel == 'function') {
      try{
        throw cancelTimelineItem('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }


  static allAssetsSurchargeLegalEvents(companies) { 
    return axios.get(`${base_new_api_url}/events/all/assets/surcharge?companies=${JSON.stringify(companies)}`, getHeader())
  } 

  static allFilledAssetsEvents(companies) { 
    return axios.get(`${base_new_api_url}/events/all/assets/to_record?companies=${JSON.stringify(companies)}`, getHeader())
  } 

  static allFilledAssetsEventsDetails(application) { 
    return axios.get(`${base_new_api_url}/events/all/assets/to_record/detail/${application}`, getHeader())
  }

  static getActivitiesTimelineData(companies, tabs, customers, rfIDs = [], layout, exclude) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelTimelineActivity = c
    })
    return axios.get(`${base_new_api_url}/customers/timeline?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&rf_ids=${JSON.stringify(rfIDs)}&layout=${layout}&exclude=${exclude}`, header)
  }

  static getFilledAssetsTimelineData(companies, tabs, customers, rfIDs = [], layout, exclude) {
    let header = getHeader()
    /* header['cancelToken'] = new CancelToken(function executor(c) {
      cancelTimeline = c
    }) */
    return axios.get(`${base_new_api_url}/customers/timeline/filling_assets?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&rf_ids=${JSON.stringify(rfIDs)}&layout=${layout}&exclude=${exclude}`, header)
  }

  static getTimelineSecurityData(companies, tabs, customers, rfIDs = [], layout) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelTimelineSecurity = c
    }) 
    return axios.get(`${base_new_api_url}/customers/timeline/security?companies=${JSON.stringify(companies)}&tabs=${JSON.stringify(tabs)}&customers=${JSON.stringify(customers)}&rf_ids=${JSON.stringify(rfIDs)}&layout=${layout}`, header)
  }

  static cancelTimelineActivity() {
    if (cancelTimelineActivity !== undefined && typeof cancelTimelineActivity.cancel == 'function') {
      try{
        throw cancelTimelineActivity('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static cancelTimelineSecurity() {
    if (cancelTimelineSecurity !== undefined && typeof cancelTimelineSecurity.cancel == 'function') {
      try{
        throw cancelTimelineSecurity('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static cancelTimeline() {
    if (cancelTimeline !== undefined && typeof cancelTimeline.cancel == 'function') {
      try{
        throw cancelTimeline('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getAssetsErrorsData(paramsUrl) {
    return axios.get(`${base_new_api_url}/errors?${paramsUrl}`,
      getHeader()
    )
  }

  static getAssetsActivitiesData(type, options = { count: false }) {
    return axios.get(
      `${base_new_api_url}/activities?type=${type}${
        options.count ? '&count=true' : ''
      }`,
      getHeader()
    )
  }

  static getProfessionals() {
    return axios.get(
      `${base_new_api_url}/professionals`,
      getHeader()
    )
  }

  static getDocuments() {
    return axios.get(
      `${base_new_api_url}/documents`,
      getHeader()
    )
  }

  static deleteDocument(id) {
    return axios.delete(`${base_new_api_url}/documents/${id}`, getFormUrlHeader())
  }

  static addDocument(doc) {
    return axios.post(`${base_new_api_url}/documents`, doc, getMultiFormUrlHeader())
  }

  static updateDocument( doc, ID ) {
    return axios.put(`${base_new_api_url}/documents/${ID}`, doc, getMultiFormUrlHeader())
  }

  static getAddresses() {
    return axios.get(`${base_new_api_url}/address`, getHeader())
  }

  static getDashboardData(formData, source) {
    let header = getFormUrlHeader()
    header['cancelToken'] = source.token
    cancelAllDashboardRequest = source   
    return axios.post(`${base_new_api_url}/dashboards`, formData, header)
  }

  static generateCancelToken = () => {
    return CancelToken
  }

  
  static cancelAllDashboardToken = () => {
    if (cancelAllDashboardRequest !== undefined && typeof cancelAllDashboardRequest.cancel == 'function') {
      try{
        cancelAllDashboardRequest.cancel(`Dashboard request aborted`)        
      } catch (e){
        console.log('cancelInitiated->', e)
      }
    }
  }

  static getDashboardDataCount(formData, source) {
    let header = getFormUrlHeader()
    header['cancelToken'] = source.token
    cancelAllDashboardCountRequest = source   
    return axios.post(`${base_new_api_url}/dashboards/count`, formData, header)
  }
  
  static cancelAllDashboardCountToken = () => {
    if (cancelAllDashboardCountRequest !== undefined && typeof cancelAllDashboardCountRequest.cancel == 'function') {
      try{
        cancelAllDashboardCountRequest.cancel(`Dashboard request aborted`)        
      } catch (e){
        console.log('cancelInitiated->', e)
      }
    }
  }
  

  static findDashboardExample(formData) {
    let header = getFormUrlHeader()
    return axios.post(`${base_new_api_url}/dashboards/example`, formData, header)
  }

  static getDashboardTimelineData(formData, source) {
    let header = getFormUrlHeader()
    header['cancelToken'] = source.token
    cancelAllDashboardTimelineRequest = source   
    return axios.post(`${base_new_api_url}/dashboards/timeline`, formData, header)
  }

  static cancelAllDashboardTimelineToken = () => {
    if (cancelAllDashboardTimelineRequest !== undefined && typeof cancelAllDashboardTimelineRequest.cancel == 'function') {
      try{
        cancelAllDashboardTimelineRequest.cancel(`Dashboard timeline request aborted`)        
      } catch (e){
        console.log('cancelInitiated->', e)
      }
    }
  }

  static getFilledAssets(formData) {
    return axios.post(`${base_new_api_url}/dashboards/filed_assets_events`, formData, getFormUrlHeader())
  }

  static getDashboardPartiesData(formData) {
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelDashboardPartiesData = c
    })
    return axios.post(`${base_new_api_url}/dashboards/parties`, formData, header)
  }

  static cancelDashboardPartiesData = () => {
    if (cancelDashboardPartiesData !== undefined && typeof cancelDashboardPartiesData.cancel == 'function') {
      try{
        cancelDashboardPartiesData.cancel(`Request cancelled for invented, acquired`)        
      } catch (e){
        console.log('cancelInitiated->', e)
      }
    }
  }
  

  static getDashboardPartiesAssignorData(formData) {
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelDashboardPartiesAssignorData = c
    })
    return axios.post(`${base_new_api_url}/dashboards/parties/assignor`, formData, header)
  }

  static cancelDashboardPartiesAssignorData = () => {
    if (cancelDashboardPartiesAssignorData !== undefined && typeof cancelDashboardPartiesAssignorData.cancel == 'function') {
      try{
        cancelDashboardPartiesAssignorData.cancel(`Request cancelled for assignors`)        
      } catch (e){
        console.log('cancelInitiated->', e)
      }
    }
  }
  

  static getLawFirmsByCompany(companies, rfID) {
    return axios.get(`${base_new_api_url}/customers/lawfirm?companies=${JSON.stringify(companies)}&rfID=${rfID}`, getHeader())
  }

  static getLawFirms() {
    return axios.get(`${base_new_api_url}/lawfirm`, getHeader())
  }

  static addLawFirm(lawFirm) {
    return axios.post(`${base_new_api_url}/lawfirm`, lawFirm, getHeader())   
  }

  static addLawFirmAddress(address) {
    return axios.post(`${base_new_api_url}/lawfirm_address`, address, getHeader())
  }

  static updateLawFirmAddress(addressId, changes) {
    return axios.put(`${base_new_api_url}/lawfirm_address/${addressId}`, changes, getHeader())
  }

  static deleteLawFirmAddress(addressId) {
    return axios.delete(`${base_new_api_url}/lawfirm_address/${addressId}`, getHeader())
  }
  
  static addCompanyAddress(address) {
    return axios.post(`${base_new_api_url}/address`, address, getFormUrlHeader())
  }

  static deleteCompanyAddress(addressId) {
    return axios.delete(`${base_new_api_url}/address/${addressId}`, getFormUrlHeader())
  }

  static updateCompanyAddress(id, address) {
    return axios.put(`${base_new_api_url}/address/${id}`,address, getFormUrlHeader())
  }

  static getCompanyLawyers() {
    return axios.get(`${base_new_api_url}/companies/lawfirm`, getHeader())
  }

  static addCompanyLawyer( lawyer) {
    return axios.post(`${base_new_api_url}/lawyer`, lawyer, getFormUrlHeader())
  }

  static addCompanyLawfirm( lawyer) {
    return axios.post(`${base_new_api_url}/companies/lawfirm`, lawyer, getFormUrlHeader())
  }
  

  static deleteCompanyLawyer(companyLawyerId) {
    return axios.delete(`${base_new_api_url}/lawyer/${companyLawyerId}`, getFormUrlHeader())
  }

  static postRecordItems(data, type) {
    return axios.post(
      `${base_new_api_url}/activities/${type}`,
      data,
      getMultiFormUrlHeader(),
    )
  }

  static setRecordAsCompleted(id, data) {
    return axios.put(
      `${base_new_api_url}/activities/${id}`,
      data,
      getMultiFormUrlHeader(),
    )
  }

  static getComments(level, id) {
    return axios.get(`${base_new_api_url}/comments/${_toLower(level)}/${id}`, getHeader())
  }

  static postComment(type, id, data) {
    return axios.post(`${base_new_api_url}/comments/${_toLower(type)}/${id}`, data, getHeader())
  }

  static async setCommentToEntity(type, data) {
    return axios.post(
      `${base_new_api_url}/comments/${_toLower(type)}`,
       data,
       getFormUrlHeader() 
     )
  }

  static async updateCommentToEntity(ID, data) {
    return axios.put(
      `${base_new_api_url}/comments/${ID}`,
       data,
       getFormUrlHeader() 
     )
  }

  static async deleteComment(ID) {
    return axios.delete(`${base_new_api_url}/comments/${ID}`, getFormUrlHeader())
  }

  static getCharts(option) {
    return axios.get(`${base_new_api_url}/charts/${option}`, getHeader())
  }

  static getTransactions(companies) {
    return axios.get(`${base_new_api_url}/transactions?companies=${companies}`, getHeader())
  }

  static getAssignorAssigneeByTransaction(transactionId, companies) {
    return axios.get(`${base_new_api_url}/transactions/${transactionId}`, getHeader())
  }

  static shareIllustration( data ) {
    return axios.post(`${base_new_api_url}/share`, data, getFormUrlHeader())
  }
  
  static getSlackAuthToken( code, redirectURI ) {
    return axios.get(`${base_new_api_url}/slacks/conversations/auth/${code}?redirect_uri=${redirectURI}`, getHeader())
  }

  static getSlackProfile( token, id ) {
    return axios.get(`${base_new_api_url}/slacks/user/info/${token}/${id}`, getHeader())
  }  

  static updateSlackTeam( data ) {
    return axios.put(`${base_new_api_url}/slacks/team`, data, getFormUrlHeader())
  }

  static getChannels( token ) {
    return axios.get(`${base_new_api_url}/slacks/channels/${token}`, getHeader()) 
  }

  static sendMessage( code, data ) {
    const header = getMultiFormUrlHeader()
    return axios.post(`${base_new_api_url}/slacks/conversations/message/${code}`, data, header)
  }

  static getMessages( code, channelID ) {
    return axios.get(`${base_new_api_url}/slacks/conversations/history/${code}/${channelID}`, getHeader())
  }

  static deleteSlackMessage( code, channelID, messageID ) {
    return axios.delete(`${base_new_api_url}/slacks/conversations/message/${code}/${channelID}/${messageID}`, getHeader())
  }

  static getSlackUsersList(code) {
    return axios.get(`${base_new_api_url}/slacks/conversations/users/${code}`, getHeader())
  }

  static getChannelID( asset ) {
    return axios.get(`${base_new_api_url}/slacks/asset/${asset}`, getHeader())
  }

  static getChannelFiles( channelID, code ) {
    return axios.get(`${base_new_api_url}/slacks/channel/${channelID}/files/${code}`, getHeader())
  }

  static getAssetFiles( assets ) {
    return axios.get(`${base_new_api_url}/assets/${assets}/files`, getHeader())
  }

  static getDriveAndAssetFiles(type, channelID, code, assets, companies, layoutID, gToken, gAccount, assetTypesSelected, selectedAssetCompanies, selectedAssetAssignments, selectedAssetsPatents ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      if(type == 1) {
        cancelInitiated = c
      } else {
        cancelRecords = c
      }
    })

    return axios.get(`${base_new_api_url}/assets/${assets}/files/${channelID}/slack/${code}?type=${type}&companies=${JSON.stringify(companies)}&layout=${layoutID}&g=${gToken}&ga=${gAccount}&activities=${JSON.stringify(assetTypesSelected)}&parties=${JSON.stringify(selectedAssetCompanies)}&rfIDs=${JSON.stringify(selectedAssetAssignments)}&patents=${JSON.stringify(selectedAssetsPatents)}`, header)
  } 

  static cancelInitiated () {
    if (cancelInitiated !== undefined) {
      try{
        throw cancelInitiated('Operation canceled by the user.')
      } catch (e){
        console.log('cancelInitiated->', e)
      }
    } 
  }

  static cancelRecords () {
    if (cancelRecords !== undefined) {
      try{
        throw cancelRecords('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRecords->', e)
      }
    } 
  }

  static getGoogleAuthToken( code ) {
    return axios.get(`${base_new_api_url}/documents/auth_token?code=${code}`, getHeader())
  } 

  static getGoogleProfile( token ) {
    let url = `${base_new_api_url}/documents/profile?access_token=ACCESS_TOKEN&refresh_token=REFRESH_TOKEN`
    url = url.replace('ACCESS_TOKEN', token.access_token)
    if( token.refresh_token != undefined && token.refresh_token != 'undefined' ) {
      url = url.replace('REFRESH_TOKEN', token.refresh_token)
    }
    
    if(url.indexOf('REFRESH_TOKEN') >= 0) {
      url.replace('REFRESH_TOKEN', '')
    }
    return axios.get(url, getHeader())
  }
  
  static getGoogleTemplates( token, id, showFolders ) {
    let url = `${base_new_api_url}/documents/drive?access_token=ACCESS_TOKEN&refresh_token=REFRESH_TOKEN`
    url = url.replace('ACCESS_TOKEN', token.access_token)
    if( token.refresh_token != undefined && token.refresh_token != 'undefined' ) {
      url = url.replace('REFRESH_TOKEN', token.refresh_token)
    }
    
    if(url.indexOf('REFRESH_TOKEN') >= 0) {
      url.replace('REFRESH_TOKEN', '')
    } 
    
    if( id != undefined && id != 'undefined' ) {
      url += `&id=${id}`
    }
    if( typeof showFolders != undefined ) {
      url += `&show_folders=true`
    }

    return axios.get(url, getHeader())
  }

  static getLayoutWithTemplates( token, account ) {
    let url = `${base_new_api_url}/documents/layout?access_token=ACCESS_TOKEN&refresh_token=REFRESH_TOKEN`
    url = url.replace('ACCESS_TOKEN', token.access_token)
    url = url.replace('REFRESH_TOKEN', token.refresh_token)
    if(url.indexOf('REFRESH_TOKEN') >= 0) {
      url.replace('REFRESH_TOKEN', '')
    } 
    if( account != undefined && account != 'undefined' ) {
      url += `&user_account=${account}`
    }
    return axios.get(url, getHeader())
  }   

  static getLayoutTemplatesByID( layoutID, account ) {
    let url = `${base_new_api_url}/documents/layout/${layoutID}/?user_account=${account}`
    return axios.get(url, getHeader())
  }  

  static addContainerToLayout( data ) {
    return axios.post(`${base_new_api_url}/documents/layout`, data, getFormUrlHeader())
  }

  static deleteTemplateFromLayout( layoutID, containerID, userAccount ) {
    return axios.delete(`${base_new_api_url}/documents/layout?layout_id=${layoutID}&container_id=${containerID}&user_account=${userAccount}`, getHeader())
  }

  static getRepoFolder( userAccount ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelGetRepoFolder = c
    })
    return axios.get(`${base_new_api_url}/documents/repo_folder?user_account=${userAccount}`,  header)
  }

  static cancelGetRepoFolder() {
    if (cancelGetRepoFolder !== undefined) {
      try{
        throw cancelGetRepoFolder('Operation canceled by the user.') 
      } catch (e){
        console.log('cancelRequest->', e)
      }  
    } 
  }

  static addRepoFolder( data ) {
    return axios.put(`${base_new_api_url}/documents/repo_folder`, data, getFormUrlHeader())
  }

  static addTemplateFolder( data ) {
    return axios.put(`${base_new_api_url}/documents/template_folder`, data, getFormUrlHeader())
  }

  static createDriveTemplateFile( data ) {
    return axios.post(`${base_new_api_url}/documents/create_template_drive`, data, getFormUrlHeader())
  }

  static downloadXMLFromServer( data ) {
    return axios.post(`${base_new_api_url}/documents/downloadXML`, data, getFormUrlHeader())
  }

  static fixedTransactionAddressXML( form ) {
    return axios.post(`${base_new_api_url}/documents/fixed_transaction_address/downloadXML`, form, getFormUrlHeader())
  }

  static fixedTransactionNameXML( form ) { 
    return axios.post(`${base_new_api_url}/documents/fixed_transaction_name/downloadXML`, form, getFormUrlHeader())
  }

  static createMaintainenceFeeFile( data ) {
    return axios.post(`${base_new_api_url}/documents/create_maintainence_file`, data, getFormUrlHeader())
  } 

  static getConnectionData( popup ) {
    return axios.get(`${base_new_api_url}/connection/${popup}`,  getHeader())
  }

  static getConnectionDataFromAsset( asset, companies ) {
    return axios.get(`${base_new_api_url}/connection/asset/${asset}?companies=${JSON.stringify(companies)}`,  getHeader())
  }
  
  static moveAssetToLayout( data ) {
    return axios.post(`${base_new_api_url}/assets/move`,  data, getFormUrlHeader())
  } 

  static moveAssetRollback( IDs ) {
    return axios.delete(`${base_new_api_url}/assets/rollback?revert=${IDs}`, getHeader())
  } 

  static addGroup( form ) {
    return axios.post(`${base_new_api_url}/companies/group`,  form, getFormUrlHeader())
  } 

  static inviteUserToWorkspace (form) {
    return axios.post(`${base_new_api_url}/users/invite`,  form, getFormUrlHeader())
  }  

  static searchEntity( searchString, type ) {
    if (cancel !== undefined) {
      cancel()
    }
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c
    })
    return axios.get(`${base_new_api_url}/entity/search/${encodeURIComponent(searchString)}/${type}`, header)   
  }    

  static cancelRequest () {
    if (cancel !== undefined) {
      try{
        throw cancel('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getAbstractData( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAbstract = c
    })
    return axios.get(`${base_new_api_url}/family/abstract/${encodeURIComponent(applicationNumber)}`,  header)
  }

  static cancelAbstractData () {
    if (cancelAbstract !== undefined) {
      try{
        throw cancelAbstract('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getClaimsData( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelClaims = c
    })
    return axios.get(`${base_new_api_url}/family/claims/${encodeURIComponent(applicationNumber)}`,  header)
  } 

  static cancelClaimsData () {
    if (cancelClaims !== undefined && typeof cancelClaims.cancel == 'function') {
      try{
        throw cancelClaims('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getClaimsCounter( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelClaimsCounter = c
    })
    return axios.get(`${base_new_api_url}/family/claims/${encodeURIComponent(applicationNumber)}?counter=true`,  header)
  } 

  static cancelClaimsCounter () {
    if (cancelClaimsCounter !== undefined && typeof cancelClaimsCounter.cancel == 'function') {
      try{
        throw cancelClaimsCounter('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getSpecificationData( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelSpecifications = c
    })
    return axios.get(`${base_new_api_url}/family/specifications/${encodeURIComponent(applicationNumber)}`,  header)
  }

  static cancelSpecificationData () {
    if (cancelSpecifications !== undefined && typeof cancelSpecifications.cancel == 'function') {
      try{
        throw cancelSpecifications('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getFamilyData( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelFamily = c
    })
    return axios.get(`${base_new_api_url}/family/images/${encodeURIComponent(applicationNumber)}`,  header)
  }

  static cancelFamilyData() {
    if (cancelFamily !== undefined && typeof cancelFamily.cancel == 'function') {
      try{
        throw cancelFamily('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getFiguresCounter( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelFiguresCounter = c
    })
    return axios.get(`${base_new_api_url}/family/images/${encodeURIComponent(applicationNumber)}?counter=true`,  header)
  }

  static cancelFiguresCounter() {
    if (cancelFiguresCounter !== undefined && typeof cancelFiguresCounter.cancel == 'function') {
      try{
        throw cancelFiguresCounter('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getPtabData( asset ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelPtab = c
    })
    return axios.get(`${base_new_api_url}/ptab/${asset}`,  header)
  } 
  
  static cancelPtab () {
    if (cancelPtab !== undefined && typeof cancelPtab.cancel == 'function') {
      try{
        throw cancelPtab('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getPtabCounter( asset ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelPtabCounter = c
    })
    return axios.get(`${base_new_api_url}/ptab/${encodeURIComponent(asset)}?counter=true`,  header)
  } 
  
  static cancelPtabCounter () {
    if (cancelPtabCounter !== undefined && typeof cancelPtabCounter.cancel == 'function') {
      try{
        throw cancelPtabCounter('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getCitationData( asset ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelCitationData = c
    })
    return axios.get(`${base_new_api_url}/citation/${encodeURIComponent(asset)}`,  header)
  } 
  
  static cancelCitationData () {
    if (cancelCitationData !== undefined && typeof cancelCitationData.cancel == 'function') {
      try{
        throw cancelCitationData('Operation canceled by the user.')  
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }  

  static getAllAssetsCitationData( form ) {
    let header = getFormUrlHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAllAssetsCitationData = c
    })
    return axios.post(`${base_new_api_url}/citation`,  form, header)
  }  
  
  static cancelAllAssetsCitationData () {
    if (cancelAllAssetsCitationData !== undefined && typeof cancelAllAssetsCitationData.cancel == 'function') {
      try{
        throw cancelAllAssetsCitationData('Cancelled old request.')  
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getCitationCounter( asset ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelCitationCounter = c
    })
    return axios.get(`${base_new_api_url}/citation/${encodeURIComponent(asset)}?counter=true`,  header)
  } 
  
  static cancelCitationCounter () {
    if (cancelCitationCounter !== undefined && typeof cancelCitationCounter.cancel == 'function') {
      try{
        throw cancelCitationCounter('Operation canceled by the user.')  
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getStatusData( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelStatus = c
    })
    return axios.get(`${base_new_api_url}/events/assets/status/${applicationNumber}`,  header)
  } 
  
  static cancelStatusData () {
    if (cancelStatus !== undefined && typeof cancelStatus.cancel == 'function') {
      try{
        throw cancelStatus('Operation canceled by the user.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getStatusCounter( applicationNumber ) {
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelSatusCounter = c
    })
    return axios.get(`${base_new_api_url}/events/assets/status/${applicationNumber}?counter=true`,  header)
  } 
  
  static cancelSatusCounter () {
    if (cancelSatusCounter !== undefined && typeof cancelSatusCounter.cancel == 'function') {
      try{
        throw cancelSatusCounter('Operation canceled by the user.')  
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getFamilyCounter(applicationNumber) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelFamilyCounter = c
    })
    return axios.get(`${base_new_api_url}/family/${encodeURIComponent(applicationNumber)}?counter=true`, getHeader())
  }

  static cancelFamilyCounter () {
    if (cancelFamilyCounter !== undefined && typeof cancelFamilyCounter.cancel == 'function') {
      try{
        throw cancelFamilyCounter('Operation canceled by the user.')  
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static getFeesCounter(applicationNumber, patentNumber) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelFeesCounter = c
    })
    return axios.get(`${base_new_api_url}/events/${applicationNumber}/${patentNumber != '' ? encodeURIComponent(patentNumber) : applicationNumber}?counter=true`, header)
  }

  static shareDashboard(form) { 
    return axios.post(`${base_new_api_url}/dashboards/share`,  form, getFormUrlHeader())
  }

  static cancelFeesCounter () {
    if (cancelFeesCounter !== undefined && typeof cancelFeesCounter.cancel == 'function') {
      try{
        throw cancelFeesCounter('Operation canceled by the user.')  
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }
}


export default PatenTrackApi
