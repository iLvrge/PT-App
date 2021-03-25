import { combineReducers } from 'redux'
import authReducer from './authReducer'
import patenTrackReducer from './patenTrackReducer'
import patenTrackReducer2 from './patenTrackReducer2'
import ui from './uiReducer'
import settingsReducer from './settingsReducer'
import assetsReducer from './assetsReducer'

/*import * as types from '../actions/actionTypes';
import initialState from './initialState';*/

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  patenTrack: patenTrackReducer,
  patenTrack2: patenTrackReducer2,
  ui,
  assets: assetsReducer
})

export default rootReducer

/*export default (state, action) =>
  rootReducer(action.type === types.SIGN_OUT_SUCCESS ? initialState.auth : state, action);*/

/*export default rootReducer;*/