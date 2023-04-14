
import { setAssetTypeAssignments, 
    setSelectedAssetsTransactions, 
    setSelectedAssetsPatents, 
    setAssetsIllustration, 
    setAssetTypeAssignmentAllAssets,
    setAssetTypes,
    setAssetTypeInventor,
    setAssetTypeCompanies,
    setAssetsIllustrationData,
    setAllAssetTypes,
    setAssetTypesSelect,
    setAllAssignmentCustomers,
    setSelectAssignmentCustomers,
    setAssetTypesPatentsSelected,
    setAssetTypesPatentsSelectAll,
    setAllAssignments, 
    setSelectAssignments,
    setSlackMessages,
    setChannelID,
    setSelectedMaintainenceAssetsList,
    setCPCRequest,
    setJurisdictionRequest,
    setJurisdictionData,
    setCPCData,
    setTimelineRequest,
    setTimelineData,
    setCPCSecondData,
    setLineChartReset,
    setSelectLawFirm
   } from '../actions/patentTrackActions2'
  
   import {  
    setPDFView,
    setPDFFile,
    setPdfTabIndex
   } from '../actions/patenTrackActions'
  
  import { 
    toggleFamilyMode,
    toggleFamilyItemMode,
    toggleUsptoMode,
    toggleLifeSpanMode,
    setSankeyFilterActive,
  } from '../actions/uiActions'





export const updateResizerBar = (ref, bar, t = 0, defaultSize) => {
    if( ref.current != null ) {
        const container = ref.current.splitPane, 
                findResizer = t === 1 ? container.querySelector('span.Resizer.horizontal')  : container.querySelector('span.Resizer.vertical') 
        let display = 'none'
        if(bar === true){
            display = ''
        }
        findResizer.style.display = display
        /* if(typeof defaultSize !== 'undefined') {
            if(t === 1) {
                container.querySelector('div.Pane2').style.height = defaultSize
            } else {
                container.querySelector('div.Pane1').style.height = defaultSize
            }
        } */
    }
    
}

export const unsetAllFunction = ( dispatch,  resetList) => {
    resetList.forEach( item => dispatch( item ))
}

export const resetAllRowSelect = ( dispatch, resetList, skipIndex) => { 
    resetList.forEach( (item, index) => typeof skipIndex === 'undefined' || (typeof skipIndex != 'undefined'  && !skipIndex.includes(index)) ? dispatch( item.callback) : '')
} 


/* export const resetAllRowSelect = ( dispatch,  resetList) => {
    resetList.forEach( item => {
        if(item.props.length > 0 ){
            console.log(item.callback, item.props)
            dispatch( item.callback(item.props.join(',')) )  
        } else {
            dispatch( item.callback() )
        }
    })
}  */ 

export const resetItemList = {
    resetAll: [ 
        {
            callback: setTimelineRequest(false)
        },
        {
            callback: setTimelineData([])
        },
        {
            callback: setCPCRequest(false)
        },
        {
            callback: setJurisdictionRequest(false)
        },
        {
            callback: setJurisdictionData([])
        },
        {
            callback: setLineChartReset()
        },
        {
            callback: setCPCData({list:[], group: [], sales: []})
        },
        {
            callback: setCPCSecondData({list:[], group: [], sales: []})
        },
        {
            callback: setAssetTypes([])
        },
        {
            callback: setAssetTypeCompanies({ list: [], total_records: 0 })
        },
        {
            callback: setAssetTypeInventor({ list: [], total_records: 0 })
        },
        {
            callback: setAssetTypeAssignments({ list: [], total_records: 0 })
        },
        {
            callback: setAssetTypeAssignmentAllAssets({ list: [], total_records: 0 })
        },
        {
            callback: setAssetTypesPatentsSelected([])
        },
        {
            callback: setAssetTypesPatentsSelectAll(false)
        },
        {
            callback: setAllAssignments(false)
        },
        {
            callback: setSelectAssignments([])
        },
        {
            callback: setSelectAssignmentCustomers([])
        },
        {
            callback: setAllAssignmentCustomers(false)
        },
        {
            callback: setSelectedMaintainenceAssetsList([])
        },
        {
            callback: setSankeyFilterActive(false)
        },
        {
            callback:  setSelectLawFirm(0) 
        },
    ],
    clearOtherItems: [
        {   //0
            callback: setAssetsIllustration(null)
        }, 
        {  //1
            callback: setAssetsIllustrationData(null)
        }, 
        {  //2
            callback: setSelectedAssetsTransactions([])
        },
        {  //3
            callback: setSelectedAssetsPatents([])
        },
        {  //4
            callback: setChannelID(null)
        },
        {  //5
            callback: setSlackMessages({ messages: [], users: [] })
        },
        {  //6
            callback: setPDFFile({ document: '', form: '', agreement: '' })
        },
        {  //7
            callback: setPDFView(false)
        },
        {  //8
            callback: setAssetsIllustration(null)
        },                 
        {  //9
            callback: toggleLifeSpanMode(true)
        }, 
        {  //10
            callback: toggleFamilyMode(false)
        }, 
        {  //11
            callback: toggleUsptoMode(false)
        }, 
        {  //12
            callback: toggleFamilyItemMode(false)
        }, 
        {  //13
            callback: setAllAssetTypes(false)
        }, 
        {  //14
            callback: setAssetTypesSelect([])
        },
        {  //15
            callback: setAllAssignmentCustomers(false)
        }, 
        {  //16
            callback: setSelectAssignmentCustomers([])
        },
    ]
} 


/* export const resetItemList = {
    resetAll: [
        {
            callback: setAssetTypes,
            props: [
                []
            ]
        },
        {
            callback: setAssetTypeCompanies,
            props: [
                { list: [], total_records: 0 }
            ]
        },
        {
            callback: setAssetTypeInventor,
            props: [
                { list: [], total_records: 0 }
            ]
        },
        {
            callback: setAssetTypeAssignments,
            props: [
                { list: [], total_records: 0 }
            ]
        },
        {
            callback: setAssetTypeAssignmentAllAssets,
            props: [
                { list: [], total_records: 0 }
            ]
        },
        {
            callback: setAssetTypesPatentsSelected,
            props: [
                []
            ]
        },
        {
            callback: setAssetTypesPatentsSelectAll,
            props: [
                false
            ]
        },
        {
            callback: setAllAssignments,
            props: [
                false
            ]
        },
        {
            callback: setSelectAssignments,
            props: [
                []
            ]
        },
        {
            callback: setSelectAssignmentCustomers,
            props: [
                []
            ]
        },
        {
            callback: setAllAssignmentCustomers,
            props: [
                false
            ]
        },
    ],
    clearOtherItems: [
        {
            callback: setAssetsIllustration,
            props: [
                null
            ]
        }, 
        {
            callback: setAssetsIllustrationData,
            props: [
                null
            ]
        }, 
        {
            callback: setSelectedAssetsTransactions,
            props: [
                []
            ]
        },
        {
            callback: setSelectedAssetsPatents,
            props: [
                []
            ]
        },
        {
            callback: setSlackMessages,
            props: [
                []
            ]
        },
        {
            callback: setPDFFile,
            props: [
                { 
                    document: '',  
                    form: '', 
                    agreement: '' 
                }
            ]
        },
        {
            callback: setPDFView,
            props: [
                false
            ]
        },
        {
            callback: setAssetsIllustration,
            props: [
                null
            ]
        },                 
        {
            callback: toggleLifeSpanMode,
            props: [
                true
            ]
        }, 
        {
            callback: toggleFamilyMode,
            props: [
                false
            ]
        }, 
        {
            callback: toggleUsptoMode,
            props: [
                false
            ]
        }, 
        {
            callback: toggleFamilyItemMode,
            props: [
                false
            ]
        }, 
        {
            callback: setAllAssetTypes,
            props: [
                false
            ]
        }, 
        {
            callback: setAssetTypesSelect,
            props: [
                []
            ]
        },
        {
            callback: setAllAssignmentCustomers,
            props: [
                false
            ]
        }, 
        {
            callback: setSelectAssignmentCustomers,
            props: [
                []
            ]
        },
    ]
}   */