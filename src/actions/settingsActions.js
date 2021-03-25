import * as types from './settingsTypes'
import PatenTrackApi from '../api/patenTrack2'
import store from '../reducers/store/configureStore'

export const DATA_KEYS = {
  USERS: 'users',
  DOCUMENTS: 'documents',
  PROFESSIONALS: 'professionals',
  COMPANY_ADDRESSES: 'companyAddresses',
  COMPANY_LAWYERS: 'companyLawyers',
  COMPANY_TELEPHONES: 'companyTelephones',
  LAW_FIRMS: 'lawFirms',
}

export const setSelectedPortfolio = data => {
  return {
    type: types.SET_SELECTED_PORTFOLIO,
    data,
  }
}

export const resetData = key => ({
  type: types.RESET_DATA,
  key,
})

export const setUsers = (data) => ({
  type: types.SET_USERS_LIST,
  data,
})

export const setLawyers = (data) => ({
  type: types.SET_LAWYERS_LIST,
  data,
})

export const setDocuments = (data) => ({
  type: types.SET_DOCUMENTS_LIST,
  data,
})

export const setCompanyAddressList = (data) => ({
  type: types.SET_COMPANY_ADDRESS_LIST,
  data,
})

export const setCompanyLawyerList = (data) => ({
  type: types.SET_COMPANY_LAWYER_LIST,
  data,
})

const setLawFirms = (data) => ({
  type: types.SET_LAW_FIRMS,
  data,
})

const _createFormData = (user) => {
  const formData = new FormData()

  Object.entries(user).forEach(key => {
    formData.append(key[0], key[1])
  })

  return formData
}

export const fetchUsers = () => async dispatch => {
  dispatch(resetData(DATA_KEYS.USERS))
  const { data } = await PatenTrackApi.getUsers()
  dispatch(setUsers(data))
}

export const addUser = (user) => async dispatch => {
  const userFormData = _createFormData(user) 
  const { data } = await PatenTrackApi.addUser(userFormData)
  const { list } = store.getState().settings.users
  const updatedUserList = [ ...list, data ]
  dispatch(setUsers(updatedUserList))
} 

export const updateUser = (user) => async dispatch => {
  const userFormData = _createFormData(user)
  await PatenTrackApi.updateUser(userFormData, user.user_id)
  const { list } = store.getState().settings.users
  const updatedUserList = list.map((userItem) => userItem.user_id === user.user_id ? user : userItem)
  dispatch(setUsers(updatedUserList))
}

export const deleteUser = (id) => async dispatch => {
  await PatenTrackApi.deleteUser(id)
  const { list } = store.getState().settings.users
  const updatedUserList = list.filter((userItem) => userItem.user_id !== id)
  dispatch(setUsers(updatedUserList))
}

export const fetchProfessionals = () => async dispatch => {
  dispatch(resetData(DATA_KEYS.PROFESSIONALS))
  const { data } = await PatenTrackApi.getLawyers()
  dispatch(setLawyers(data))
}

export const addProfessional = (lawyer) => async dispatch => {
  const lawyerFormData = _createFormData(lawyer)
  let { data } = await PatenTrackApi.addLawyer(lawyerFormData)
  data = { ...data, firm_id: +data.firm_id }
  const { list } = store.getState().settings.professionals
  const updatedLawyerList = [ ...list, data ]
  dispatch(setLawyers(updatedLawyerList))
}

export const updateProfessional = (lawyer) => async (dispatch) => {
  const lawyerFormData = _createFormData(lawyer)
  await PatenTrackApi.updateLawyer(lawyerFormData, lawyer.professional_id)
  const { list } = store.getState().settings.professionals
  const updatedLawyerList = list.map(item => item.professional_id === lawyer.professional_id ? lawyer : item)
  dispatch(setLawyers(updatedLawyerList))
}

export const deleteProfessional = (id) => async dispatch => {
  await PatenTrackApi.deleteLawyer(id)
  const { list } = store.getState().settings.professionals
  const updatedLawyerList = list.filter((lawyer) => lawyer.professional_id !== id)
  dispatch(setLawyers(updatedLawyerList))
}

export const fetchDocuments = () => async dispatch => {
  dispatch(resetData(DATA_KEYS.DOCUMENTS))
  const { data } = await PatenTrackApi.getDocuments()
  dispatch(setDocuments(data))
}

