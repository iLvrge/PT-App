export default {
  isDarkTheme: true,
  maintainenceFrameMode: false,
  driveTemplateFrameMode: false,
  driveTemplateMode: false,
  usptoMode: false,
  showThirdParties: true,
  lifeSpanMode: false,
  familyMode: false,
  familyItemMode: false,
  timeline: {
    selectedItem: null,
    selectedAsset: null,
  },
  patentScreen: false,
  timelineScreen: true,
  dashboardScreen: false,
  dashboardPanel: false,
  controlModal: process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' ? false : false, 
  driveButtonActive: false
}