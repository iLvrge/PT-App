import axios from 'axios'
import { base_api_url, base_new_api_url } from '../config/config'
import api, { createCancelToken } from './axiosSetup';
import getToken from './token'
 
const getHeader = () => {
  return {
    headers: {
      'x-auth-token': getToken()
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

var cancel, cancelAssetLegalEvents, cancelAssetFamily, cancelAssetFamilySingle;

class PatenTrackApi {

  static getProfile() {
    return api.get(`${base_new_api_url}/profile`, getHeader()) 
  }

  static assetFamily(applicationNumber, flag) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAssetFamily = c
    })
    return api.get(`${base_new_api_url}/family/${applicationNumber}?f=${flag}`, header)
  } 

  static cancelAssetFamilyRequest() {
    if (cancelAssetFamily !== undefined) {
      try{
        throw cancelAssetFamily('Request cancelled for families.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static assetFamilySingle(applicationNumber, flag) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAssetFamilySingle = c
    })
    return api.get(`${base_new_api_url}/family/single/${applicationNumber}?f=${flag}`, header)
  } 

  static cancelAssetFamilySingleRequest() { 
    if (cancelAssetFamilySingle !== undefined) {
      try{
        throw cancelAssetFamilySingle('Request cancelled for family.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static assetLegalEvents(applicationNumber, patentNumber) { 
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelAssetLegalEvents = c
    })
    return api.get(`${base_new_api_url}/events/${applicationNumber}/${patentNumber != '' ? encodeURIComponent(patentNumber)  : applicationNumber}`, header)
  }

  static cancelAssetLegalEventsRequest() {
    if (cancelAssetLegalEvents !== undefined) {
      try{
        throw cancelAssetLegalEvents('Request cancelled for legal events.')
      } catch (e){
        console.log('cancelRequest->', e)
      }
    } 
  }

  static allAssetsSurchargeLegalEvents(companies) { 
    return api.get(`${base_new_api_url}/events/all/assets/surcharge?companies=${JSON.stringify(companies)}`, getHeader())
  } 

  static getValidateCounter(companyName) { 
    return api.get(`${base_new_api_url}/validity_counter/${companyName}`, getHeader())
  } 

  static getCustomers(type) {
    return api.get(`${base_new_api_url}/customers/${type}`, getHeader())
  }

  static getCustomersParties(parentCompany, tabId) {
    return api.get(`${base_new_api_url}/customers/${parentCompany}/parties/${tabId}`, getHeader())
  }

  static getCustomersNameCollections(name, parentCompany, tabId) {
    return api.get(`${base_new_api_url}/customers/${parentCompany}/${name}/collections/${tabId}`, getHeader())
  } 

  static getCustomerRFIDAssets(rfID) {
    return api.get(`${base_new_api_url}/customers/${rfID}/assets`, getHeader())
  } 

  static getAssetsCount(companyName) {
    return api.get(`${base_new_api_url}/updates/${companyName}`, getHeader())
  }

  static getTransactions(companyName) {
    return api.get(`${base_new_api_url}/transactions/${companyName}`, getHeader())
  }

  static getRecordItems(type, option) {
    return api.get(`${base_new_api_url}/activities/${type}/${option}`, getHeader())
  }

  static getErrorItems(type, companyName, queryString) {
    let URL = `${base_new_api_url}/errors/${type}/${companyName}`
    if(typeof queryString !== 'undefined') { 
      URL += '?'+queryString
    }
    return api.get(URL, getHeader())
  }

  static getLawyers() {
    return api.get(`${base_new_api_url}/professionals`, getHeader())
  }
 
  static getDocuments() {
    return api.get(`${base_new_api_url}/documents`, getHeader())
  }

  static getCompanies() {
    return api.get(`${base_new_api_url}/companies`, getHeader())
  }

  static deleteCompany( companiesList, type ) { 
    return api.delete(`${base_new_api_url}/companies?companies=[${encodeURI(companiesList)}]&type=${type}`, getHeader())
  }

  static getSubCompanies( name ) {
    return api.get(`${base_new_api_url}/companies/subcompanies/${name}`, getHeader())
  }

  static deleteSameCompany( companiesList ) {
    return api.delete(`${base_new_api_url}/companies/subcompanies?companies=[${encodeURI(companiesList)}]`, getHeader())
  }

  static getUsers() {
    return api.get(`${base_new_api_url}/users`, getHeader())
  }

  static getCharts(option) {
    return api.get(`${base_api_url}/charts/${option}`, getHeader())
  }

  static getChartsOne(option) {
    return api.get(`${base_new_api_url}/charts/${option}`, getHeader())
  }

  static getTimeLine(tabId) {
    return api.get(`${base_new_api_url}/timeline/${parseInt(tabId)}`, getHeader())
  }

  static getFilterTimeLine(parent, label, depth, tabId) {
    return api.get(`${base_new_api_url}/timeline/${parent}/${label}/${depth}/${tabId}`, getHeader())
  }

  static getTimelineFilterWithDate(groupId, startDate, endDate, scroll) {
    if (cancel !== undefined) {
      cancel()
    }
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c
    })
    return api.get(`${base_new_api_url}/timeline/filter/search/${groupId}/${startDate}/${endDate}/${scroll}`, header)   
  } 
 
  static getMessages(type) {
    return api.get(`${base_api_url}/messages/${type}`, getHeader())
  }

  static getAlerts(type) {
    return api.get(`${base_api_url}/alerts/${type}`, getHeader())
  }

  static getComments(type, value) {
    return api.get(`${base_new_api_url}/activities/comments/${type}/${value}`, getHeader())
  }

  static getAssetsByPatentNumber(patentNumber) {
    return api.get(`${base_new_api_url}/assets/${patentNumber}`, getHeader())
  }

  static getCollectionIllustration(rfID) {
    return api.get(`${base_new_api_url}/collections/${rfID}/illustration`, getHeader())
  }

  static geteAssetsOutsourceByPatentNumber(type, patentNumber) {
    return api.get(`${base_new_api_url}/assets/${patentNumber}/${type}/outsource`, getHeader())
  }

  static getSiteLogo() {
    return api.get(`${base_api_url}/site_logo`, getHeader())
  }

  static findRecord(ID) {
    return api.get(`${base_new_api_url}/activities/${ID}`, getHeader())
  }

  static postRecordItems( data, type ) {
    return api.post(`${base_new_api_url}/activities/${type}`, data, getMultiFormUrlHeader())
  }

  static completeRecord( data, ID ) {
    return api.put(`${base_new_api_url}/activities/${ID}`, data, getMultiFormUrlHeader())
  }

  static updateComment( method, data, type, value ) {
    if(method === 'PUT') {
      return api.put(`${base_api_url}/comments/${type}/${value}`, data, getFormUrlHeader())
    } else {
      return api.post(`${base_api_url}/comments/${type}/${value}`, data, getFormUrlHeader())
    }    
  }

  static updateUser( user, ID ) {
    return api.put(`${base_new_api_url}/users/${ID}`, user, getFormUrlHeader())   
  }

  static addUser( user ) {
    return api.post(`${base_new_api_url}/users`, user, getFormUrlHeader())   
  }

  static deleteUser( ID ) {
    return api.delete(`${base_new_api_url}/users/${ID}`, getFormUrlHeader())   
  }

  static addLawyer( user ) {
    return api.post(`${base_new_api_url}/professionals`, user, getFormUrlHeader())   
  }

  static updateLawyer( user, ID ) {
    return api.put(`${base_new_api_url}/professionals/${ID}`, user, getFormUrlHeader())   
  }

  static deleteLawyer( ID ) {
    return api.delete(`${base_new_api_url}/professionals/${ID}`, getFormUrlHeader())   
  }

  static addDocument( document ) {
    return api.post(`${base_new_api_url}/documents`, document, getMultiFormUrlHeader())   
  }

  static updateDocument( user, ID ) {
    return api.put(`${base_new_api_url}/documents/${ID}`, user, getMultiFormUrlHeader())   
  }

  static deleteDocument( ID ) {
    return api.delete(`${base_new_api_url}/documents/${ID}`, getFormUrlHeader())   
  }

  static addCompanyLawyer( lawyer, companyID ) {
    return api.post(`${base_new_api_url}/customers/${companyID}/companylawyer`, lawyer, getFormUrlHeader())   
  }

  static addTelephone( telephone, companyID ) {
    return api.post(`${base_new_api_url}/customers/${companyID}/telephone`, telephone, getFormUrlHeader())   
  }
  
  static addAddress( address, companyID ) {
    return api.post(`${base_new_api_url}/customers/${companyID}/address`, address, getFormUrlHeader())   
  }

  static getAddresses(companyID) {
    return api.get(`${base_new_api_url}/customers/${companyID}/address`, getHeader())
  }

  static getTelephones(companyID) {
    return api.get(`${base_new_api_url}/customers/${companyID}/telephone`, getHeader())
  }

  static getCompanyLawyers(companyID) { 
    return api.get(`${base_new_api_url}/customers/${companyID}/companylawyer`, getHeader())
  }
    
  static searchCompany( name ) {
    if (cancel !== undefined) {
      cancel()
    }
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c
    })
    return api.get(`${base_new_api_url}/companies/search/${encodeURIComponent(name)}`, header)   
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

  static addCompany( data) {
    return api.post(`${base_new_api_url}/companies`, data, getMultiFormUrlHeader())
  }

  static shareIllustration( data ) {
    return api.post(`${base_new_api_url}/share`, data, getFormUrlHeader())
  } 
}

export default PatenTrackApi