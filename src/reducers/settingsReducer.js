import * as types from '../actions/settingsTypes'
import initialState from './initialState2'

const settingsReducer = (state = initialState.settings, action) => {
  switch (action.type) {
    case types.RESET_DATA:
      return {
        ...state,
        [action.key]: { ...state[action.key], loading: true, list: [] }
      }
    case types.SET_USERS_LIST:
      return {
        ...state,
        users: { loading: false, list: [ ...action.data ], initialized: true },
      }
    case types.SET_LAWYERS_LIST:
      return {
        ...state,
        professionals: { loading: false, list: [ ...action.data ], initialized: true },
      }

    case types.SET_DOCUMENTS_LIST:
      return {
        ...state,
        documents: { loading: false, list: [ ...action.data ], initialized: true },
      }

    case types.SET_COMPANY_ADDRESS_LIST:
      return {
        ...state,
        companyAddresses: { loading: false, list: [ ...action.data ], initialized: true },
      }

    case types.SET_COMPANY_LAWYER_LIST:
      return {
        ...state,
        companyLawyers: { loading: false, list: [ ...action.data ], initialized: true },
      }

    case types.SET_COMPANY_TELEPHONE_LIST:
      return {
        ...state,
        companyTelephones: { loading: false, list: [ ...action.data ], initialized: true },
      }

    case types.SET_LAW_FIRMS:
      return {
        ...state,
        lawFirms: { loading: false, list: [ ...action.data ], initialized: true },
      }
    case types.SET_SELECTED_PORTFOLIO:
      return {
        ...state,
        selectedPortfolio: action.data,
      }
    case types.SET_SELECTED_LAW_FIRM_ID:{
      return {
        ...state,
        selected_law_firm: action.lawFirmID
      }
    }  
    case types.SET_SELECTED_COMPANY_LIST_ID:{
      return {
        ...state,
        selected_companies_list: action.companyID
      }
    }  
    case types.SET_COMPANY_TO_ADD_LAW_FIRM:
      let selected = [...state.companies_to_add_lawfirm];  
      if(selected.includes(action.ID)){
        selected = selected.filter(_id => _id !== action.ID)
      } else {
        selected.push(action.ID)
      }
      return {
        ...state,
        companies_to_add_lawfirm: selected,
      }
    default:
      return state
  }
}

export default settingsReducer