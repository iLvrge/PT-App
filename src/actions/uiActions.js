import * as types from './uiTypes'

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