import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { Paper, Modal } from '@mui/material'
import copy from 'copy-to-clipboard'
import PatenTrackApi from '../../../../api/patenTrack2'
import PatentrackDiagram from '../../PatentrackDiagram'
import { toggleUsptoMode, toggleFamilyMode, toggleShow3rdParities } from "../../../../actions/uiActions";
import { setAssetsIllustrationLoading, setAssetsIllustrationData } from '../../../../actions/patentTrackActions2' 
import { setPDFFile, setPDFView, setPdfTabIndex, setConnectionData, setConnectionBoxView } from '../../../../actions/patenTrackActions' 
import { copyToClipboard } from '../../../../utils/html_encode_decode'

import PdfViewer from '../../../common/PdfViewer'
import ErrorBoundary from '../../ErrorBoundary'
import themeMode from '../../../../themes/themeMode';
import axios from 'axios' 

import useStyles from './styles'

const IllustrationContainer = ({ 
  asset, 
  setIllustrationRecord, 
  isFullscreenOpen, 
  gap,
  chartsBar,
  analyticsBar,
  chartsBarToggle,
  checkChartAnalytics,
  setAnalyticsBar,
  setChartBar,
  fullScreen,
  onHandleChartBarSize
 }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ illustrationData, setIllustrationData ] = useState()
  const [ click, setClick ] = useState(0) 
  const [ lineId, setLineId ] = useState(0)
  const [ linkId, setLinkId ] = useState(null)
  const targetRef = useRef()
  const [ parent_width, setParentWidth ] = useState(0)
  const [ bottomToolbarPosition, setBottomToolbarPosition ] = useState(0)
  const [ topPosition, setTopPosition ] = useState(0)  
  const screenHeight = useSelector(state => state.patenTrack.screenHeight)
  const usptoMode = useSelector(state => state.ui.usptoMode)
  const showThirdParties = useSelector(state => state.ui.showThirdParties)
  const isLoadingAssetIllustration = useSelector(state => state.patenTrack2.loadingAssetIllustration)
  const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
  
  const updateContainerWidth = useCallback(() => {
    if (targetRef.current) {
      
      const patentelement = targetRef.current.parentElement
      setBottomToolbarPosition(screenHeight - patentelement.offsetHeight - 170)
      const clientRect = patentelement.getBoundingClientRect()
      setTopPosition(clientRect.top)
      setParentWidth(parseInt(targetRef.current.offsetWidth))
    }
  }, [ screenHeight ])

  
  
  useEffect(() => {
    const axiosCancelToken = axios.CancelToken.source()

    if (targetRef.current) {
      updateContainerWidth()
    }
    const getIllustration = async () => {
      if ( !asset || asset === null ) {
        setIllustrationData( null )
        return null
      } 
      
      dispatch(setAssetsIllustrationLoading(true))
      if (asset.type === 'patent') {
        try {
          const { data } = await PatenTrackApi.getAssetsByPatentNumber(asset.id, asset.flag)
          setIllustrationData(data != '' ? data : null)
          dispatch(setAssetsIllustrationData(data != '' ? data : null))
          if(setIllustrationRecord) { setIllustrationRecord(data) }
        } catch (error) { if (axios.isCancel(error)) {} else { throw error } }

      } else if (asset.type === 'transaction') {
        try {
          const { data } = await PatenTrackApi.getCollectionIllustration(asset.id, axiosCancelToken.token)
          setIllustrationData(data != '' ? data : null)
          dispatch(setAssetsIllustrationData(data != '' ? data : null))
          if(setIllustrationRecord) { setIllustrationRecord(data) }
          if(data.line[0].document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (data.line[0].document1 == "" && data.line[0].ref_id > 0)) {
            data.line[0].rf_id =  data.line[0].ref_id
            retrievePDFFromServer(data.line[0])
          }
          dispatch(setConnectionData(data.line[0]))
          /*dispatch(
            setPDFView(true)
          )
          dispatch(setPDFFile(
            { 
              document: data.line[0].document1, 
              form: data.line[0].document1_form, 
              agreement: data.line[0].document1_agreement 
            }
          ))*/
        } catch (error) { if (axios.isCancel(error)) {} else { throw error } }
      }
      dispatch(setAssetsIllustrationLoading(false)) 
    }

    getIllustration()

    return () => {
      axiosCancelToken.cancel()
    }
  }, [ asset, dispatch])

  const handlePdfView = useCallback((obj) => {
    if (Object.keys(obj).length > 0 && typeof obj.document_file != 'undefined') {
      /* if( chartsBar === false ) {
        chartsBarToggle(!chartsBar)
      } */
      dispatch(
        setPDFView(true)
      )
      if(obj.document_file.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document_file == "" && obj.ref_id > 0)) {
        retrievePDFFromServer(obj)
      } else {
        dispatch(
          setPDFFile(
            { 
              document: obj.document_file, 
              form: obj.document_form, 
              agreement: obj.document_agreement 
            }
          )
        )
      }
      dispatch(
        setPdfTabIndex(0)
      )
      dispatch(
        setConnectionBoxView(false)
      )
      dispatch(
        setConnectionData(null),
      )      
      checkChartAnalytics({ 
        document: obj.document_file, 
        form: obj.document_form, 
        agreement: obj.document_agreement  
      }, null)      
    } else {
      dispatch(
        setPDFView(false)
      )
      dispatch(
        toggleFamilyMode(true)
      )
      dispatch(
        setPDFFile(
          { 
            document: '', 
            form: '', 
            agreement: '' 
          }
        )
      )
      //alert('No document found!')
    }
  }, [chartsBar] )

  const handleShare = async (obj) => {
    if (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE'){
      alert('Message..')
    } else {
      if (obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
        let form = new FormData()
        form.append('assets', JSON.stringify([{asset: obj.original_number, flag: illustrationData.asset_type}]))
        form.append('type', 1)

        const res = await PatenTrackApi.shareIllustration(form)
        if (typeof res == 'object') {
          let shareURL = res.data
          if (shareURL.indexOf('share') >= 0) {
              if(window.confirm("Copy a sharing link to your clipboard.")){
                copy(shareURL)
              }
              
            /**
             * just for temporary replacing
             */
            //shareURL = shareURL.replace('https://share.patentrack.com','http://167.172.195.92:3000')
            //window.open(shareURL,'_BLANK')
            //dispatch(setAssetShareURL(shareURL));
          }
        }
      }
    }
  }
  
  const handleComment = (obj) => {
    console.log('handleComment ', obj)
  }

  const retrievePDFFromServer = async(item) => {    
    PatenTrackApi.cancelDownloadRequest()
    const {data} = await PatenTrackApi.downloadPDFUrl(item.rf_id)

    if(data != null && typeof data.link !== 'undefined') {
        dispatch(
          setPDFFile(    
            { 
              document: data.link, 
              form: data.link, 
              agreement: data.link 
            }
          )
        )
        dispatch(
          setPdfTabIndex(0)
        )
    }
  }

  const handleConnectionBox = useCallback((obj) => {
    setLineId(obj.id)
    if (typeof obj.popup != 'undefined') { 
      if((linkId != obj.popuptop) || (obj.id != lineId && linkId == obj.popuptop) ) {
        setLinkId(obj.popuptop)
        setClick(1)
        dispatch(
          toggleUsptoMode(false)
        )
        dispatch(
          setPDFView(true)
        )
        if(obj.document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document1 == "" && obj.rf_id > 0) ) {          
          retrievePDFFromServer(obj)
        } else {
          dispatch(
            setPDFFile(
              { 
                document: obj.document1, 
                form: obj.document1_form, 
                agreement: obj.document1_agreement 
              }
            )
          )
        }
        
        dispatch(
          setPdfTabIndex(0)
        )
        dispatch(
          setConnectionData(obj)
        )
        dispatch(
          setConnectionBoxView(true)
        )
        /* checkChartAnalytics({ 
          document: obj.document1, 
          form: obj.document1_form, 
          agreement: obj.document1_agreement 
        }, obj)  */ 
        checkChartAnalytics(null, null, true)
      } else {
        setLinkId(null)
        dispatch(
          setConnectionBoxView(false)
        )
        dispatch(
          setConnectionData({})
        )
        dispatch(
          setPDFView(false)
        )
        dispatch(
          setPDFFile(
            { 
              document: '', 
              form: '', 
              agreement: ''
            }
          )
        )
        checkChartAnalytics(null, null, false)
        /* if(click == 1) {
          setClick(2)
          setConnectionBoxView(false)
          setPDFView(true)
          setChartBar(false)
          setAnalyticsBar(true)
        } else if(click == 2) {
          setClick(3)
          setConnectionBoxView(true)
          setPDFView(false)
          setChartBar(true)
          setAnalyticsBar(false)
        } else {
          setClick(1)
          setAnalyticsBar(true)
          setChartBar(true)
          setConnectionBoxView(true)
          setPDFView(true)
        } */
      }
    }
  }, [ linkId, click, dispatch ])

  const handleUSPTO = useCallback((usptoMode) => {
    dispatch(
      toggleUsptoMode(usptoMode)
    )
    if(usptoMode === true) {
      dispatch(
        setConnectionBoxView(false)
      )
      dispatch(
        setConnectionData({})
      )
      checkChartAnalytics(null, null, true)
    } else {
      checkChartAnalytics(null, null, false)
    }
  }, [ dispatch ])

  const handleToggleParties = useCallback((flag) => {
    dispatch(
      toggleShow3rdParities(flag)
    )
  },[ dispatch ])

  return (
    <Paper className={classes.root}>           
      <div className={classes.forceStrech} ref={targetRef}>
        {
          isLoadingAssetIllustration ?
          <CircularProgress /> :
          (
            illustrationData != null && (
              <ErrorBoundary>
                <PatentrackDiagram 
                  data={illustrationData} 
                  chartsBar={chartsBar}
                  analyticsBar={analyticsBar}
                  connectionBox={handleConnectionBox} 
                  comment={handleComment} 
                  share={handleShare} 
                  pdfView={handlePdfView} 
                  uspto={handleUSPTO}
                  titleTop={topPosition} 
                  toolbarBottom={bottomToolbarPosition} 
                  gap={gap}                
                  showThirdParties={showThirdParties}
                  toggleShow3rdParities={handleToggleParties}
                  usptoMode={usptoMode}
                  lineId={lineId}
                  fullScreen={fullScreen}
                  isFullscreenOpen={isFullscreenOpen} 
                  isDarkTheme={isDarkTheme}
                  themeMode={themeMode}
                  copyrights={true}   
                /> 
              </ErrorBoundary>                          
            )
          )
        }
      </div>
    </Paper>
  )
}

export default IllustrationContainer