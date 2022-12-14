import * as types from '../actions/actionTypes'
import initialState from './initialState'

const patenTrackReducer = (state = initialState.patient, action) => {
  switch (action.type) {
    case types.SET_COOKIE:
      let token = localStorage.getItem('token')
      if(token == null) {
        var nameEQ = 'token='
        var ca = document.cookie.split(';')
        for(var i=0;i < ca.length;i++) {
          var c = ca[i]
          while (c.charAt(0)==' ') c = c.substring(1,c.length)
          if (c.indexOf(nameEQ) == 0) {
            localStorage.setItem('token', c.substring(nameEQ.length,c.length))
          } 
        }
      }
      return{
        ...state,
      }
    case types.INIT_STAGE:
      return {
        ...initialState.patient
      }    
    case types.SET_CURRENT_WIDGET:
      return {
        ...state,
        currentWidget: state.currentWidget === action.data ? 'all' : action.data
      }
    case types.SET_PROFILE:
      return {
        ...state,
        profile: action.data
      }
    case types.SET_VALIDATE_COUNTER:
      return {
        ...state,
        validateCounter: action.data
      }
    case types.SET_VALIDATE_COUNTER_LOADING:
      return {
        ...state,
        validateCounterLoading: action.data
      }
    case types.SET_CUSTOMERS:
      return {
        ...state,
        customersData: Object.assign({}, {
          ...state.customersData,
          [action.customerType]: action.data
        })
      }
    case types.SET_CUSTOMERS_LOADING:
      return {
        ...state,
        customersLoading: action.data
      }
    case types.SET_ASSETS_COUNT:
      return {
        ...state,
        assetsCount: action.data
      }
    case types.SET_ASSETS_COUNT_LOADING:
      return {
        ...state,
        assetsCountLoading: action.data
      }
    case types.SET_CUSTOMERS_NAME_PARTIES_LOADING:      
      return {
        ...state,
        customersPartiesLoading: action.data
      }
    case types.SET_CUSTOMERS_NAME_PARTIES:
      let parameter
      switch(parseInt(action.tabId)){
        case 0:
          parameter = 'acquisitions'
          break
        case 1:
          parameter = 'sales'
          break
        case 2:
          parameter = 'licenseIn'
          break
        case 3:
          parameter = 'licenseOut'
          break
        case 4:
          parameter = 'securities'
          break
        case 5:
          parameter = 'mergerin'
          break
        case 6:
          parameter = 'mergerout'
          break
        case 7:
          parameter = 'options'
          break
        case 8:
          parameter = 'courtOrders'
          break
        case 9:
          parameter = 'employees'
          break  
        case 10:
          parameter = 'other'
          break
      }
      const partiesOldData = [ ...state.customersData[parameter] ]
      
      const companyIndex = partiesOldData.findIndex(x => x.id == action.parentNode)
      partiesOldData[companyIndex]['child'] = [ ...action.data ]
      return {
        ...state,
        customersData: Object.assign({}, {
          ...state.customersData,
          [parameter]: [ ...partiesOldData ]
        })
      } 
    case types.SET_CUSTOMERS_NAME_COLLECTIONS:
      let params
      switch(parseInt(action.tabId)){
        case 0:
          params = 'acquisitions'
          break
        case 1:
          params = 'sales'
          break
        case 2:
          params = 'licenseIn'
          break
        case 3:
          params = 'licenseOut'
          break
        case 4:
          params = 'securities'
          break
        case 5:
          params = 'mergerin'
          break
        case 6:
          params = 'mergerout'
          break
        case 7:
          params = 'options'
          break
        case 8:
          params = 'courtOrders'
          break
        case 9:
          params = 'employees'
          break
        case 10:
          params = 'other'
          break
      }
      const newItems = [ ...state.customersData[params] ]
      const parentIndex = newItems.findIndex(x => x.id == action.parentNode) 
      const childIndex = newItems[parentIndex].child.findIndex(x => x.id == action.currentNode)
      newItems[parentIndex].child[childIndex]['child'] = [ ...action.data ]
      return {
        ...state,
        customersData: Object.assign({}, {
          ...state.customersData,
          [params]: [ ...newItems ]
        })
      }
      /*return {
        ...state,
        customersNamesCollections: Object.assign({}, {
          ...state.customersNamesCollections,
          [action.name]: [...action.data] 
        })
      };*/
    case types.SET_CUSTOMERS_NAME_COLLECTIONS_LOADING:      
      return {
        ...state,
        customersNameCollectionsLoading: action.data
      }      
    case types.SET_CUSTOMER_RFID_ASSETS:
      let propIndex
      switch(parseInt(action.tabId)){
        case 0:
          propIndex = 'acquisitions'
          break
        case 1:
          propIndex = 'sales'
          break
        case 2:
          propIndex = 'licenseIn'
          break
        case 3:
          propIndex = 'licenseOut'
          break
        case 4:
          propIndex = 'securities'
          break
        case 5:
          propIndex = 'mergerin'
          break
        case 6:
          propIndex = 'mergerout'
          break
        case 7:
          propIndex = 'options'
          break
        case 8:
          propIndex = 'courtOrders'
          break
        case 9:
          propIndex = 'employees'
          break
        case 10:
          propIndex = 'other'
          break
      } 
      const oldItems = [ ...state.customersData[propIndex] ]
      const parentNode = oldItems.findIndex(x => x.id == action.parentNode) 
      const parentNode2 = oldItems[parentNode].child.findIndex(x => x.id == action.parentNode1) 
      const childNode = oldItems[parentNode].child[parentNode2].child.findIndex(x => x.id == action.currentNode)
      oldItems[parentNode].child[parentNode2].child[childNode]['child'] = [ ...action.data ]
        return {
        ...state,
        customersData: Object.assign({}, {
          ...state.customersData,
          [propIndex]: [ ...oldItems ]
        })
      }
      /*return {
        ...state,
        customersRFIDAssets: Object.assign({}, {
          ...state.customersRFIDAssets,
          [action.rfID]: [...action.data]
        })
      };*/
    case types.SET_TELEPHONE_LIST:
      return {
        ...state,
        telephoneList: [ ...action.data ]
      }
    case types.SET_COMPANY_LAWYER_LIST:
      return {
        ...state,
        companyLawyerList: [ ...action.data ]
      }
    case types.SET_ADDRESS_LIST:
      return {
        ...state,
        addressList: [ ...action.data ]
      }
    case types.SET_LAWYERS_LIST:
      return {
        ...state,
        lawyerList: [ ...action.data ]
      }
    case types.SET_DOCUMENTS_LIST:
      return {
        ...state,
        documentList: [ ...action.data ]
      }
    case types.SET_COMPANIES_LIST:
      return {
        ...state,
        companiesList: [ ...action.data ]
      }
    case types.SET_USERS_LIST:
      return {
        ...state,
        userList: [ ...action.data ]
      }
    case types.SET_USERS_LIST_LOADING:
      return {
        ...state,
        userListLoading: action.data
      }
    case types.SET_EDIT_ROW:
      return {
        ...state,
        user_edit_row: action.payload
      }
    case types.SET_DELETE_ROW:
      return {
        ...state,
        user_delete_row: action.payload
      }
    case types.SET_DOCUMENT_UPDATE_ROW:
      return {
        ...state,
        update_document_row: action.row
      }
    case types.SET_RECORD:
      return {
        ...state,
        record_item: action.data
      }
    case types.SET_PDF_FILE:
      return {
        ...state,
        pdfFile: action.file
      }
    case types.SET_PDF_TAB:
      return {
        ...state,
        pdfTab: action.payload
      }
    case types.SET_PDF_VIEW:
      return {
        ...state,
        pdfView: action.view
      }
    case types.SET_PDF_VIEW_MODAL:
      return {
        ...state,
        pdfViewModal: action.view,
      }      
    case types.SET_CONNECTION_DATA:
      return { 
        ...state, 
        connectionBoxData: action.data
      }
    case types.SET_CONNECTION_VIEW_BOX:
      return {
        ...state,
        connectionBoxView: action.flag
      }
    case types.SET_CUSTOMER_RFID_ASSETS_LOADING:
      return { 
        ...state,
        customersRFIDAssetsLoading: action.data
      }
    case types.SET_RECORD_ITEMS:
      return {
        ...state,
        recordItems: Object.assign({}, {
          ...state.recordItems,
          [action.itemType]: {
            ...state.recordItems[action.itemType],
            [action.itemOption]: action.data
          }
        })
      }
    case types.SET_RECORD_ITEMS_LOADING:
      return {
        ...state,
        recordItemsLoading: action.data
      }
    case types.SET_ERRORS_ITEMS_LOADING:
      return {
        ...state,
        errorItemsLoading: action.data
      }
    case types.SET_ERRORS_ITEMS:
      return {
        ...state,
        errorItems: Object.assign({}, {
          ...state.errorItems,
          [action.itemType]: action.data
        }),
        errorTotal: action.data.total
      }
    case types.SET_ERRORS_ITEMS_APPEND:
      const tabType = action.currentTab == 0 ? 'invent' : action.currentTab == 1 ? 'assign' : action.currentTab == 2 ? 'corr' : action.currentTab == 3 ? 'address' : 'security'
      const oldList = state.errorItems[action.itemType]
      const oldData  = oldList[tabType]
      const newList = [ ...oldData, ...action.data[tabType] ]

      return {
        ...state,
        errorItems: Object.assign({}, {
          ...state.errorItems,
          [action.itemType]: Object.assign({}, {
            ...oldList,
            [tabType]: newList
          })    
        }),
        errorTotal: action.data.total
      }
    case types.CHANGE_WIDTH_AND_HEIGHT:
      return {
        ...state,
        screenWidth: action.screenWidth,
        screenHeight: action.screenHeight
      }
    case types.SET_ALERTS_COUNT:
      return {
        ...state,
        alertsCount: action.data
      }
    case types.SET_MESSAGES_COUNT:
      return {
        ...state,
        messagesCount: action.data
      }
    case types.SET_CHARTS:
      return {
        ...state,
        charts: Object.assign({}, {
          ...state.charts,
          [action.option]: action.data
        })
      }
    case types.SET_CHART_ONE: {
      if (action.option == 1) {
        return {
          ...state,
          chart_one: action.data
        }
      } else if (action.option == 2) {
        return {
          ...state,
          chart_two: action.data
        }
      } else if (action.option == 3) {
        return {
          ...state,
          chart_three: action.data
        }
      } else if (action.option == 4) {
        return {
          ...state,
          chart_four: action.data
        }
      } else if (action.option == 5) {
        return {
          ...state,
          chart_five: action.data
        }
      }
      return state
    }
    case types.SET_CHARTS_LOADING:
      return {
        ...state,
        chartsLoading: action.data
      }
    case types.SET_TIME_LINE:
      return {
        ...state,
        timeLine: action.data
      }
    case types.SET_TIME_LINE_LOADING:
      return {
        ...state,
        timeLineLoading: action.data
      }
    case types.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.data
      }
    case types.SET_TRANSACTIONS_LOADING:
      return {
        ...state,
        transactionsLoading: action.data
      }
    case types.SET_COMMENTS:
      return {
        ...state,
        comments: action.data
      }
    case types.SET_COMMENT_SAVED:
      return {
        ...state,
        commentMessage: action.message
      }      
    case types.SET_COMMENTS_LOADING:
      return {
        ...state,
        commentsLoading: action.data
      }
    case types.SET_ASSETS:
      //console.log("REDUCERS", action.data);
      return {
        ...state,
        assets: action.data
      }
    case types.SET_POPUP_ASSETS:
      //console.log("REDUCERS", action.data);
      return {
        ...state,
        popup_assets: action.data
      }
    case types.SET_POPUP_ASSETS_DISPLAY:
      return {
        ...state,
        display_popup_asset: action.d
      }
    case types.SET_ASSETS_LOADING:
      return {
        ...state,
        assetsLoading: action.data
      }
    case types.SET_ASSETS_OUTSOURCE:
      return {
        ...state,
        assetsOutsource: action.data
      }
    case types.SET_ASSETS_OUTSOURCE_LOADING:
      return {
        ...state,
        assetsOutsourceLoading: action.data
      }
    case types.SET_ASSET_LEGAL_EVENTS:
      return {
        ...state,
        assetLegalEvents: action.events
      }
    case types.SET_FAMILY_ITEM_DETAIL:
      return {
        ...state,
        familyItem: action.item
      }
    case types.SET_ASSET_FAMILY:
      return {
        ...state,
        assetFamily: action.family
      }
    case types.SET_TREE_OPEN:
      return {
        ...state,
        tree: Object.assign({}, {
          ...state.tree,
          [action.key]: action.value
        })
      }
    case types.SET_COMPANY_TREE_OPEN:
      return {
        ...state,
        company_tree: Object.assign({}, {
          ...state.company_tree,
          [action.key]: action.value
        })
      } 
    case types.RESET_COMPANY_TREE:
      return {
        ...state,
        company_tree: {}
      }       
    case types.SET_CURRENT_ASSET:
      return {
        ...state,
        currentAsset: action.data
      }
    case types.SET_CURRENT_ASSET_TYPE:
      return {
        ...state,
        currentAssetType: action.data
      }
    case types.SET_CURRENT_COLLECTION_ID:
      return {
        ...state,
        selectedRFID: action.data
      }
    case types.SET_SUB_COMPANIES:
      return {
        ...state,
        childCompanies: Object.assign({}, {
          ...state.childCompanies,
          [action.name]: action.data
        })
      }
    case types.SET_MAIN_COMPANY_SELECTED:
      return {
        ...state,
        main_company_selected: action.payload
      }
    case types.SET_SUB_COMPANY_SELECTED_NAME:
      return {
        ...state,
        main_company_selected_name: action.name
      }
    case types.SET_SEARCH_COMPANY_SELECTED:
      return {
        ...state,
        search_companies_selected: action.name
      }
    case types.SET_SETTING_TEXT:
      return {
        ...state,
        settingText: action.name,
        searchCompanies: []
      }
    case types.SET_SITE_LOGO:
      return {
        ...state,
        siteLogo: action.data
      }
    case types.SET_CUR_TREE_LEVEL1:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel1: action.data
          }
        })
      }
    case types.INIT_CUR_TREE_LEVEL1:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel1: ''
          }
        })
      }
    case types.SET_CUR_TREE_LEVEL2:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel2: action.data
          }
        })
      }
    case types.INIT_CUR_TREE_LEVEL2:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel2: ''
          }
        })
      }
    case types.SET_CUR_TREE_LEVEL3:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel3: action.data
          }
        })
      }
    case types.INIT_CUR_TREE_LEVEL3:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel3: ''
          }
        })
      }
    case types.SET_CUR_TREE_LEVEL4:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel4: action.data
          }
        })
      }
    case types.INIT_CUR_TREE_LEVEL4:
      return {
        ...state,
        curTree: state.curTree.map((item, index) => {
          if(index !== action.tabId)
            return item
          return {
            ...item,
            curTreeLevel4: ''
          }
        })
      }
    case types.SET_NESTGRID_TAB:
      return {
        ...state,
        nestGridTab: action.payload
      }
    case types.SET_SEARCH_COMPANY:
      return {
        ...state,
        searchCompanies: action.list
      }
    case types.SET_SEARCH_COMPANY_LOADING:
      return {
        ...state,
        searchCompanyLoading: action.payload
      }
    case types.SET_COMPANY_LOADING:
      return {
        ...state,
        companyListLoading: action.payload
      }
    case types.SET_DOCUMENT_ITEMS_LOADING:
      return {
        ...state,
        documentListLoading: action.payload
      }
    case types.SET_TIMELINE_TAB:
      return {
        ...state,
        timelineTab: action.payload
      }
    case types.SET_CHART_TAB:
      return {
        ...state,
        chartTab: action.payload
      }
    case types.SET_FIXIT_TAB:
      return {
        ...state,
        fixitTab: action.payload
      }
    case types.SET_ERROR_TAB:
      return {
        ...state,
        errorTab: action.payload
      }
    case types.SET_RECORDIT_TAB:
      return {
        ...state,
        recorditTab: action.payload
      }
    case types.SET_PORTFOLIO_COMPANY:
      return {
        ...state,
        portfolio_company: action.company
    }
    case types.SET_PORTFOLIO_COMPANY_CUSTOMER:
      return {
        ...state,
        portfolio_company_customer: action.company_customer
      }
    case types.SET_SETTING_TAB:
      return {
        ...state,
        settingTab: action.payload
      }
    case types.SET_ILLUSTRATION_URL:
      return {
        ...state,
        illustrationUrl: action.illustrationUrl
      }
    case types.SET_TREE_EXPAND:
      return {
        ...state,
        treeExpand: action.data
      }
    case types.SET_TREE_TOGGLE:
      return {
        ...state,
        treeToggle: action.data
      }
    case types.SET_ADD_YEARS:
      return {
        ...state,
        add_years: action.option
      }
    case types.SET_TREE_COMPANY_SELECT:
      return {
        ...state,
        treeCompanySelected: action.company_name
      }
    case types.SET_LEGAL_EVENT_DATA_RETRIEVED:
      return {
        ...state,
        legalEventDataRetrieved: action.flag
      }  
    case types.SET_FAMILY_ITEM_DATA_RETRIEVED:
      return {
        ...state,
        familyDataRetrieved: action.flag 
      }  
    default:
      return state
  }
}

export default patenTrackReducer