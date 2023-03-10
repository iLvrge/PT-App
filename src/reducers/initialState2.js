import dashboardIntial from './dashboard_initials'
import uiInitial from './uiInitial'
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
    companies_to_add_lawfirm: [],
    categories: [],
    products: {loading: true, list: [], initialized: false },
    selectedCategory: 0
  },
  ui: uiInitial,
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
