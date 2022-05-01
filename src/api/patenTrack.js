import axios from 'axios'
import { base_api_url, base_new_api_url } from '../config/config'

const getCookie = (name)=> {
    var nameEQ = name + '='
    var ca = document.cookie.split(';')
    for(var i=0;i < ca.length;i++) {
        var c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1,c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length)
    }
    return null
}

const getHeader = () => {
  let token = null
  if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'  || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD') {
    token = localStorage.getItem('auth_signature')
  } else {
    token = localStorage.getItem('token')
    if (token === null) {
      token = getCookie('token')
    }
  }
  
  return {
    headers: {
      'x-auth-token': token
    }
  }    
}

const getMultiFormUrlHeader = () => {
  let token = null
  if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'  || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD') {
    token = localStorage.getItem('auth_signature')
  } else {
    token = localStorage.getItem('token')
    if (token === null) {
      token = getCookie('token')
    }
  }
  return {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'multipart/form-data'
    }
  } 
}

const getFormUrlHeader = () => {
  let token = null
  if( process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'  || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD') {
    token = localStorage.getItem('auth_signature')
  } else {
    token = localStorage.getItem('token')
    if (token === null) {
      token = getCookie('token')
    }
  }
  return {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  } 
}

var CancelToken = axios.CancelToken

var cancel

class PatenTrackApi {

  static getProfile() {
    return axios.get(`${base_new_api_url}/profile`, getHeader()) 
  }

  static assetFamily(applicationNumber) { 
    return axios.get(`${base_new_api_url}/family/${applicationNumber}`, getHeader())
  } 

  static assetFamilySingle(applicationNumber) { 
    return axios.get(`${base_new_api_url}/family/single/${applicationNumber}`, getHeader())
  } 

  static assetLegalEvents(applicationNumber, patentNumber) { 
    console.log("assetLegalEvents", applicationNumber, patentNumber)
    return axios.get(`${base_new_api_url}/events/${applicationNumber}/${patentNumber != '' ? encodeURIComponent(patentNumber)  : applicationNumber}`, getHeader())
  }

  static getValidateCounter(companyName) { 
    return axios.get(`${base_new_api_url}/validity_counter/${companyName}`, getHeader())
  } 

  static getCustomers(type) {
    return axios.get(`${base_new_api_url}/customers/${type}`, getHeader())
  }

  static getCustomersParties(parentCompany, tabId) {
    return axios.get(`${base_new_api_url}/customers/${parentCompany}/parties/${tabId}`, getHeader())
  }

  static getCustomersNameCollections(name, parentCompany, tabId) {
    return axios.get(`${base_new_api_url}/customers/${parentCompany}/${name}/collections/${tabId}`, getHeader())
  } 

  static getCustomerRFIDAssets(rfID) {
    return axios.get(`${base_new_api_url}/customers/${rfID}/assets`, getHeader())
  } 

  static getAssetsCount(companyName) {
    return axios.get(`${base_new_api_url}/updates/${companyName}`, getHeader())
  }

  static getTransactions(companyName) {
    return axios.get(`${base_new_api_url}/transactions/${companyName}`, getHeader())
  }

  static getRecordItems(type, option) {
    return axios.get(`${base_new_api_url}/activities/${type}/${option}`, getHeader())
  }

  static getErrorItems(type, companyName, queryString) {
    let URL = `${base_new_api_url}/errors/${type}/${companyName}`
    if(typeof queryString !== 'undefined') { 
      URL += '?'+queryString
    }
    return axios.get(URL, getHeader())
  }

  static getLawyers() {
    return axios.get(`${base_new_api_url}/professionals`, getHeader())
  }
 
  static getDocuments() {
    return axios.get(`${base_new_api_url}/documents`, getHeader())
  }

  static getCompanies() {
    return axios.get(`${base_new_api_url}/companies`, getHeader())
  }

  static deleteCompany( companiesList ) {
    return axios.delete(`${base_new_api_url}/companies?companies=[${encodeURI(companiesList)}]`, getHeader())
  }

  static getSubCompanies( name ) {
    return axios.get(`${base_api_url}/companies/subcompanies/${name}`, getHeader())
  }

  static deleteSameCompany( companiesList ) {
    return axios.delete(`${base_new_api_url}/companies/subcompanies?companies=[${encodeURI(companiesList)}]`, getHeader())
  }

  static getUsers() {
    return axios.get(`${base_new_api_url}/users`, getHeader())
  }

  static getCharts(option) {
    return axios.get(`${base_api_url}/charts/${option}`, getHeader())
  }

  static getChartsOne(option) {
    return axios.get(`${base_new_api_url}/charts/${option}`, getHeader())
  }

  static getTimeLine(tabId) {
    return axios.get(`${base_new_api_url}/timeline/${parseInt(tabId)}`, getHeader())
  }