export const addDocument = (doc) => async dispatch => {
  const documentFormData = _createFormData(doc)
  const { data } = await PatenTrackApi.addDocument(documentFormData)
  const { list } = store.getState().settings.documents
  const updatedDocumentList = [ ...list, { ...data, name: data.title } ]
  dispatch(setDocuments(updatedDocumentList))
}

export const updateDocument = (doc) => async dispatch => {
  const documentFormData = _createFormData(doc)
  await PatenTrackApi.updateDocument(documentFormData, doc.document_id)
  const { list } = store.getState().settings.documents
  const updatedDocumentList = list.map(item => item.document_id === doc.document_id ? doc : item)
  dispatch(setDocuments(updatedDocumentList))
}

export const deleteDocument = (id) => async dispatch => {
  await PatenTrackApi.deleteDocument(id)
  const { list } = store.getState().settings.documents
  const updatedDocumentList = list.filter((document) => document.document_id !== id)
  dispatch(setDocuments(updatedDocumentList))
}

export const fetchAddresses = () => async (dispatch) => {
  dispatch(resetData(DATA_KEYS.COMPANY_ADDRESSES))
  const { data } = await PatenTrackApi.getAddresses()
  dispatch(setCompanyAddressList(data))
}

export const fetchCompanyLawyers = () => async (dispatch) => {
  dispatch(resetData(DATA_KEYS.COMPANY_LAWYERS))
  const { data } = await PatenTrackApi.getCompanyLawyers()
  dispatch(setCompanyLawyerList(data))
}

export const addCompanyAddress = (address) => async dispatch => {
  const addressFormData = _createFormData(address)
  const { data } = await PatenTrackApi.addCompanyAddress(addressFormData)
  const { list } = store.getState().settings.companyAddresses
  const { representative_id, ...newAddress } = data

  const updatedAddressList = list.map((item) => (
    item.representative_id.toString() === representative_id.toString() ? {
      ...item,
      address: [ ...item.address, newAddress ],
    } : item
  ))

  dispatch(setCompanyAddressList(updatedAddressList))
}

export const updateCompanyAddress = ({ address_id, ...address }) => async dispatch => {
  const addressFormData = _createFormData(address)
  const { data } = await PatenTrackApi.updateCompanyAddress(address_id, addressFormData)
  const { list } = store.getState().settings.companyAddresses
  const { representative_id, ...newAddress } = data

  const updatedAddressList = list.map((item) => (
    item.representative_id.toString() === representative_id.toString() ? {
      ...item,
      address: item.address.map((oldAddress) => oldAddress.address_id === address_id ? newAddress : oldAddress),
    } : item
  ))

  dispatch(setCompanyAddressList(updatedAddressList))
}

export const deleteCompanyAddress = ({ representative_id, ...address }) => async dispatch => {
  await PatenTrackApi.deleteCompanyAddress(address.address_id)
  const { list } = store.getState().settings.companyAddresses

  const updatedAddressList = list.map((item) => (
    item.representative_id === representative_id ? (
      { ...item, address: item.address.filter(({ address_id }) => address_id !== address.address_id) }
    ) : item
  ))

  dispatch(setCompanyAddressList(updatedAddressList))
}

export const addCompanyLawfirm = (formData) => async dispatch => {
  formData.lawfirms = JSON.stringify(store.getState().settings.selected_law_firm)
  formData.companies = JSON.stringify(store.getState().settings.companies_to_add_lawfirm)
  const companyLawFirmFormData = _createFormData(formData)
  console.log("addCompanyLawfirm", formData);
  const { data } = await PatenTrackApi.addCompanyLawfirm(companyLawFirmFormData)
  console.log(data);
  
  dispatch(fetchCompanyLawyers())
  /*formData.lawfirms = JSON.stringify(store.getState().settings.selected_law_firm)
  const companyLawFirmFormData = _createFormData(formData)

  const { data } = await PatenTrackApi.addCompanyLawfirm(companyLawFirmFormData)*/
/*

  const userFormData = _createFormData(user)
  const { data } = await PatenTrackApi.addUser(userFormData)
  const { list } = store.getState().settings.users
  const updatedUserList = [ ...list, data ]
  dispatch(setUsers(updatedUserList))*/
} 

