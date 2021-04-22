import dashboardIntial from './dashboard_initials'

export default {
  auth: {
    auth_email_sent: false,
    isLoadingReset: true,
    password_reset: false,
    redirect_page: false,
  },
  dashboard: dashboardIntial,
  settings: {
    users: { loading: true, list: [], initialized: false },
    professionals:  { loading: true, list: [], initialized: false },
    documents:  { loading: true, list: [], initialized: false },
    companyAddresses:  { loading: true, list: [], initialized: false },
    companyLawyers:  { loading: true, list: [], initialized: false },
    companyTelephones:  { loading: true, list: [], initialized: false },
    lawFirms: { loading: true, list: [], initialized: false },
    selected_law_firm: [],
    selected_companies_list: [],
    selectedPortfolio: null,
    companies_to_add_lawfirm: [] 
  },
  ui: {
    maintainenceFrameMode: false,
    driveTemplateFrameMode: false,
    usptoMode: false,
    showThirdParties: true,
    lifeSpanMode: false,
    familyMode: false,
    familyItemMode: false,
    timeline: {
      selectedItem: null,
      selectedAsset: null,
    },
    controlModal: true, 
    driveButtonActive: false
  },
  assets: {
    records: {
      isLoading: false,
      data: [],
      selected: [],
      countTime: 0,
    },
    errors: {
      isLoading: false,
      data: [],
      selected: [],
      countTime: 0,
    },
    completed: {
      isLoading: false,
      data: [],
      selected: [],
      countTime: 0,
    },
  }
}
