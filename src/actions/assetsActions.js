import PatenTrackApi from '../api/patenTrack2'
import * as types from './assetsTypes'
import store from '../reducers/store/configureStore'
import { convertAssetTypeToTabId } from '../utils/assetTypes'

export const setAssetsRecordsData = (data) => ({
  type: types.SET_ASSETS_RECORDS_DATA,
  data,
})

export const setIsLoadingAssetsRecordsData = (isLoading) => ({
  type: types.SET_IS_LOADING_ASSETS_RECORDS_DATA,
  isLoading,
})

export const setSelectedAssetsRecords = (selected) => ({
  type: types.SET_SELECTED_ASSETS_RECORDS,
  selected,
})

export const setAssetsErrorsData = (data) => ({
  type: types.SET_ASSETS_ERRORS_DATA,
  data,
})

export const setIsLoadingAssetsErrorsData = (isLoading) => ({
  type: types.SET_IS_LOADING_ASSETS_ERRORS_DATA,
  isLoading,
})

export const setSelectedAssetsErrors = (selected) => ({
  type: types.SET_SELECTED_ASSETS_ERRORS,
  selected,
})

export const setAssetsCompletedData = (data) => ({
  type: types.SET_ASSETS_COMPLETED_DATA,
  data,
})

export const setIsLoadingAssetsCompletedData = (isLoading) => ({
  type: types.SET_IS_LOADING_ASSETS_COMPLETED_DATA,
  isLoading,
})

export const setSelectedAssetsCompleted = (selected) => ({
  type: types.SET_SELECTED_ASSETS_COMPLETED,
  selected,
})

export const setLastErrorsCountTime = (countTime) => ({
  type: types.SET_LAST_ERRORS_COUNT_TIME,
  countTime,
})

export const setLastRecordsCountTime = (countTime) => ({
  type: types.SET_LAST_RECORDS_COUNT_TIME,
  countTime,
})

export const setLastCompletedCountTime = (countTime) => ({
  type: types.SET_LAST_COMPLETED_COUNT_TIME,
  countTime,
})

export const fetchAssetsRecordsData = () => async (dispatch) => {
  dispatch(setIsLoadingAssetsRecordsData(true))
  const { data } = await PatenTrackApi.getAssetsActivitiesData('record')
  dispatch(setAssetsRecordsData(data))
  dispatch(setIsLoadingAssetsRecordsData(false))
}

export const fetchAssetsCompletedData = () => async (dispatch) => {
  dispatch(setIsLoadingAssetsCompletedData(true))
  const { data } = await PatenTrackApi.getAssetsActivitiesData('complete')
  dispatch(setAssetsCompletedData(data))
  dispatch(setIsLoadingAssetsCompletedData(false))
}

const _getErrorParamsUrl = () => {
  const { selectedAssetsTypes, selectedCompaniesList } = store.getState().patenTrack2
  const tabIds = selectedAssetsTypes.map(assetsType =>
    convertAssetTypeToTabId(assetsType),
  )
  return [
    selectedAssetsTypes.length && `tabs=[${encodeURI(tabIds)}]`,
    selectedCompaniesList.length &&
    `companies=[${encodeURI(selectedCompaniesList.map(company => company.id))}]`,
  ]
    .filter(Boolean)
    .join('&')
}

export const fetchAssetsErrorsData = () => async (dispatch) => {
  dispatch(setIsLoadingAssetsErrorsData(true))
  const paramsUrl = _getErrorParamsUrl()
  const { data } = await PatenTrackApi.getAssetsErrorsData(paramsUrl)
  dispatch(setAssetsErrorsData(data))
  dispatch(setIsLoadingAssetsErrorsData(false))
}

export const saveFixError = (currentForm, entity) => async (dispatch) => {
  let formData = new FormData(currentForm)
  const subject_type = entity.hasOwnProperty('subject_type') ? entity.subject_type : 6
  const formId = entity.hasOwnProperty('assetId') ? entity.assetId : 1
  const subject = entity.rf_id || entity.assetId || entity.id
  const ID = entity.hasOwnProperty('assetId') ? entity.id : 0
  formData.append('entity_id', ID)
  formData.append('subject', subject)
  formData.append('subject_type', subject_type)
  const { status } = await PatenTrackApi.postRecordItems(formData, formId)

  if (status === 200) {
    dispatch(setLastErrorsCountTime(new Date()))
    if(ID > 0){
      dispatch(fetchAssetsErrorsData())
    }    
  }
}

export const markAsComplete = () => async (dispatch) => {
  const { selected, data } = store.getState().assets.records  
  const recordId = selected[0]
  let formData = new FormData()
  formData.append('complete', 1)
  const { status } = await PatenTrackApi.setRecordAsCompleted(recordId, formData)

  if (status === 200) {
    const date = new Date()
    dispatch(setLastRecordsCountTime(date))
    dispatch(setLastCompletedCountTime(date))
    const updatedAssetsRecordsData = data.filter(record => record.id !== selected[0])
    dispatch(setAssetsRecordsData(updatedAssetsRecordsData))
  }
}

export const handleRevertCompletedActivity = (id) => async (dispatch) => {
  const { selected, data } = store.getState().assets.completed

  let formData = new FormData()
  formData.append('complete', 0)
  const { status } = await PatenTrackApi.setRecordAsCompleted(id, formData)

  if (status === 200) {
    const date = new Date()
    dispatch(setLastCompletedCountTime(date))
    dispatch(setLastRecordsCountTime(date))
    dispatch(setLastErrorsCountTime(date))
    const updatedAssetsCompletedData = data.filter(record => record.id !== selected[0])
    dispatch(setAssetsCompletedData(updatedAssetsCompletedData))
  }
}
