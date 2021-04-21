import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Paper, Modal } from '@material-ui/core'

import PatenTrackApi from '../../../../api/patenTrack2'
import PatentrackDiagram from '../../PatentrackDiagram'
import { toggleUsptoMode } from "../../../../actions/uiActions";
import { setAssetsIllustrationLoading } from '../../../../actions/patentTrackActions2' 
import { setPDFFile, setPDFView, setPdfTabIndex, setConnectionData, setConnectionBoxView } from '../../../../actions/patenTrackActions' 

import PdfViewer from '../../../common/PdfViewer'

import axios from 'axios' 

import useStyles from './styles'

const IllustrationContainer = ({ 
  asset, 
  setIllustrationRecord, 
  isFullscreenOpen, 
  gap,
  chartsBar,
  chartsBarToggle,
  checkChartAnalytics,
  onHandleChartBarSize
 }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ illustrationData, setIllustrationData ] = useState()
  const targetRef = useRef()
  const pdfViewModal = useSelector(state => state.patenTrack.pdfViewModal)
  const showThirdParties = useSelector(state => state.ui.showThirdParties)  
  const isLoadingAssetIllustration = useSelector(state => state.patenTrack2.loadingAssetIllustration)
  const screenHeight = useSelector(state => state.patenTrack.screenHeight)
  const [ parent_width, setParentWidth ] = useState(0)
  const [ bottomToolbarPosition, setBottomToolbarPosition ] = useState(0)
  const [ topPosition, setTopPosition ] = useState(0)   
  
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
      console.log("getIllustration")
      if ( !asset || asset === null ) {
        setIllustrationData( null )
        return null
      } 
      
      dispatch(setAssetsIllustrationLoading(true))
      if (asset.type === 'patent') {
        try {
          const { data } = await PatenTrackApi.getAssetsByPatentNumber(asset.id, axiosCancelToken.token)
          setIllustrationData(data != '' ? data : null)
          if(setIllustrationRecord) { setIllustrationRecord(data) }
        } catch (error) { if (axios.isCancel(error)) {} else { throw error } }

      } else if (asset.type === 'transaction') {
        try {
          const { data } = await PatenTrackApi.getCollectionIllustration(asset.id, axiosCancelToken.token)
          setIllustrationData(data != '' ? data : null)
          if(setIllustrationRecord) { setIllustrationRecord(data) }
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
    if (typeof obj.document_file != 'undefined') {
      /* if( chartsBar === false ) {
        chartsBarToggle(!chartsBar)
      } */
      dispatch(
        setPDFView(true)
      )
      dispatch(
        setPDFFile(
          { 
            document: obj.document_file, 
            form: obj.document_form, 
            agreement: obj.document_agreement 
          }
        )
      )
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
      alert('No document found!')
    }
  }, [chartsBar] )

  const handleShare = async (obj) => {
    if (obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
      let form = new FormData()
      form.append('assets', obj.original_number)
      form.append('type', 2)

      const res = await PatenTrackApi.shareIllustration(form)
      if (typeof res == 'object') {
        let shareURL = res.data
        if (shareURL.indexOf('share') >= 0) {
          /**
           * just for temporary replacing
           */
          shareURL = shareURL.replace('https://share.patentrack.com','http://167.172.195.92:3000')
          window.open(shareURL,'_BLANK')
          //dispatch(setAssetShareURL(shareURL));
        }
      }
    }
  }
  
  const handleComment = (obj) => {
    console.log('handleComment ', obj)
  }

  const handleConnectionBox = useCallback((obj) => {
    if (typeof obj.popup != 'undefined') {
      dispatch(
        setPDFView(true)
      )
      dispatch(
        setPDFFile(
          { 
            document: obj.document1, 
            form: obj.document1_form, 
            agreement: obj.document1_agreement 
          }
        )
      )
      dispatch(
        setPdfTabIndex(0)
      )
      dispatch(
        setConnectionData(obj)
      )
      dispatch(
        setConnectionBoxView(true)
      )
      checkChartAnalytics({ 
        document: obj.document1, 
        form: obj.document1_form, 
        agreement: obj.document1_agreement 
      }, obj)  
    }
  }, [ dispatch ])

  const handleUSPTO = useCallback((usptoMode) => {
    dispatch(
      toggleUsptoMode(usptoMode)
    )
    if(usptoMode === true) {
      dispatch(
        setConnectionBoxView(false)
      )
      checkChartAnalytics(null, null, true)
    }
  }, [ dispatch ])

  return (
    <div className={classes.root}>
      {
        pdfViewModal &&
        <Modal open={pdfViewModal} className={classes.fullscreenChartsModal} >
          <Paper className={classes.fullscreenCharts} square>
            <PdfViewer display={'true'} />
          </Paper>
        </Modal>
      }      
      <div className={classes.forceStrech} ref={targetRef}>
        {
          isLoadingAssetIllustration ?
          <CircularProgress /> :
          (
            illustrationData != null && (
              <PatentrackDiagram 
                data={illustrationData} 
                connectionBox={handleConnectionBox} 
                comment={handleComment} 
                share={handleShare} 
                pdfView={handlePdfView} 
                uspto={handleUSPTO}
                titleTop={topPosition} 
                toolbarBottom={bottomToolbarPosition} 
                parentWidth={parseInt(parent_width)} 
                key={illustrationData + '_' + Math.random()} 
                gap={gap}
                showThirdParties={showThirdParties}
                />             
            )
          )
        }
      </div>
    </div>
  )
}

export default IllustrationContainer