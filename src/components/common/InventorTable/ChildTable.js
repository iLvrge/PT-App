import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory, useLocation  } from 'react-router-dom'
import { Paper } from '@mui/material'
import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'

import PatenTrackApi from '../../../api/patenTrack2'
import {
    setAssetTypeCompanies,
    setMainCompaniesRowSelect,
    setAssetTypeSelectedRow,
    setAssetTypeCustomerSelectedRow,
    setSelectedAssetsTransactions,
    setChildSelectedAssetsTransactions,
    setSelectedAssetsPatents,
    setAssetsIllustration,
    getAssetsAllTransactionsEvents,
    setAssetTypeAssignmentAllAssets,
    setAssetTypesPatentsSelected,
    linkWithSheetOpenPanel,
    linkWithSheetSelectedAsset,
    setChildSelectedAssetsPatents,
    setSelectedAssetAddressTransactions,
    setAssetTypeChildCustomerSelectedRow,
    setChannelID,
    setDriveTemplateFile,
    setTemplateDocument,
    getAssetDetails,
    setCommentsEntity,
    setSlackMessages,
    setAssetsIllustrationData,
    setLinkAssetData,
    setLinkAssetListSelected,
    resetAssetDetails,
} from '../../../actions/patentTrackActions2'

import {
    assetFamily,
    assetFamilySingle,
    assetLegalEvents,
    setAssetFamily,
    setConnectionBoxView, 
    setFamilyItemDisplay, 
    setPDFFile, 
    setPDFView,
} from '../../../actions/patenTrackActions'

import { toggleUsptoMode, toggleFamilyMode, toggleFamilyItemMode, setDriveTemplateFrameMode, toggleLifeSpanMode } from '../../../actions/uiActions'

import { 
    updateHashLocation
} from '../../../utils/hashLocation'

import { applicationFormat, numberWithCommas } from '../../../utils/numbers'

import Loader from '../Loader'

