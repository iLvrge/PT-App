import initialState from './initialState2'
import * as types from '../actions/assetsTypes'


const assetsReducer = (state = initialState.assets, action) => {
  switch (action.type) {
    case types.SET_ASSETS_ERRORS_DATA: {
      return { ...state, errors: { ...state.errors, data: action.data } }
    }

    case types.SET_IS_LOADING_ASSETS_ERRORS_DATA: {
      return { ...state, errors: { ...state.errors, isLoading: action.isLoading } }
    }

    case types.SET_SELECTED_ASSETS_ERRORS: {
      return { ...state, errors: { ...state.errors, selected: action.selected } }
    }

    case types.SET_ASSETS_RECORDS_DATA: {
      return { ...state, records: { ...state.records, data: action.data } }
    }

    case types.SET_IS_LOADING_ASSETS_RECORDS_DATA: {
      return { ...state, records: { ...state.records, isLoading: action.isLoading } }
    }
    
    case types.SET_SELECTED_ASSETS_RECORDS: {
      return { ...state, records: { ...state.records, selected: action.selected } }
    }

    case types.SET_ASSETS_COMPLETED_DATA: {
      return { ...state, completed: { ...state.completed, data: action.data } }
    }

    case types.SET_IS_LOADING_ASSETS_COMPLETED_DATA: {
      return { ...state, completed: { ...state.completed, isLoading: action.isLoading } }
    }

    case types.SET_SELECTED_ASSETS_COMPLETED: {
      return { ...state, completed: { ...state.completed, selected: action.selected } }
    }

    case types.SET_LAST_ERRORS_COUNT_TIME: {
      return { ...state, errors: { ...state.errors, countTime: action.countTime } }
    }

    case types.SET_LAST_RECORDS_COUNT_TIME: {
      return { ...state, records: { ...state.records, countTime: action.countTime } }
    }

    case types.SET_LAST_COMPLETED_COUNT_TIME: {
      return { ...state, completed: { ...state.completed, countTime: action.countTime } }
    }

    default:
      return state
  }
}

export default assetsReducer