export const selectedLawFirmList = (lawFirmID) => {
  return {
    type: types.SET_SELECTED_LAW_FIRM_ID,
    lawFirmID
  } 
}

export const selectedCompaniesList = (companyID) => {
  return {
    type: types.SET_SELECTED_COMPANY_LIST_ID,
    companyID
  } 
}


export const addCompanyLawyer = (lawyer) => async dispatch => {
  const lawyerFormData = _createFormData(lawyer)
  const { data } = await PatenTrackApi.addCompanyLawyer(lawyerFormData)
  const { list } = store.getState().settings.companyLawyers

  const { representative_id, ...newCompanyLawyer } = data

  const updatedCompanyLawyerList = list.map((item) => (
    item.representative_id.toString() === representative_id.toString() ? {
      ...item,
      lawyer: [ ...item.lawyer, newCompanyLawyer ],
    } : item
  ))

  dispatch(setCompanyLawyerList(updatedCompanyLawyerList))
}

export const deleteCompanyLawyer = (companyLawyerId) => async dispatch => {
  await PatenTrackApi.deleteCompanyLawyer(companyLawyerId)
  const { list } = store.getState().settings.companyLawyers

  const updatedCompanyLawyerList = list.map((item) => {
    return (
      item.lawyer.some(({ lawyer_id }) => lawyer_id === companyLawyerId)
    ) ? (
      { ...item, lawyer: item.lawyer.filter(({ lawyer_id }) => lawyer_id !== companyLawyerId) }
    ) : item
  })

  dispatch(setCompanyLawyerList(updatedCompanyLawyerList))
}

export const fetchLawFirms = () => async (dispatch) => {
  dispatch(resetData(DATA_KEYS.LAW_FIRMS))
  const { data } = await PatenTrackApi.getLawFirms()
  dispatch(setLawFirms(data))
}

export const addLawFirms = (lawFirm) => async (dispatch) => {
  const lawfirmFormData = _createFormData(lawFirm)
  const { data } = await PatenTrackApi.addLawFirm(lawfirmFormData)
  const { list } = store.getState().settings.lawFirms
  const updatedLawFirmList = [ ...list, data ]
  dispatch(setLawFirms(updatedLawFirmList))
}

export const addLawFirmAddress = (address) => async (dispatch) => {
  const addressFormData = _createFormData(address)
  let { data } = await PatenTrackApi.addLawFirmAddress(addressFormData)
  data = { ...data, lawfirm_id: +data.lawfirm_id }
  const { list } = store.getState().settings.lawFirms
  const updatedLawFirmList = list.map((lawfirm) => {
    if (lawfirm.lawfirm_id === data.lawfirm_id) {
      return { ...lawfirm, lawfirm_address: [ ...lawfirm.lawfirm_address, data ] }
    }
    return lawfirm
  })
  dispatch(setLawFirms(updatedLawFirmList))
}

export const updateLawFirmAddress = ({ address_id, ...changes }) => async (dispatch) => {
  const addressFormData = _createFormData(changes)
  let { data } = await PatenTrackApi.updateLawFirmAddress(address_id, addressFormData)
  data = { ...data, lawfirm_id: +data.lawfirm_id }
  const { list } = store.getState().settings.lawFirms
  const updatedLawFirmList = list.map((lawfirm) => (
    lawfirm.lawfirm_id === data.lawfirm_id ? ({
      ...lawfirm,
      lawfirm_address: lawfirm.lawfirm_address.map((address) => (address.address_id === address_id ? data : address)),
    }) : lawfirm
  ))

  dispatch(setLawFirms(updatedLawFirmList))
}

export const deleteLawFirmAddress = (address) => async (dispatch) => {
  await PatenTrackApi.deleteLawFirmAddress(address.address_id)
  const { list } = store.getState().settings.lawFirms

  const updatedLawFirmList = list.map((lawfirm) => (
    lawfirm.lawfirm_id === address.lawfirm_id ? ({
      ...lawfirm,
      lawfirm_address: lawfirm.lawfirm_address.filter(({ address_id }) => address_id !== address.address_id),
    }) : lawfirm
  ))

  dispatch(setLawFirms(updatedLawFirmList))
}


export const setCompaniesToAddLawfirms = (ID) => {
  return {
    type: types.SET_COMPANY_TO_ADD_LAW_FIRM,
    ID
  }
}