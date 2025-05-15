import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { Paper, Modal } from '@mui/material'
import copy from 'copy-to-clipboard'
import PatenTrackApi from '../../../../api/patenTrack2'
import PatentrackDiagram from '../../PatentrackDiagram'
import { toggleUsptoMode, toggleFamilyMode, toggleShow3rdParities } from "../../../../actions/uiActions";
import { setAssetsIllustrationLoading, setAssetsIllustrationData, retrievePDFFromServer, getAssetsUSPTO } from '../../../../actions/patentTrackActions2' 
import { setPDFFile, setPDFView, setPdfTabIndex, setConnectionData, setConnectionBoxView } from '../../../../actions/patenTrackActions'
import ErrorBoundary from '../../ErrorBoundary'
import themeMode from '../../../../themes/themeMode';
import axios from 'axios' 

import useStyles from './styles'
import PdfViewer from '../../PdfViewer'
import FullScreen from '../../FullScreen'

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
  onHandleChartBarSize,
  viewOnly,
  pdfModal,
  shareButton,
  usptoButton,
  connectionSelection
 }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ illustrationData, setIllustrationData ] = useState()
  const [ click, setClick ] = useState(0) 
  const [ lineId, setLineId ] = useState(0)
  const [ linkId, setLinkId ] = useState(null)
  const [isUsptoClicked, setIsUsptoClicked] = useState(false);
  const targetRef = useRef()
  const [ fullModalScreen, setFullModalScreen ] = useState(false)
  const [ parent_width, setParentWidth ] = useState(0)
  const [ bottomToolbarPosition, setBottomToolbarPosition ] = useState(0)
  const [ topPosition, setTopPosition ] = useState(0)  
  const screenHeight = useSelector(state => state.patenTrack.screenHeight)
  const usptoMode = useSelector(state => state.ui.usptoMode)
  const showThirdParties = useSelector(state => state.ui.showThirdParties)
  const isLoadingAssetIllustration = useSelector(state => state.patenTrack2.loadingAssetIllustration)
  const assetIllustrationData = useSelector(state => state.patenTrack2.assetIllustrationData)
  const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
  const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
  const USPTO = useSelector(state => state.patenTrack2.assetUSPTO);

  const fullScreenItems = [
    {
      id: 1,
      label: '',
      component: PdfViewer,
      display: false,
      fullScreen: false,
      resize: false,
      standalone: true,
    }
  ] 
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
            dispatch(retrievePDFFromServer(data.line[0]))
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

  useEffect(() => {
    if(assetIllustrationData != null){
      setIllustrationData(assetIllustrationData)
    }
  }, [assetIllustrationData])

  useEffect(() => {
    if(isUsptoClicked && USPTO && USPTO.url) {
      window.open(USPTO.url, "_blank");
    }
  }, [isUsptoClicked, USPTO])

  const handlePdfView = useCallback((obj) => {
    if (Object.keys(obj).length > 0 && typeof obj.document_file != 'undefined') {
      /* if( chartsBar === false ) {
        chartsBarToggle(!chartsBar)
      } */
      if(typeof pdfModal !== 'undefined' && pdfModal == true) {
        setFullModalScreen(true)
      }
      dispatch(
        setPDFView(true)
      )
      if(obj.document_file.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document_file == "" && obj.ref_id > 0)) {
        dispatch(retrievePDFFromServer(obj))
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
      alert('Please activate your account first.')
    } else {
      if (typeof viewOnly == 'undefined' && obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
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
  }


  const handleConnectionBox = useCallback((obj) => {    
    if (typeof viewOnly == 'undefined' && typeof obj.popup != 'undefined' ) { 
      setLineId(obj.id)
      if((linkId != obj.popuptop) || (obj.id != lineId && linkId == obj.popuptop) ) {
        setLinkId(obj.popuptop)
        setClick(1)
        if(typeof pdfModal !== 'undefined' && pdfModal == true) {
          setFullModalScreen(true)
        }
        dispatch(
          toggleUsptoMode(false)
        )
        dispatch(
          setPDFView(true)
        )
        if(obj.document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document1 == "" && obj.rf_id > 0) ) {          
          dispatch(retrievePDFFromServer(obj))
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
          setPdfTabIndex(2)
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
      }
    }
  }, [ linkId, click, dispatch ])

  const handleUSPTO = useCallback((usptoMode) => {
    if(typeof viewOnly == 'undefined') {
      if(assetIllustration != null ) {
        if (assetIllustration.type === 'patent') {
          setIsUsptoClicked(true)
          dispatch(getAssetsUSPTO(1, assetIllustration.id, assetIllustration.flag));
        } else if (assetIllustration.type === 'transaction') {
          setIsUsptoClicked(true)
          dispatch(getAssetsUSPTO(0, assetIllustration.id));
        }
      } 
      /* dispatch(
        toggleUsptoMode(usptoMode)
      )
      if(usptoMode === true) {
        setLinkId(null)
        setLineId(0)
        dispatch(
          setConnectionBoxView(false)
        )
        dispatch(
          setConnectionData({})
        )
        checkChartAnalytics(null, null, true)
      } else {
        checkChartAnalytics(null, null, true)
      } */
    }    
  }, [ chartsBar, analyticsBar, getAssetsUSPTO, assetIllustration, dispatch ])

  const handleToggleParties = useCallback((flag) => {
    dispatch(
      toggleShow3rdParities(flag)
    )
  },[ dispatch ])

  return (
    <Paper className={classes.root} square>           
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
                  shareButton={shareButton}
                  usptoButton={usptoButton}
                  connectionSelection={connectionSelection}
                /> 
                {
                  typeof pdfModal !== 'undefined' && pdfModal === true && fullScreen === true && (
                    <FullScreen 
                      componentItems={fullScreenItems} 
                      showScreen={fullModalScreen} 
                      setScreen={setFullModalScreen}
                    />
                  ) 
                }
              </ErrorBoundary>                          
            )
          )
        }
      </div>
    </Paper>
  )
}

export default IllustrationContainer