const ChildTable = ({ partiesId, headerRowDisabled }) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [ offset, setOffset ] = useState(0)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 800 )
    const [ childHeight, setChildHeight ] = useState(500)
    const tableRef = useRef()
    const [ counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const [ assignmentLoading, setAssignmentLoading] = useState( true )
    const [ assignments, setAssignments] = useState( [] )
    const [ selectedAll, setSelectAll ] = useState( false )
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )
    const [ childSelected, setCheckedSelected] = useState( 0 )
    const [ currentSelection, setCurrentSelection] = useState(null) 
    const [defaultViewFlag, setDefaultViewFlag] = useState(0)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetTypesSelected = useSelector(state => state.patenTrack2.assetTypes.selected)
    const assetTypesSelectAll = useSelector(state => state.patenTrack2.assetTypes.selectAll)
    const assetTypeCompanies = useSelector(state => state.patenTrack2.assetTypeCompanies)
    const assetTypeAssignmentAssets = useSelector(state => state.patenTrack2.assetTypeAssignmentAssets.list)
    const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
    const channel_id = useSelector(state => state.patenTrack2.channel_id)
    const slack_channel_list = useSelector(state => state.patenTrack2.slack_channel_list)
    const slack_channel_list_loading = useSelector(state => state.patenTrack2.slack_channel_list_loading)
    const COLUMNS = [ 
        {
            width: 100,
            label: 'Asset', 
            dataKey: 'asset',
            staticIcon: "US",
            format: numberWithCommas,
            formatCondition: 'asset_type',
            formatDefaultValue: 0,
            secondaryFormat: applicationFormat,
            align: "center",         
        }
    ]
       
    useEffect(() => {
        const getAssignments = async () => {            
            if( partiesId > 0 ) {
                setAssignmentLoading( true )
                const companies = selectedCompaniesAll === true ? [] : selectedCompanies,
                    tabs = assetTypesSelectAll === true ? [] : assetTypesSelected,
                    customers = [partiesId]
                
                /* const { data } = await PatenTrackApi.getAssetTypeAssignments(companies, tabs, customers, selectedCategory != '' ? selectedCategory : '', false) */ 
                const { data } = await PatenTrackApi.getCustomerAssets(selectedCategory, companies, tabs, customers, [], 0, 3000, 'asset', 'desc', false) 
                setAssignments(data.list)
                setAssignmentLoading( false )
                if( data.list != null && data != '' && data.list.length > 0 ){
                    let companiesList = [...assetTypeCompanies.list] 
                    const promise = companiesList.map( (row, index) => {
                        if( row.id == partiesId){                            
                            companiesList[index].totalTransactions = data.list.length
                        }
                        return row
                    })
                    await Promise.all(promise)
                    dispatch( setAssetTypeAssignmentAllAssets(data, false) )
                    dispatch(
                        setAssetTypeCompanies({
                            ...assetTypeCompanies,
                            list: companiesList, 
                            append: false 
                        })
                    )
                }
            } else {
                setAssignmentLoading( false )
            }
        }
        getAssignments()
    }, [ dispatch, selectedCategory, selectedCompanies, selectedCompaniesAll, assetTypesSelected, assetTypesSelectAll, partiesId ])

    const onHandleSelectAll = useCallback((event, row) => {
        
    }, [ dispatch ])

    const onHandleClickRow = useCallback((e,  row) => {
        e.preventDefault()
        /* getTransactionData(dispatch, row.rf_id) */
        let oldSelection = [...selectItems];
        if (!oldSelection.includes(`${row.asset}`)) {
            dispatch(setAssetTypesPatentsSelected([row.asset]))
            setSelectItems([row.asset])
            handleOnClick(row)
        } else {
            clearSelections()
        } 

    }, [ dispatch, selectItems, currentSelection ])

    const clearSelections = () => {
        dispatch(setAssetTypesPatentsSelected([]))
        setSelectItems([]); 
        /* setCheckBar(!checkBar) */
        resetAll()
    }

    const callSelectedAssets = useCallback(({ grant_doc_num, appno_doc_num, asset }) => {  
        setSelectedRow([asset]);    
      }, [dispatch] );


  const findChannelID = useCallback((asset) => {
    let channelID = ''
    if(slack_channel_list.length > 0 && asset != undefined) {
      const findIndex = slack_channel_list.findIndex( channel => channel.name == `us${asset}`.toString().toLocaleLowerCase())
  
      if( findIndex !== -1) {
        channelID = slack_channel_list[findIndex].id
      }
    }
    return channelID
  }, [ slack_channel_list ]) 

    const handleOnClick = useCallback(
        ({ grant_doc_num, appno_doc_num, asset }) => {     
          /*TV, Comment, Family, FamilyItem, getChannelID Legal Events */
          if(!selectedRow.includes(asset)) {
            if(selectedCategory == 'restore_ownership') {
              dispatch(setAssetTypesPatentsSelected([asset]))
              setSelectItems([asset])
            }
            if(selectedCategory == 'technical_scope') {
              dispatch(linkWithSheetOpenPanel(true))
              dispatch(linkWithSheetSelectedAsset('products', encodeURIComponent(grant_doc_num  == '' ? `US${applicationFormat(appno_doc_num)}` : `US${numberWithCommas(grant_doc_num)}`)))     
            }
            callSelectedAssets({ grant_doc_num, appno_doc_num, asset });
            /* if(defaultViewFlag === 0) {
              let changeBar = false
              if(openIllustrationBar === false) {
                changeBar = true
                handleIllustrationBarOpen() 
              }
              if(commentBar === false) {
                changeBar = true
                handleCommentBarOpen() 
              }
              if(openChartBar === false) {
                changeBar = true
                handleChartBarOpen()
              }
              if(openAnalyticsBar === false) {
                changeBar = true
                handleAnalyticsBarOpen()
              }
    
              if(changeBar === true) {
                handleVisualBarSize(true, true, true, true)
              }
              setDefaultViewFlag(1)
            }  */       
            dispatch(setChildSelectedAssetsPatents([]));
            dispatch(setSelectedAssetAddressTransactions([]));
            //dispatch(setDocumentTransaction([]));
            dispatch(setMainCompaniesRowSelect([]));
            dispatch(setAssetTypeSelectedRow([]));
            dispatch(setAssetTypeChildCustomerSelectedRow([]));
            dispatch(setChildSelectedAssetsTransactions([]));
            dispatch(setAssetFamily([]));
            dispatch(setChannelID(''))
            dispatch(setDriveTemplateFrameMode(false));
            dispatch(setDriveTemplateFile(null));  
            dispatch(setTemplateDocument(null));
            dispatch(setConnectionBoxView(false));
            dispatch(setPDFView(false));        
            //dispatch(toggleUsptoMode(false));  
            dispatch(toggleLifeSpanMode(false));
            dispatch(toggleFamilyMode(true));
            dispatch(toggleFamilyItemMode(true));
            PatenTrackApi.cancelFamilyCounterRequest()
            PatenTrackApi.cancelClaimsCounterRequest()
            PatenTrackApi.cancelFiguresCounterRequest()
            PatenTrackApi.cancelPtabCounterRequest()
            PatenTrackApi.cancelCitationCounterRequest()
            PatenTrackApi.cancelFeesCounterRequest()
            PatenTrackApi.cancelStatusCounterRequest()
            dispatch(getAssetDetails(appno_doc_num, grant_doc_num))
            dispatch(
              setPDFFile(
                { 
                  document: null, 
                  form: null, 
                  agreement: null 
                }
              )
            )
            dispatch(setSelectedAssetsPatents([grant_doc_num, appno_doc_num]));
            dispatch(
            setAssetsIllustration({
                type: "patent",
                id: grant_doc_num || appno_doc_num,
                flag: grant_doc_num !== '' && grant_doc_num !== null ? 1 : 0
            }),
            );
            dispatch(
            setCommentsEntity({
                type: "asset",
                id: grant_doc_num || appno_doc_num,
            }),
            );
            
    
            dispatch(assetFamilySingle(appno_doc_num))
            dispatch(assetLegalEvents(appno_doc_num, grant_doc_num))
            dispatch(assetFamily(appno_doc_num))
            dispatch(setSlackMessages({ messages: [], users: [] }))
            const channelID = findChannelID(grant_doc_num != '' ? grant_doc_num : appno_doc_num)        
            if( channelID != '') {
              dispatch(setChannelID({channel_id: channelID}))
            }
            //dispatch(getChannelID(grant_doc_num, appno_doc_num));
            /* if(openAnalyticsBar === false || openChartBar === false) {
                openAnalyticsAndCharBar()
            } */
          } else { 
            resetAll() 
            if(selectedCategory == 'restore_ownership') {
              dispatch(setAssetTypesPatentsSelected([]))
              setSelectItems([])
            }  
          }
        },
        [ dispatch,  selectedAssetsPatents, selectedRow ],
      );

    const resetAll = useCallback(() => {
        setSelectedRow([])
        dispatch(setAssetsIllustration(null))
        dispatch(setAssetsIllustrationData(null))
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setAssetFamily([]))
        dispatch(setFamilyItemDisplay({}))
        dispatch(setChannelID(''))
        dispatch(setConnectionBoxView(false))
        dispatch(setPDFView(false))
    
        dispatch(toggleUsptoMode(false))
        dispatch(toggleLifeSpanMode(true))
        dispatch(toggleFamilyMode(false))
        dispatch(toggleFamilyItemMode(false))
    
        dispatch(setDriveTemplateFrameMode(false))
    
        dispatch(linkWithSheetOpenPanel(false))
        dispatch(linkWithSheetSelectedAsset(null, null))
        dispatch(setLinkAssetData([]))
        dispatch(setLinkAssetListSelected([]))
        dispatch(resetAssetDetails())
        
    }, [dispatch])

    const getTransactionData = (dispatch, rf_id) => {
        setSelectedRow([rf_id])
        dispatch(setChildSelectedAssetsTransactions([rf_id]))
        dispatch(setConnectionBoxView( false ))
        dispatch(setPDFView( false ))
        dispatch(toggleUsptoMode( false ))
        dispatch(toggleFamilyMode( false ))
        dispatch(toggleFamilyItemMode( false ))  
        dispatch(setMainCompaniesRowSelect([]))
		dispatch(setAssetTypeSelectedRow([]))
        dispatch(setAssetTypeCustomerSelectedRow([]))  
        dispatch(setSelectedAssetsTransactions([])) 
        dispatch(setSelectedAssetsPatents([]))
        dispatch(setAssetsIllustration({ type: 'transaction', id: rf_id }))
        //dispatch(getAssetsAllTransactionsEvents(selectedCategory == '' ? '' : selectedCategory, [], [], [], [rf_id]))
    }

    if (assignmentLoading) return <Loader />

    return (
        <Paper className={classes.root} square id={`assets_assignments`}>
            <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedKey={'rf_id'}
            rows={assignments}
            rowHeight={rowHeight}
            headerHeight={rowHeight} 
            columns={COLUMNS}
            defaultSelectAll={selectedAll}
            onSelect={onHandleClickRow}
            onSelectAll={onHandleSelectAll}
            disableHeader={headerRowDisabled} 
            responsive={false}
            noBorderLines={true}
            width={width}
            containerStyle={{ 
                width: '100%',
                maxWidth: '100%'
            }}
            style={{ 
                width: '100%'
            }}/>
        </Paper>
      )
}


export default ChildTable