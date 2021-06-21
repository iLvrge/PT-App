import * as types from '../actions/actionTypes2'
import initialState from './initialState2'

import dashboardIntial from './dashboard_initials'


const arrayToObjectByKey = (array, key) =>
  array.reduce((result, item) => {
    result[item[key]] = item
    return result
  }, {})

const patenTrackReducer = (state = initialState.dashboard, action) => {
  switch (action.type) {
    case types.SET_COMPANY_LIST_LOADING:
      return {
        ...state,
        companyListLoading: action.payload,
      }
    case types.SET_COMPANIES_LIST:
      return {
        ...state,
        companiesList: [ ...action.data ],
        selectedCompaniesList: [ ...action.data ],
      }
    case types.SET_SELECTED_COMPANIES_LIST:
      return {
        ...state,
        selectedCompaniesList: action.data,
      }

    case types.SET_SELECTED_ASSETS_TYPES:
      return {
        ...state,
        selectedAssetsTypes: action.data,
      }

    case types.SET_ASSETS_CUSTOMERS:
      
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.assetType]: action.append 
            ?  { ...state.assets[action.assetType],  ...arrayToObjectByKey(action.data, 'customer_id') } 
            : arrayToObjectByKey(action.data, 'customer_id'),
        },
      }
    case types.SET_ASSETS_CUSTOMERS_LOADING:
      return {
        ...state,
        assetsCustomersLoading: action.payload,
      }
    case types.SET_ASSETS_CUSTOMERS_LOADING_MORE: 
      return {
        ...state,
        assetsCustomersLoadingMore: action.payload,
      }
    case types.SET_SELECTED_ASSETS_CUSTOMERS:
      return {
        ...state,
        selectedAssetsCustomers: action.data,
      }

    case types.LOADING_ASSETS_RECORDS_COUNT:
      return {
        ...state,
        isLoadingAssetsRecordsDataCount: action.data,
      }
    case types.LOADING_COMPLETED_ASSETS_RECORDS:
      return {
        ...state,
        isLoadingCompActivitiesDataCount: action.data,
      }
    case types.SET_ASSETS_RECORDS_COUNT:
      return {
        ...state,
        assetsRecordsDataCount: action.data,
      }
    case types.SET_COMPLETED_ASSETS_RECORDS:
      return {
        ...state,
        assetsCompActivitiesDataCount: action.data,
      }
    case types.LOADING_ERRORS_ASSETS_RECORDS:
      return {
        ...state,
        isLoadingAssetsErrorsDataCount: action.data,
      }
    case types.SET_ERRORS_ASSETS_RECORDS_COUNT:
      return {
        ...state,
        assetsErrorsDataCount: action.data,
      }

    case types.SET_ASSETS_TRANSACTIONS_LOADING:
      return {
        ...state,
        assetsTransactionsLoading: action.payload,
      }
    case types.SET_ASSETS_TRANSACTIONS:
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.assetType]: {
            ...state.assets[action.assetType],
            [action.customerId]: {
              ...state.assets[action.assetType][action.customerId],
              transactions: action.data.length === 0 ? [] : {
                ...state.assets[action.assetType][action.customerId].transactions,
                ...arrayToObjectByKey(action.data, 'id')
              },
            },
          },
        },
      } 
    case types.SET_ASSETS_TRANSACTIONS_LIFE_SPAN:
      return {
        ...state,
        transaction_life_span: action.data
      }
    case types.SET_SELECTED_ASSETS_TRANSACTIONS:
      return {
        ...state,
        selectedAssetsTransactions: action.data,
      }
    case types.SET_CHILD_SELECTED_ASSETS_TRANSACTIONS:
      return {
        ...state,
        selectedChildAssetsTransactions: action.data,
      }
    case types.SET_ASSETS_PATENTS_LOADING:
      return {
        ...state,
        assetsPatentsLoading: action.payload,
      }
    case types.SET_ASSETS_PATENTS:
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.assetType]: {
            ...state.assets[action.assetType],
            [action.customerId]: {
              ...state.assets[action.assetType][action.customerId],
              transactions: {
                ...state.assets[action.assetType][action.customerId].transactions, 
                [action.transactionId]: {
                  ...state.assets[action.assetType][action.customerId].transactions[action.transactionId],
                  patents: action.data.length === 0 ? [] : {
                    ...state.assets[action.assetType][action.customerId].transactions[action.transactionId].patents,
                    ...arrayToObjectByKey(action.data, 'application')
                  },
                },
              },
            },
          },
        },
      }
    case types.SET_SELECTED_ASSETS_PATENTS:
      const oldValue = [...state.selectedAssetsPatents], newValue = [...action.data]
      const checkValue = oldValue.length === newValue.length && oldValue.every((value, index) => value == newValue[index])
      if(checkValue){
        return state
      } else {
        return {
          ...state,
          selectedAssetsPatents: newValue,
        }
      }
    case types.SET_CHILD_SELECTED_ASSETS_PATENTS:
      const childOldValue = [...state.childSelectedAssetsPatents], childNewValue = [...action.data]
      const childCheckValue = childOldValue.length === childNewValue.length && childOldValue.every((value, index) => value == childNewValue[index])
      if(childCheckValue){
        return state
      } else {
        return {
          ...state,
          childSelectedAssetsPatents: childNewValue,
        }
      }
    case types.SET_ASSETS_ILLUSTRATION_LOADING:
      return {
        ...state, 
        loadingAssetIllustration: action.data,
      }

    case types.SET_ASSETS_USPTO_LOADING:
      return {
        ...state,
        loadingAssetUSPTO: action.data,
      }

    case types.SET_CHARTS_LOADING:
      return {
        ...state,
        isLoadingCharts: action.data,
      }

    case types.SET_CHARTS:
      return {
        ...state,
        assetCharts: action.data,
      }

    case types.SET_ASSET_ILLUSTRATION:
      return {
        ...state,
        assetIllustration: action.data,
      }

    case types.SET_ASSET_ILLUSTRATION_DATA:
      return {
        ...state,
        assetIllustrationData: action.data,
      }

    case types.SET_ASSETS_USPTO:
      return {
        ...state,
        assetUSPTO: action.data,
      }

    case types.SET_COMMENTS_ENTITY:
      return {
        ...state,
        selectedCommentsEntity: action.data,
      }    
    case types.REVIEW_TRANSACTION_VIEW:
      return {
        ...state,
        reviewTransactionView: action.data,
      } 
    case types.SET_GRID_WIDTH_CLASS_NUMBER:
      return {
        ...state,
        gridWidthClassNumber: action.number,
      }
    case types.SET_ACTIVE_MENU_BUTTON:
      return {
        ...state,
        activeMenuButton: action.index,
      }
    case types.SET_MAIN_CUSTOMERS_LOADING_MORE: 
      return {
        ...state,
        mainCompaniesLoadingMore: action.payload,
      }
    case types.SET_MAIN_COMPANIES: 
      return {
        ...state,
        mainCompaniesList:  Object.assign({}, {
          ...state.mainCompaniesList,
          ['list']: action.data.list,
          ['total_records']: action.total_records
        })
      }
    case types.SET_MAIN_COMPANIES_SELECTED: 
      return { 
        ...state, mainCompaniesList: { ...state.mainCompaniesList, selected: action.selected, selectedWithName: action.selectedWithName, selectAll: false } 
      }
    case types.SET_MAIN_COMPANIES_ALL_SELECTED: 
      return { 
        ...state, mainCompaniesList: { ...state.mainCompaniesList, selectAll: action.flag } 
      }
    case types.SET_MAIN_COMPANIES_ROW_SELECT: 
      return { 
        ...state, mainCompaniesList: { ...state.mainCompaniesList, row_select: action.data } 
      }
    case types.SET_MAINTAINENCE_ASSETS_LIST_LOADING_MORE: 
      return {
        ...state,
        maintainenceAssetsLoadingMore: action.payload,
      }
    case types.SET_MAINTAINENCE_ASSETS_LIST: 
      return {
        ...state,
        maintainenceAssetsList:  Object.assign({}, {
          ...state.maintainenceAssetsList,
          ['list']: action.append === true ? [...state.maintainenceAssetsList.list, ...action.data.list] : action.data.list,
          ['total_records']: action.data.total_records
        })
      }
    case types.SET_MAINTAINENCE_ASSETS_SELECTED_LIST: 
      return {
        ...state,
        selectedMaintainencePatents:  action.list
      }
    case types.SET_GOOGLE_AUTH_TOKEN:
      localStorage.setItem('google_auth_token_info', JSON.stringify(action.token))
      return {
        ...state,
        google_auth_token:  action.token
      }
    case types.SET_GOOGLE_PROFILE:
      localStorage.setItem('google_profile_info', JSON.stringify(action.data))
      return {
        ...state,
        google_profile: action.data
      }
    case types.SET_GOOGLE_LAYOUT_TEMPLATE_LIST: 
      return {
        ...state,
        template_drive_files: action.data.list
      }
    case types.SET_LAYOUT_TEMPLATE_LIST_BY_ID: 
      return {
        ...state,
        template_layout_drive_files: action.data.list
      }
    case types.SET_DRIVE_TEMPLATE_FILE: 
      return {
        ...state,
        new_drive_template_file: action.data
      } 
    
    case types.SET_TEMPLATE_DOCUMENT_URL: 
      const oldFile = state.template_document_url
      if(oldFile != action.url) {
        return {
          ...state,
          template_document_url: action.url
        }
      } else {
        return {
          ...state,
          template_document_url: 'about:blank'
        }
      } 
    case types.SET_GOOGLE_TEMPLATE_LIST:
      return {
        ...state,
        drive_files: action.data.list
      }
      case types.SET_SLACK_AUTH_TOKEN:
        localStorage.setItem('slack_auth_token_info', JSON.stringify(action.token))
        return {
          ...state,
          slack_auth_token:  action.token
        }
      case types.SET_SLACK_PROFILE_DATA:
        return {
          ...state,
          slack_profile_data:  action.data
        }
      case types.SET_SLACK_MESSAGES:
        return {
          ...state,
          slack_messages: action.data
        }
      case types.SET_SLACK_CHANNEL_LIST:
        const channelList = []
        action.data.forEach( row => channelList.push(row.asset))
        return {
          ...state,
          slack_channel_list: channelList
        }
      case types.SET_SLACK_USERS:
        return {
          ...state,
          slack_users: action.data
        }
      case types.SET_CHANNEL_ID:
        return {
          ...state,
          channel_id: action.data != null && Object.keys(action.data).length > 0 && action.data.channel_id != '' ? action.data.channel_id : ''
        }
      case types.SET_MAINTAINENCE_FEE_FILE_NAME:
        return {
          ...state,
          maintainence_fee_file_name: action.name
        }
      case types.SET_ASSET_TYPES_LOADING:
        return {
          ...state,
          assetTypes: {...state.assetTypes, loading: action.flag}
        }
      case types.SET_ASSET_TYPES:
        return {
          ...state,
          assetTypes: {...state.assetTypes, list: action.data}
        }
      case types.SET_ASSET_TYPE_ROW_SELECT:
        return {
          ...state,
          assetTypes: {...state.assetTypes, row_select: action.data}
        }
      case types.SET_ASSET_TYPES_SELECTED_ALL:
        return {
          ...state,
          assetTypes: {...state.assetTypes, selectAll: action.flag}
        }
      case types.SET_ASSET_TYPES_SELECTED:
        return {
          ...state,
          assetTypes: {...state.assetTypes, selected: action.data}
        }
      case types.SET_ASSET_TYPES_COMPANIES_LOADING:
        return {
          ...state,
          assetTypeCompanies: {...state.assetTypeCompanies, loading: action.flag}
        } 
      case types.SET_ASSET_TYPE_COMPANIES:
        return {
          ...state,
          assetTypeCompanies:  {...state.assetTypeCompanies, total_records: action.data.total_records,  list: action.append === true ? [...state.assetTypeCompanies.list, ...action.data.list] : action.data.list}
        }
      case types.SET_ASSET_TYPES_INVENTORS_LOADING:
        return {
          ...state,
          assetTypeInventors: {...state.assetTypeInventors, loading: action.flag}
        } 
      case types.SET_ASSET_TYPE_INVENTORS:
        return {
          ...state,
          assetTypeInventors:  {...state.assetTypeInventors, total_records: action.data.total_records,  list: action.append === true ? [...state.assetTypeInventors.list, ...action.data.list] : action.data.list}
        }
      case types.SET_ASSET_TYPES_COMPANIES_SELECT:
        return {
          ...state,
          assetTypeCompanies:  {...state.assetTypeCompanies, selected: action.data}
        }
      case types.SET_ASSET_TYPES_COMPANIES_SELECT_ALL:
        return {
          ...state,
          assetTypeCompanies:  {...state.assetTypeCompanies, selectAll: action.flag}
        }
      case types.SET_ASSET_TYPES_COMPANIES_ROW_SELECT:
        return {
          ...state,
          assetTypeCompanies: {...state.assetTypeCompanies, row_select: action.data}
        } 
      case types.SET_ASSETS_ADDRESS_TRANSACTIONS_LOADING:
        return {
          ...state,
          assetTypeAddress: {...state.assetTypeAddress, loading: action.flag}
        } 
      case types.SET_ASSETS_ADDRESS_TRANSACTIONS:
        return {
          ...state,
          assetTypeAddress:  {...state.assetTypeAddress, total_records: action.data.total_records,  list: action.append === true ? [...state.assetTypeAddress.list, ...action.data.list] : action.data.list}
        }
	    case types.SET_SELECTED_ASSETS_ADDRESS_TRANSACTIONS: 
        return {
          ...state,
          assetTypeAddress:  {...state.assetTypeAddress, selected: action.data}
        }
      case types.SET_ASSETS_ADDRESS_TRANSACTIONS_SELECT_ALL:
        return {
          ...state,
          assetTypeAddress:  {...state.assetTypeAddress, selectAll: action.flag}
        }
      case types.SET_ASSETS_ADDRESS_TRANSACTIONS_ROW_SELECT:
        return {
          ...state,
          assetTypeAddress: {...state.assetTypeAddress, row_select: action.data}
        }
        case types.SET_NAMES_TRANSACTIONS_LOADING:
        return {
          ...state,
          assetTypeNames: {...state.assetTypeNames, loading: action.flag}
        } 
      case types.SET_NAMES_TRANSACTIONS:
        return {
          ...state,
          assetTypeNames:  {...state.assetTypeNames, total_records: action.data.total_records,  list: action.append === true ? [...state.assetTypeNames.list, ...action.data.list] : action.data.list}
        }
	    case types.SET_SELECTED_NAMES_TRANSACTIONS:
        return {
          ...state,
          assetTypeNames:  {...state.assetTypeNames, selected: action.data}
        }
      case types.SET_NAMES_TRANSACTIONS_SELECT_ALL:
        return {
          ...state,
          assetTypeNames:  {...state.assetTypeNames, selectAll: action.flag}
        }
      case types.SET_NAMES_TRANSACTIONS_ROW_SELECT:
        return {
          ...state,
          assetTypeNames: {...state.assetTypeNames, row_select: action.data}
        }
      case types.SET_ASSETS_ADDRESS_TRANSACTIONS_ALL_GROUP:
        return {
          ...state,
          assetTypeAddress: {...state.assetTypeAddress, all_groups: action.data}
        } 
      case types.SET_NAMES_TRANSACTIONS_ALL_GROUP:
        return {
          ...state,
          assetTypeNames: {...state.assetTypeNames, all_groups: action.data}
        }
      case types.SET_ADDRESS_QUEUE_DISPLAY:
        return {
          ...state,
          addressQueuesDisplay: action.flag
        }
      case types.SET_ADDRESS_QUEUE_LOADING:
        return {
          ...state,
          addressQueuesLoading: action.flag
        } 
      case types.SET_ADDRESS_QUEUES_TRANSACTIONS:
        return {
          ...state,
          addressQueues: action.data
        } 
      case types.SET_FIXED_TRANSACTION_ADDRESS:
        return { 
          ...state,
          fixedTransactionAddress: action.data
        } 
        
      case types.SET_NAME_QUEUE_DISPLAY:
        return {
          ...state,
          nameQueuesDisplay: action.flag
        }
      case types.SET_NAME_QUEUE_LOADING:
        return {
          ...state,
          nameQueuesLoading: action.flag
        } 
      case types.SET_NAME_QUEUES_TRANSACTIONS:
        return {
          ...state,
          nameQueues: action.data 
        } 
      case types.SET_FIXED_TRANSACTION_NAME:
        return { 
          ...state,
          fixedTransactionName: action.data
        }
      case types.SET_ASSET_TYPE_ID_COMPANIES_LOADING:
        return {
          ...state,
          assetTypes: {...state.assetTypes, loading_companies: action.flag}
        }
      case types.SET_ASSET_TYPE_ID_COMPANIES:
        const list = [...state.assetTypes.list]
        const findTabIndex = list.findIndex( tab => parseInt(tab.tab_id) === parseInt(action.data.tab_id))        
        if( findTabIndex >= 0 ) {
          list[findTabIndex]['children'] = action.append === true ? list[findTabIndex]['children'] ? [...list[findTabIndex]['children'], ...action.data.list] : action.data.list : action.data.list
          list[findTabIndex]['total_records'] = action.data.total_records
        }    
        return {
          ...state,
          assetTypes: Object.assign({}, {
            ...state.assetTypes,
            ['list']: [...list]
          })
        }
      case types.SET_ASSET_TYPES_CHILD_COMPANIES_ROW_SELECT:
        return {
          ...state,
          assetTypeChildCompanies:  {...state.assetTypeChildCompanies, row_select: action.data}
        }
      case types.SET_ASSET_TYPES_CHILD_COMPANIES_SELECT:
        return { 
          ...state,
          assetTypeChildCompanies:  {...state.assetTypeChildCompanies, selected: action.data}
        }
      case types.SET_ASSET_TYPE_ASSIGNMENTS:
        return {
          ...state,
          assetTypeAssignments:  {...state.assetTypeAssignments, list: action.append === true ? [...state.assetTypeAssignments.list, ...action.data.list] : action.data.list, total_records: action.data.total_records}
        }  
      case types.SET_ASSET_TYPES_ASSIGNMENTS_LOADING:
        return {
          ...state,
          assetTypeAssignments: {...state.assetTypeAssignments, loading: action.flag}
        } 
      case types.SET_ASSET_TYPE_ASSIGNMENTS_ID_ASSETS:
        const assignmentList = [...state.assetTypeAssignments.list]
        const findAssignmentIndex = assignmentList.findIndex( assignment => assignment.rf_id == action.rf_id)     
        if( findAssignmentIndex >= 0 ) {
          let childList = []          
          if(action.append === true && assignmentList[findAssignmentIndex]['children'] != undefined &&  assignmentList[findAssignmentIndex]['children']['list'] != undefined) {
            childList = [...assignmentList[findAssignmentIndex]['children']['list'], ...action.data.list]
          } else {
            childList = action.data.list
          }
          assignmentList[findAssignmentIndex]['children'] = {list: childList, total_records: action.data.total_records}
        }
        return {
          ...state,
          assetTypeAssignments: Object.assign({}, {
            ...state.assetTypeAssignments,
            ['list']: [...assignmentList]
          })
        }
      case types.SET_ASSET_TYPES_ASSIGNMENTS_LOADING:
        const assignmentsParentData = {...state.assetTypeAssignments}
        const findAssignmentParentIndex = assignmentsParentData.list.findIndex( assignment => parseInt(assignment.rf_id) === parseInt(action.rf_id))        
        if( findAssignmentParentIndex >= 0 ) {
          assignmentsParentData.list[findAssignmentParentIndex]['children']['loading'] = action.flag
        }

        return {
          ...state,
          assetTypeAssignments: assignmentsParentData
        }
      case types.SET_ASSET_TYPES_ASSIGNMENTS_SELECT_ALL:
        return {
          ...state,
          assetTypeAssignments: {...state.assetTypeAssignments, selectAll: action.flag}
        }  
      case types.SET_ASSET_TYPE_ASSIGNMENTS_SELECT:
        return {
          ...state,
          assetTypeAssignments: {...state.assetTypeAssignments, selected: action.data}
        }  
      case types.SET_ASSET_TYPE_ASSIGNMENTS_ASSETS:
        return {
          ...state,
          assetTypeAssignmentAssets:  {...state.assetTypeAssignmentAssets, list: action.append === true ? [...state.assetTypeAssignmentAssets.list, ...action.data.list] : action.data.list, total_records: action.data.total_records}
        }  
      case types.SET_ASSET_TYPE_ASSIGNMENTS_ASSETS_SELECTED:
        return {
          ...state,
          assetTypeAssignmentAssets: {...state.assetTypeAssignmentAssets, selected: action.data}
        }  
      case types.SET_ASSET_TYPES_ASSIGNMENTS_ASSETS_LOADING:
        return {
          ...state,
          assetTypeAssignmentAssets: {...state.assetTypeAssignmentAssets, loading: action.flag}
        }
      case types.SET_BREAD_CRUMBS:
        return {
          ...state,
          breadcrumbs: action.name
        }
      case types.SET_SELECTED_CATEGORY:
        return {
          ...state,
          selectedCategory: action.category
        }
      case types.SET_BREAD_CRUMBS_AND_SELECTED_CATEGORY:{
        return {
          ...state,
          breadcrumbs: action.item.breadCrumbs,
          selectedCategory: action.item.category,
          layout_id: action.item.layout_id,
        }
      }
      case types.SET_SEARCH_STRING:
        return {
          ...state,
          search_string: action.search
        }
      case types.SET_SEARCH_RF_ID:
        return {
          ...state,
          search_rf_id: action.list
        }
      case types.SET_FAMILY_CHART_VISIBILITY:
        return {
          ...state,
          familyChartVisiblity: action.visibility
        }
      case types.SET_FAMILY_CHART_VISIBILITY:
        return {
          ...state,
          familyChartVisiblity: action.visibility
        } 
      case types.SET_RESET_ALL:
        const google_profile = {...state.google_profile},
              breadcrumbs = {...state.breadCrumbs},
              selectedCategory = {...state.category},
              layout_id = {...state.layout_id},
              clipboard_assets = [...state.clipboard_assets]
        return {
          ...state,
          ...dashboardIntial,
          google_profile,
          breadcrumbs,
          selectedCategory,
          layout_id,
          clipboard_assets 
        }
      case types.SET_MOVE_ASSETS:
        return {
          ...state,
          move_assets: action.items
        }
      case types.SET_DOCUMENT_TRANSACTION:
        return { 
          ...state,
          document_transaction: action.data
        } 
      case types.SET_CLIPBOARD_ASSETS:
        return { 
          ...state,
          clipboard_assets: action.data
        }
      case types.SET_CLIPBOARD_ASSETS_DISPLAY:
        return { 
          ...state,
          display_clipboard: action.flag 
        }
      default:  
      return state
  } 
}
 
export default patenTrackReducer
