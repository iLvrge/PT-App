import * as types from '../actions/uiTypes'
import initialState from './initialState2'
import uiInitial from './uiInitial'

const uiReducer = (state = initialState.ui, action) => {
  switch (action.type) {
    case types.SET_THEME_MODE: {
      return { 
        ...state,
        isDarkTheme: action.flag 
      }
    }
    case types.SET_TIMELINE_SCREEN: {
      return { 
        ...state,
        timelineScreen: action.flag 
      }
    }
    case types.SET_PATENT_SCREEN: {
      return { 
        ...state,
        patentScreen: action.flag 
      }
    }
    case types.SET_DASHBOARD_SCREEN: {
      return { 
        ...state,
        dashboardScreen: action.flag 
      }
    }
    case types.SET_DASHBOARD_PANEL: {
      return { 
        ...state,
        dashboardPanel: action.flag 
      }
    }
    case types.SET_SELECTED_TIMELINE_ITEM: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedItem: action.selectedItem
        }
      }
    }
    case types.SET_TIMELINE_SELECTED_ASSET: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedAsset: action.selectedAsset
        }
      }
    }
    case types.TOGGLE_USPTO_MODE: {
      return { 
        ...state,
        usptoMode: action.flag 
      }
    }

    case types.TOGGLE_LIFE_SPAN_MODE: {
      return { 
        ...state,
        lifeSpanMode: action.flag }
    }

    case types.TOGGLE_FAMILY_MODE: {
      return { 
        ...state,
        familyMode: action.flag
      }
    }

    case types.TOGGLE_FAMILY_ITEM_MODE: {
      return { 
        ...state,
        familyItemMode: action.flag
      }
    }

    case types.SET_CONTROL_MODAL: {
      return { 
        ...state,
        controlModal: action.flag
      }
    }  
    case types.SET_DRIVE_BUTTON_ACTIVE:  
      return {
        ...state,
        driveButtonActive: action.flag  
    }  
    case types.SET_MAINTAINENCE_FEE_FRAME_MODE:
      return {
        ...state,
        maintainenceFrameMode: action.flag
      }
    case types.SET_DRIVE_TEMPLATE_FRAME_MODE:
      return {
        ...state,
        driveTemplateFrameMode: action.flag
      }
    case types.SET_DRIVE_TEMPLATE_MODE:
      return {
        ...state,
        driveTemplateMode: action.flag
      }
    case types.TOGGLE_SHOW_3RD_PARTIES: {
      return {
        ...state,
        showThirdParties: action.flag,
      }
    }
    case types.SET_RESET_UI_ALL: { 
      return {
        ...state,
        ...uiInitial
      }
    }
    default:
      return state
  }
}

export default uiReducer