  static getFilterTimeLine(parent, label, depth, tabId) {
    return axios.get(`${base_new_api_url}/timeline/${parent}/${label}/${depth}/${tabId}`, getHeader())
  }

  static getTimelineFilterWithDate(groupId, startDate, endDate, scroll) {
    if (cancel !== undefined) {
      cancel()
    }
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c
    })
    return axios.get(`${base_new_api_url}/timeline/filter/search/${groupId}/${startDate}/${endDate}/${scroll}`, header)   
  } 
 
  static getMessages(type) {
    return axios.get(`${base_api_url}/messages/${type}`, getHeader())
  }

  static getAlerts(type) {
    return axios.get(`${base_api_url}/alerts/${type}`, getHeader())
  }

  static getComments(type, value) {
    return axios.get(`${base_new_api_url}/activities/comments/${type}/${value}`, getHeader())
  }

  static getAssetsByPatentNumber(patentNumber) {
    return axios.get(`${base_new_api_url}/assets/${patentNumber}`, getHeader())
  }

  static getCollectionIllustration(rfID) {
    return axios.get(`${base_new_api_url}/collections/${rfID}/illustration`, getHeader())
  }

  static geteAssetsOutsourceByPatentNumber(type, patentNumber) {
    return axios.get(`${base_new_api_url}/assets/${patentNumber}/${type}/outsource`, getHeader())
  }

  static getSiteLogo() {
    return axios.get(`${base_api_url}/site_logo`, getHeader())
  }

  static findRecord(ID) {
    return axios.get(`${base_new_api_url}/activities/${ID}`, getHeader())
  }

  static postRecordItems( data, type ) {
    return axios.post(`${base_new_api_url}/activities/${type}`, data, getMultiFormUrlHeader())
  }

  static completeRecord( data, ID ) {
    return axios.put(`${base_new_api_url}/activities/${ID}`, data, getMultiFormUrlHeader())
  }

  static updateComment( method, data, type, value ) {
    if(method === 'PUT') {
      return axios.put(`${base_api_url}/comments/${type}/${value}`, data, getFormUrlHeader())
    } else {
      return axios.post(`${base_api_url}/comments/${type}/${value}`, data, getFormUrlHeader())
    }    
  }

  static updateUser( user, ID ) {
    return axios.put(`${base_new_api_url}/users/${ID}`, user, getFormUrlHeader())   
  }

  static addUser( user ) {
    return axios.post(`${base_new_api_url}/users`, user, getFormUrlHeader())   
  }

  static deleteUser( ID ) {
    return axios.delete(`${base_new_api_url}/users/${ID}`, getFormUrlHeader())   
  }

  static addLawyer( user ) {
    return axios.post(`${base_new_api_url}/professionals`, user, getFormUrlHeader())   
  }

  static updateLawyer( user, ID ) {
    return axios.put(`${base_new_api_url}/professionals/${ID}`, user, getFormUrlHeader())   
  }

  static deleteLawyer( ID ) {
    return axios.delete(`${base_new_api_url}/professionals/${ID}`, getFormUrlHeader())   
  }

  static addDocument( document ) {
    return axios.post(`${base_new_api_url}/documents`, document, getMultiFormUrlHeader())   
  }

  static updateDocument( user, ID ) {
    return axios.put(`${base_new_api_url}/documents/${ID}`, user, getMultiFormUrlHeader())   
  }

  static deleteDocument( ID ) {
    return axios.delete(`${base_new_api_url}/documents/${ID}`, getFormUrlHeader())   
  }

  static addCompanyLawyer( lawyer, companyID ) {
    return axios.post(`${base_new_api_url}/customers/${companyID}/companylawyer`, lawyer, getFormUrlHeader())   
  }

  static addTelephone( telephone, companyID ) {
    return axios.post(`${base_new_api_url}/customers/${companyID}/telephone`, telephone, getFormUrlHeader())   
  }
  
  static addAddress( address, companyID ) {
    return axios.post(`${base_new_api_url}/customers/${companyID}/address`, address, getFormUrlHeader())   
  }

  static getAddresses(companyID) {
    return axios.get(`${base_new_api_url}/customers/${companyID}/address`, getHeader())
  }

  static getTelephones(companyID) {
    return axios.get(`${base_new_api_url}/customers/${companyID}/telephone`, getHeader())
  }

  static getCompanyLawyers(companyID) { 
    return axios.get(`${base_new_api_url}/customers/${companyID}/companylawyer`, getHeader())
  }
    
  static searchCompany( name ) {
    if (cancel !== undefined) {
      cancel()
    }
    let header = getHeader()
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c
    })
    return axios.get(`${base_new_api_url}/companies/search/${encodeURIComponent(name)}`, header)   
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
    return axios.post(`${base_new_api_url}/companies`, data, getMultiFormUrlHeader())
  }

  static shareIllustration( data ) {
    return axios.post(`${base_new_api_url}/share`, data, getFormUrlHeader())
  } 
}

export default PatenTrackApi