import React, { useState, useEffect, useRef } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useSelector } from 'react-redux'
import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import { Close } from '@mui/icons-material'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
/* import PDFViewer from 'pdf-viewer-reactjs'
import { Document, Page } from 'react-pdf'
import RenderPDF from './RenderPDF' */
import {checkFileContent} from '../../../utils/html_encode_decode'
import { connect } from 'react-redux'
import { setPDFFile,  setPDFView, setPdfTabIndex, setPDFViewModal } from '../../../actions/patenTrackActions'
import { Typography } from '@mui/material'

/*let pdfFile = "";*/

function PdfViewer(props) {
  const viewerRef = useRef();
  const { pdfTab, setPdfTabIndex } = props
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ mainPdf, setMainPdf ] = useState('about:blank')
  const [ formPdf, setFormPdf ] = useState('about:blank')
  const [ agreementPdf, setAgreementPdf ] = useState('about:blank')
  const [ showTabs, setShowTabs ] = useState(true)
  const [ fullView, setFullView ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState('')
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  /* const activeMenuButton = useSelector(state =>  state.patenTrack2.activeMenuButton ) */
  
  const checkHeight = (pdfTab) => {
    //const containerName = pdfTab == 2 || pdfTab == 3 ? 'iframe_main' : pdfTab == 0 ? 'iframe_agreement' : 'iframe_form'
    const parentElement = viewerRef.current
    const iframeElement = parentElement.querySelector(`iframe`)
    if(iframeElement != null) {
        /* const height = props.fullScreen === false ? parentElement.parentNode.clientHeight : ( props.pdfFile.agreement == '' || props.pdfFile.agreement == null) ?  window.innerHeight : parentElement.clientHeight */
      const height =  window.innerHeight 
      iframeElement.style.height =  `${typeof props.show_tab != undefined ? height - 97 : height - 43}px` 
      parentElement.style.height = '100%'
    }    
  } 
  
  useEffect(() => {
    if(typeof props.show_tab != undefined) {
      setShowTabs(props.show_tab)
    }
  }, [ props ])

  useEffect(()=> {     
    if(props.pdfView == 'true') {
      setFullView(classes.fullView) 
    }
    if(props.pdfFile) {
      /* setMainPdf(props.pdfFile.document != '' ? props.pdfFile.document : 'about:blank')
      setFormPdf(props.pdfFile.document != '' ? props.pdfFile.form : 'about:blank')
      setAgreementPdf(props.pdfFile.document != '' ? props.pdfFile.agreement : 'about:blank')  */    
      const checkFileExist = async() => {
        if(props.pdfFile.document != '') {
          await checkFindData(props.pdfFile.document, setMainPdf)
        }

        if(props.pdfFile.form != '') {
          await checkFindData(props.pdfFile.form, setFormPdf)
        }

        if(props.pdfFile.agreement != '') {
          await checkFindData(props.pdfFile.agreement, setAgreementPdf)
        }
      }
      checkFileExist()
      
    }
  },[ classes.fullView, props.pdfFile, props.pdfView ])

  useEffect(() => {
    if(props.resize === true) {
      checkHeight(pdfTab)
    }
  }, [props, pdfTab]) 


  const checkFindData = async(file, callBack) => {
    const data = await checkFileContent(file)
    if((data.indexOf('AccessDenied') == -1 || data.indexOf('Access Denied') == -1) && data.indexOf('<Error>') == -1) {
      callBack(file)
      setErrorMessage('')
    } else {
      setErrorMessage('We are sorry, but this request is temporarily unservable. Please try a different request.')
    }
  }
  

  const closeViewer = () => {
    if(props.display === "false") {
      props.setPDFFile({ document: '', form: '', agreement: '' })
      props.setPDFView(false)
      props.setPdfTabIndex(0)  
    } else {
      props.setPDFViewModal(false)
    }
  }

  const handleClickOpenFullscreen = () => {
    props.setPDFViewModal(true)

  }

  /* const RenderPDF = ({file, callBack, pageNumber, numPages, id}) => {
    return (
      <div id={id} style={{height:'100%', overflow:'auto'}}>
        <Document
          file={file}
          onLoadSuccess={callBack}
        >
          {
          Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ),
          )
          }
        </Document>
        
      </div>
    )
  } */

  
  return (
    <div
      className={classes.pdfContainer}
    >
      <div className={`${classes.pdfWrapper} ${fullView}`} id={'pdfViewer'} ref={viewerRef}>
        {
          props.display === "true" && <IconButton onClick={closeViewer} size="small" className={classes.close}>
            <Close />
          </IconButton>
        }
        {
          props.display === "false" && <IconButton size="small" className={classes.fullscreenBtn} onClick={handleClickOpenFullscreen}>
          <FullscreenIcon />
          </IconButton>
        }
        
        <div className={classes.container}>
          {
            errorMessage != '' && (
              <Typography
                variant="body2" gutterBottom
              >
                {
                  errorMessage
                }
              </Typography>
            )
          }
          {
            pdfTab === 1 && formPdf != 'about:blank'
            ?
            <iframe id={'iframe_form'} title='form iframe' className={classes.outsource} onLoad={() => checkHeight(1)} src={formPdf}/>
            :
            pdfTab === 0 && agreementPdf != 'about:blank' 
            ? 
            <iframe id={'iframe_agreement'} title='agreement iframe' onLoad={() => checkHeight(0)} className={classes.outsource} src={agreementPdf}/>
            :
            <iframe id={'iframe_main'} title='main iframe' onLoad={() => checkHeight(2)} className={classes.outsource} src={mainPdf}/>
          }   
        </div>
        {
          pdfTab < 3 && showTabs === true && (mainPdf != 'about:blank' || formPdf != 'about:blank' ||  agreementPdf != 'about:blank' )
          ?
            <Tabs
              value={pdfTab}
              onChange={(e, id) => setPdfTabIndex(id)}
              className={classes.tabs}
              variant={'scrollable'}
            > 
              {
                [ 'Agreement', 'Form', 'Main' ].map((tab) => (
                  <Tab
                    key={tab}
                    label={tab}
                    className={classes.tab}
                  />
                )) 
              }
            </Tabs>
          :
          ''
        }        
      </div>
    </div>
  )
}


const mapStateToProps = state => {
    return {
      pdfTab: state.patenTrack.pdfTab,
      pdfFile: state.patenTrack.pdfFile,
      pdfView: state.patenTrack.pdfView
    }
}

const mapDispatchToProps = {
  setPDFFile,
  setPDFView,
  setPDFViewModal,
  setPdfTabIndex  
}

export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer)