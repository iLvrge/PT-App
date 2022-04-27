
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
    setChannelID
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

export const resetAllRowSelect = ( dispatch,  resetList) => {
    resetList.forEach( item => dispatch( item.callback ))
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
    ],
    clearOtherItems: [
        {
            callback: setAssetsIllustration(null)
        }, 
        {
            callback: setAssetsIllustrationData(null)
        }, 
        {
            callback: setSelectedAssetsTransactions([])
        },
        {
            callback: setSelectedAssetsPatents([])
        },
        {
            callback: setChannelID(null)
        },
        {
            callback: setSlackMessages({messages: [], users: []})
        },
        {
            callback: setPDFFile({ 
                document: '',  
                form: '', 
                agreement: '' 
            })
        },
        {
            callback: setPDFView(false)
        },
        {
            callback: setAssetsIllustration(null)
        },                 
        {
            callback: toggleLifeSpanMode(true)
        }, 
        {
            callback: toggleFamilyMode(false)
        }, 
        {
            callback: toggleUsptoMode(false)
        }, 
        {
            callback: toggleFamilyItemMode(false)
        }, 
        {
            callback: setAllAssetTypes(false)
        }, 
        {
            callback: setAssetTypesSelect([])
        },
        {
            callback: setAllAssignmentCustomers(false)
        }, 
        {
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