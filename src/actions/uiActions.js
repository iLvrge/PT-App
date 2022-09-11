import * as types from './uiTypes'


export const toggleThemeMode = flag => ({
  type: types.SET_THEME_MODE,
  flag
})

export const toggleUsptoMode = flag => ({
  type: types.TOGGLE_USPTO_MODE,
  flag
})

export const toggleLifeSpanMode = flag => ({
  type: types.TOGGLE_LIFE_SPAN_MODE,
  flag
})

export const toggleFamilyMode = flag => ({
  type: types.TOGGLE_FAMILY_MODE,
  flag
})

export const toggleFamilyItemMode = flag => ({
  type: types.TOGGLE_FAMILY_ITEM_MODE,
  flag: flag
})

export const setTimelineSelectedItem = selectedItem => ({
  type: types.SET_SELECTED_TIMELINE_ITEM,
  selectedItem
})

export const setTimelineSelectedAsset = selectedAsset => ({
  type: types.SET_TIMELINE_SELECTED_ASSET,
  selectedAsset
})

export const setControlModal = flag  => ({
  type: types.SET_CONTROL_MODAL,
  flag
}) 

export const setDriveButtonActive = (flag) => {
  return {
    type: types.SET_DRIVE_BUTTON_ACTIVE,
    flag
  }
}

export const setMaintainenceFeeFrameMode = flag  => ({
  type: types.SET_MAINTAINENCE_FEE_FRAME_MODE,
  flag   
}) 

export const setDriveTemplateFrameMode = flag  => ({
  type: types.SET_DRIVE_TEMPLATE_FRAME_MODE,
  flag   
})

export const setDriveTemplateMode = flag  => ({
  type: types.SET_DRIVE_TEMPLATE_MODE,
  flag   
})

export const toggleShow3rdParities = flag => ({
  type: types.TOGGLE_SHOW_3RD_PARTIES,
  flag,
})

export const resetUiStates = () => ({
  type: types.SET_RESET_UI_ALL
}) 

export const setTimelineScreen = flag => ({
  type: types.SET_TIMELINE_SCREEN,
  flag,
})

export const setPatentScreen = flag => ({
  type: types.SET_PATENT_SCREEN,
  flag,
})

export const setDashboardScreen = flag => ({
  type: types.SET_DASHBOARD_SCREEN,
  flag,
})  

export const setDashboardPanel = flag => ({
  type: types.SET_DASHBOARD_PANEL,
  flag,
})  

export const updateViewDashboard = views => ({
  type: types.SET_DASHBOARD_VIEW,
  views,
})  

export const setViewDashboardIntial = flag => ({
  type: types.SET_DASHBOARD_VIEW_INTIAL,
  flag,
})   

export const setAssetButton = flag => ({
  type: types.SET_ASSET_BUTTON,
  flag,
})   

export const setTransactionButton = flag => ({
  type: types.SET_TRANSACTION_BUTTON,
  flag,
})  

export const setLoadingDashboardData = flag => ({
  type: types.SET_LOADING_DASHBOARD_DATA,
  flag, 
})