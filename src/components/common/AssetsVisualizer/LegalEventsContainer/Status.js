import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import Paper from '@mui/material/Paper'
import themeMode from '../../../../themes/themeMode'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import PatenTrackApi from '../../../../api/patenTrack2'
import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import CircularProgress from '@mui/material/CircularProgress'
import Loader from '../../Loader'

import useStyles from './styles'
import { SettingsInputComponentSharp } from '@mui/icons-material'

const options = { 
    height: '100%',
    stack: true,
    zoomKey: 'ctrlKey',
    moveable: true,
    zoomable: true,
    horizontalScroll: true,
    verticalScroll: true,
    zoomFriction: 30,
    zoomMin: 1000 * 60 * 60 * 24 * 7,  
    
}
const DATE_FORMAT = 'MMM DD, YYYY'
 
const getTemplateContent = (item, icons) => {   
  let status = item.status, icon = ''; 
  switch(status.trim()) {
    case "\"Decision on Petition Denied, Reexam Request Denied, Terminated\"":
      status = "Decision on<br/>Petition Denied,<br/>Reexam Request</br/>Denied, Terminated"
    break;
    case "Abandoned  --  After Examiner's Answer or Board of Appeals Decision":
      status = "Abandoned  --  After<br/>Examiner's Answer<br/>or Board of Appeals<br/>Decision"
    break;
    case "Abandoned  --  Failure to Pay Issue Fee":
      status = "Abandoned  --<br/>Failure to Pay Issue<br/>Fee"
    break;
    case "Abandoned  --  Failure to Respond to an Office Action":
      status = "Abandoned  --<br/>Failure to Respond<br/>to an Office Action"
    break;
    case "Abandoned  --  File-Wrapper-Continuation Parent Application":
      status = "Abandoned  --File-Wrapper-<br/>Continuation Parent<br/>Application"
    break;
    case "Abandoned  --  Incomplete (Filing Date Under Rule 53 (b) - PreExam)":
      status = "Abandoned  --<br/>Incomplete (Filing<br/>Date Under Rule<br/>53 (b) - PreExam)"
    break;
    case "Abandoned  --  Incomplete Application (Pre-examination)":
      status = "Abandoned  --<br/>Incomplete Application<br/>(Pre-examination)"
    break;
    case "ABANDONED - RESTORED":
      status = "ABANDONED -<br/>RESTORED"
    break;
    case "Abandonment for Failure to Correct Drawings/Oath/NonPub Request":
      status = "Abandonment for<br/>Failure to Correct<br/>Drawings/Oath/<br/>NonPub Request"
    break;
    case "Advisory Action Mailed":
      status = "Advisory Action<br/>Mailed"
    break;
    case "Allowed -- Notice of Allowance Not Yet Mailed":
      status = "Allowed -- Notice<br/>of Allowance Not<br/>Yet Mailed"
    break;
    case "Amendment / Argument after Board of Appeals Decision":
      status = "Amendment /<br/>Argument after<br/>Board of Appeals<br/>Decision"
    break;
    case "Amendment after notice of appeal":
      status = "Amendment after<br/>notice of appeal"
    break;
    case  "Appeal Brief (or Supplemental Brief) Entered and Forwarded to Examiner":
      status = "Appeal Brief<br/>(or Supplemental<br/>Brief) Entered and Forwarded to<br/>Examiner"
    break;
    case "Appeal Brief Filed (or Remand from Board) - Awaiting Examiner Action":
      status = "Appeal Brief<br/>Filed (or Remand<br/>from Board) -<br/>Awaiting Examiner<br/>Action"
    break;
    case "Appeal Dismissed / Withdrawn":
      status = "Appeal Dismissed /<br/>Withdrawn"
    break;
    case "Appeal Ready for Review":
      status = "Appeal Ready<br/>for Review"
    break;
    case "Application Dispatched from Preexam, Not Yet Docketed":
      status = "Application<br/>Dispatched from<br/>Preexam, Not<br/>Yet Docketed"
    break;
    case "Application Involved in Court Proceedings":
      status = "Application<br/>Involved in Court<br/>Proceedings"
    break;
    case "Application Returned back to Preexam":
      status = "Application<br/>Returned back<br/>to Preexam"
    break;
    case "Application Undergoing Preexam Processing":
      status = "Application Undergoing Preexam<br/>Processing"
    break;
    case  "AWAITING RESPONSE FOR INFORMALITY, FEE DEFICIENCY OR CRF ACTION":
      status = "AWAITING<br/>RESPONSE FOR<br/>INFORMALITY, FEE<br/>DEFICIENCY OR<br/>CRF ACTION"
    break;
    case "Awaiting TC Resp, Issue Fee Payment Received":
      status = "Awaiting TC Resp,<br/>Issue Fee Payment<br/>Received"
    break;
    case "Awaiting TC Resp, Issue Fee Payment Verified":
      status = "Awaiting TC Resp,<br/>Issue Fee Payment<br/>Verified"
    break;
    case "Awaiting TC Resp., Issue Fee Not Paid":
      status = "Awaiting TC Resp.,<br/>Issue Fee Not Paid"
    break;
    case "Board of Appeals Decision Rendered":
      status = "Board of Appeals<br/>Decision Rendered"
    break;
    case "Board of Appeals Decision Rendered after Request for Reconsideration": 
      status =  "Board of Appeals<br/>Decision Rendered<br/>after Request for<br/>Reconsideration"
    break;
    case "BPAI decision on rehearing - Decision is final and appealable":
      status =  "BPAI decision <br/>on rehearing -<br/>Decision is final <br/>and appealable"
    break; 
    case "BPAI decision: New ground of rejection (R. 1.977(b))":
      status =  "BPAI decision: <br/>New ground <br/>of rejection<br/>(R. 1.977(b))"
    break; 
    case "BPAI RETURN BEFORE APPEAL":
      status = "BPAI RETURN<br/>BEFORE APPEAL"
    break;
    case "CAFC Decision Remanded to PTAB":
      status = "CAFC Decision<br/>Remanded to PTAB"
    break;
    case "Case docketed to examiner":
      status = "Case docketed<br/>to examiner"
    break;
    case "Comments after action closing prosecution - owner - timely":
      status = "Comments after<br/>action closing<br/>prosecution - <br/>owner - timely"
    break;
    case "Comments after non-final action - requester- timely":
      status =  "Comments after<br/>non-final action -<br/>requester- timely"
    break;
    case "Completion of pre-processing - released to TC":
      status = "Completion of<br/>pre-processing -<br/>released to TC"
    break;
    case "Court Proceedings Terminated":
      status = "Court <br/>Proceedings<br/>Terminated"
    break;
    case "Decision on Appeal Rendered by Board":
      status = "Decision on <br/>Appeal Rendered <br/>by Board"
    break;
    case "Decision vacating reexam":
      status = "Decision vacating<br/>reexam"
    break;
    case "Defective Appeal Brief":
      status = "Defective<br/>Appeal Brief"
    break;
    case "Defensive Publication or SIR File":
      status = "Defensive<br/>Publication or<br/>SIR File"
    break;
    case "Determination - Reexamination Ordered":
      status = "Determination -<br/>Reexamination<br/>Ordered"
    break;
    case "Docketed New Case - Ready for Examination":
      status = "Docketed New <br/>Case - Ready <br/>for Examination"
    break;
    case "Docketed New SE -- Ready For Examination":
      status = "Docketed New <br/>SE -- Ready For<br/>Examination"
    break;
    case "Ex parte Quayle Action Mailed":
      status = "Ex parte Quayle<br/>Action Mailed"
    break;
    case "Examiner's answer":
      status = "Examiner's <br/>answer"
    break;
    case "Examiner's Answer Mailed":
      status = "Examiner's <br/>Answer Mailed"
    break;
    case "Examiner's Answer to Appeal Brief Mailed":
      status = "Examiner's <br/>Answer to Appeal<br/>Brief Mailed"
    break;
    case "Examiner's Answer to Reply Brief or Response to Remand Mailed":
      status = "Examiner's<br/>Answer to Reply <br/>Brief or Response <br/>to Remand<br/>Mailed"
    break;
    case "Expressly Abandoned  --  During Examination":
      status = "Expressly<br/>Abandoned  -- <br/>During <br/>Examination"
    break;
    case "Expressly Abandoned  --  During Publication Process":
      status = "Expressly<br/>Abandoned  -- <br/>During Publication<br/>Process"
    break;
    case "Final Action Mailed":
      status = "Final Action <br/>Mailed"
    break;
    case "Final Rejection Mailed":
      status = "Final Rejection<br/>Mailed"
    break;
    case "Hague Application under International Review":
      status = "Hague Application<br/>under International<br/>Review"
    break;
    case "Incomplete Ex Parte Reexam (Filing Date Vacated)":
      status = "Incomplete <br/>Ex Parte Reexam<br/>(Filing Date Vacated)"
    break;
    case "Informal response / amendment after non-final action":
      status = "Informal response /<br/>amendment after<br/>non-final action"
    break;
    case "Intent to Issue Certificate based on Supplemental Exam":
      status = "Intent to Issue<br/>Certificate based <br/>on Supplemental<br/>Exam"
    break;
    case "Interference -- Decision on Priority Rendered by Board of Interferences":
      status = "Interference --<br/>Decision on Priority<br/>Rendered by Board <br/>of Interferences"
    break;
    case "Interference -- Declared by Board of Interferences":
      status = "Interference --<br/>Declared by Board <br/>of Interferences"
    break;
    case "Interference -- Initial Memorandum":
      status = "Interference -- <br/>Initial Memorandum"
    break;
    case "Interference-Dispatch to Examiner":
      status = "Interference-<br/>Dispatch to<br/>Examiner"
    break;
    case "International Application Withdrawn":
      status = "International<br/>Application<br/>Withdrawn"
    break;
    case "Missassigned Application Number":
      status = "Missassigned<br/>Application Number"
    break;
    case "Non Final Action Mailed":
      status =  "Non Final <br/>Action Mailed"
    break;
    case "Non-Final Action Mailed":
      status = "Non-Final <br/>Action Mailed"
    break;
    case "Notice of Allowance Mailed -- Application Received in Office of Publications":
      status = "Notice of <br/>Allowance Mailed -- Application Received<br/>in Office of Publications"
    break;
    case "Notice of Appeal - owner":
      status = "Notice of <br/>Appeal - owner"
    break;
    case "Notice of Appeal Filed":
      status = "Notice of <br/>Appeal Filed"
    break;
    case "Notice of Intent to Issue Reexam Certificate":
      status = "Notice of <br/>Intent to Issue<br/>Reexam Certificate"
    break;
    case "On Appeal -- Awaiting Decision by the Board of Appeals":
      status = "On Appeal --<br/>Awaiting Decision <br/>by the Board <br/>of Appeals"
    break;
    case "Oral hearing request - owner":
      status = "Oral hearing<br/>request - owner"
    break;
    case  "Oral hearing request - requester":
      status = "Oral hearing <br/>request - requester"
    break;
    case  "Patent Expired Due to NonPayment of Maintenance Fees Under 37 CFR 1.362":
      status = "Patent Expired <br/>Due to NonPayment<br/>of Maintenance Fees<br/>Under 37 CFR 1.362"
    break;
    case "Patent owner request for rehearing after BPAI decision (R. 1.979(a)) - timely":
      status = "Patent owner<br/>request for rehearing<br/>after BPAI decision<br/>(R. 1.979(a)) - timely"
    break;
    case "Patent owner response after BPAI decision with new ground of rejection (R. 1.977(b))":
      status = "Patent owner<br/>response after BPAI<br/>decision with new<br/>ground of rejection<br/>(R. 1.977(b))"
    break;
    case "Patented Case":
      status = "Patented Case"
    break;
    case "Patented File - (Old Case Added for File Tracking Purposes)":
      status = "Patented File - <br/>(Old Case Added <br/>for File Tracking<br/>Purposes)"
    break;
    case "PCT - Dispatch to TC Chapter I case":
      status = "PCT - Dispatch to <br/>TC Chapter I case"
    break;
    case "PCT - Docketed Chapter 1 Case":
      status = "PCT - Docketed<br/>Chapter 1 Case"
    break;
    case "PCT - Formal Demand Recorded":
      status = "PCT - Formal<br/>Demand Recorded"
    break;
    case "PCT - International Search Report Mailed to IB":
      status =  "PCT - International<br/>Search Report <br/>Mailed to IB"
    break;
    case "PCT - IPE Report (409) Count":
      status = "PCT - IPE Report<br/>(409) Count"
    break;
    case "PCT - IPER (International Preliminary Examination Report) 409-416 Mailed":
      status = "PCT - IPER<br/>(International Preliminary Examination Report)<br/>409-416 Mailed"
    break;
    case "PCT - ISA Form 203 Mailed, Non-Establishment of Search Report":
      status = "PCT - ISA Form <br/>203 Mailed,<br/>Non-Establishment <br/>of Search Report"
    break;
    case "PCT - ISA Form Mailed":
      status = "PCT - ISA <br/>Form Mailed"
    break;
    case "PCT - Ready for IPER or second IPE opinion":
      status = "PCT - Ready for <br/>IPER or second <br/>IPE opinion"
    break;
    case "PCT - Receipt of IPE Demand":
      status = "PCT - Receipt of <br/>IPE Demand"
    break;
    case "PCT - Response to PCT ISA Form Entered":
      status = "PCT - Response <br/>to PCT ISA Form<br/>Entered"
    break;
    case "PCT - Waiting for EPO Search Report":
      status = "PCT - Waiting for<br/>EPO Search Report"
    break;
    case "PCT Search report ready for mailing":
      status = "PCT Search report<br/>ready for mailing"
    break;
    case "Petition received re\":\" Denial of a request for reexamination":
      status = "Petition received <br/>re: Denial of a<br/>request for<br/>reexamination"
    break;
    case "Petition Received RE: Denial of Reexamination Request":
      status = "Petition Received <br/>RE: Denial of<br/>Reexamination<br/>Request"
    break;
    case "Pre-Interview Communication Mailed":
      status = "Pre-Interview<br/>Communication<br/>Mailed"
    break;
    case "Pre-PALM Application Added to Data Base":
      status = "Pre-PALM<br/>Application Added <br/>to Data Base"
    break;
    case "Preprocessing Terminated--Inter Partes Reexam":
      status = "Preprocessing<br/>Terminated--Inter<br/>Partes Reexam"
    break;
    case "Prosecution Suspended":
      status =  "Prosecution<br/>Suspended"
    break;
    case "Provisional Application Expired":
      status = "Provisional<br/>Application <br/>Expired"
    break;
    case "Publications -- Issue Fee Payment Received":
      status = "Publications -- <br/>Issue Fee <br/>Payment Received"
    break;
    case "Publications -- Issue Fee Payment Verified":
      status = "Publications -- <br/>Issue Fee <br/>Payment Verified"
    break;
    case "Ready for examiner action after owner/requester comments periods after ACP":
      status = "Ready for examiner<br/>action after owner<br/>requester comments<br/>periods after ACP"
    break;
    case "Ready for examiner action after owner/requester N/AP and appropriate briefs":
      status = "Ready for examiner<br/>action after owner<br/>requester N/AP and<br/>appropriate briefs"
    break;
    case "Ready for examiner action after response/comments after nonfinal":
      status =  "Ready for examiner<br/>action after<br/>response/comments<br/>after nonfinal"
    break;
    case "Ready for Reexam -- Certificate in IFW":
      status = "Ready for Reexam <br/>-- Certificate in IFW"
    break;
    case "Receipt of Orig or Corrected Ex Parte Reexam Request\n":
      status = "Receipt of Orig<br/>or Corrected <br/>Ex Parte Reexam<br/>Request"
    break;
    case "Reexam -- Request Ready for Ex Parte Action":
      status = "Reexam -- Request<br/>Ready for Ex Parte<br/>Action"
    break;
    case "Reexam -- Timely Owner's Statement Received in Response to Order":
      status = "Reexam -- Timely<br/>Owner's Statement<br/>Received in Response<br/>to Order"
    break;
    case  "Reexam Assigned to Examiner for Determination":
      status = "Reexam Assigned <br/>to Examiner for<br/>Determination"
    break;
    case "Reexam Ordered Based on Supplemental Examination":
      status = "Reexam Ordered<br/>Based on<br/>Supplemental<br/>Examination"
    break;
    case "Reexam Preprocessing Completed -- Released to Assigned GAU":
      status = "Reexam Preprocessing<br/>Completed --<br/>Released to <br/>Assigned GAU"
    break;
    case "REEXAM TERMINATED - Decision":
      status = "REEXAM TERMINATED -<br/>Decision"
    break;
    case "Reexam Terminated -- In Publications for Issue of a Certificate":
      status = "Reexam Terminated<br/>-- In Publications for<br/>Issue of a Certificate"
    break;
    case "Reexam Terminated -- Notice of Intent to Issue a Reexamination Certificate Mailed":
      status = "Reexam Terminated<br/>-- Notice of Intent to Issue a Reexamination<br/>Certificate Mailed"
    break;
    case "Reexam Terminated -- Previous Order Vacated":
      status = "Reexam Terminated<br/>-- Previous Order<br/>Vacated"
    break;
    case "Reexam Terminated -- Request Denied in Group":
      status = "Reexam Terminated<br/>-- Request Denied <br/>in Group"
    break;
    case  "Reexamination Certificate Issued":
      status = "Reexamination<br/>Certificate Issued"
    break;
    case  "Reexamination SE Certificate":
      status = "Reexamination<br/>SE Certificate"
    break;
    case "Reexamination Suspended":
      status = "Reexamination<br/>Suspended"
    break;
    case "Remand to Examiner from Board of Appeals":
      status = "Remand to <br/>Examiner from <br/>Board of Appeals"
    break;
    case "Renounced-International design application designating the U.S. renounced under the Hague Agreement":
      status = "Renounced-<br/>International design<br/>application designating<br/>the U.S. renounced<br/>under the <br/>Hague Agreement"
    break;
    case  "Reply Brief (or Supplemental Reply Brief) Forwarded to Examiner":
      status = "Reply Brief (or<br/>Supplemental Reply<br/>Brief) Forwarded <br/>to Examiner"
    break;
    case "Reply Brief filed and forwarded to BPAI":
      status = "Reply Brief <br/>filed and forwarded <br/>to BPAI"
    break;
    case "Request for Reconsideration after BPAI Decision":
      status = "Request for<br/>Reconsideration <br/>after BPAI Decision"
    break;
    case "Request for Reexamination Denied":
      status = "Request for <br/>Reexamination<br/>Denied"
    break;
    case "Request Reconsideration after Board of Appeals Decision":
      status = "Request Reconsideration <br/>after Board of Appeals <br/>Decision"
    break;
    case "Respondent brief - requester":
      status = "Respondent brief -<br/>requester"
    break;
    case "Response after Final Action Forwarded to Examiner":
      status = "Response after <br/>Final Action<br/>Forwarded to Examiner"
    break;
    case "Response after Final Action Received":
      status = "Response after <br/>Final Action<br/>Received"
    break;
    case "Response after non-final action - owner - timely":
      status = "Response after<br/>non-final action -<br/>owner - timely"
    break;
    case "Response after Non-Final Action Entered (or Ready for Examiner Action)":
      status = "Response after<br/>Non-Final Action<br/>Entered (or Ready for<br/>Examiner Action)"
    break;
    case "Response to Ex parte Quayle Action Entered and Forwarded to Examiner":
      status = "Response to <br/>Ex parte Quayle<br/>Action Entered and<br/>Forwarded to Examiner"
    break;
    case  "Response to Non-Final Office Action Entered and Forwarded to Examiner":
      status = "Response to<br/>Non-Final Office<br/>Action Entered and<br/>Forwarded to Examiner"
    break;
    case "RO PROCESSING COMPLETED-PLACED IN STORAGE":
      status = "RO PROCESSING<br/>COMPLETED-PLACED <br/>IN STORAGE"
    break;
    case "Rocket Docket":
      status = "Rocket Docket"
    break;
    case "SE ready for Pubs Processing -- Certificate in IFW":
      status = "SE ready for <br/>Pubs Processing --<br/>Certificate in IFW"
    break;
    case "Search report counted":
      status = "Search report<br/>counted"
    break;
    case "Sent to Classification contractor":
      status = "Sent to<br/>Classification<br/>contractor"
    break;
    case "Special New":
      status = "Special New"
    break;
    case "Supplemental Examination Request Filed":
      status = "Supplemental Examination <br/>Request Filed"
    break;
    case "TC Return of Appeal":
      status = "TC Return <br/>of Appeal"
    break;
    case  "Termination of SE Request (No Filing Date)":
      status = "Termination of <br/>SE Request <br/>(No Filing Date)"
    break;
    case "Utility Application Converted into a Provisional Application":
      status = "Utility Application<br/>Converted into a<br/>Provisional Application"
    break;
    case "Utility Application Converted to Provisional Application":
      status = "Utility Application Converted <br/>to Provisional Application"
    break;
    case "Withdraw from issue awaiting action":
      status = "Withdraw from issue<br/>awaiting action"
    break
    case "Withdrawn Abandonment, awaiting examiner action":
      status = "Withdrawn Abandonment,<br/>awaiting examiner action"
    break
  }
  const templateContent = `<div class='first limit'>${status} ${typeof item.anotherStatus != 'undefined' ? '<br/>' + item.anotherStatus : ''}</div><div class='textColumn'>${moment(new Date(item.eventdate)).format(DATE_FORMAT)}</div><div class='absolute icon'>${icon}</div>`
  return templateContent 
} 

const convertDataToItem = (event, icons) => { 
  const item = {
    id: event.id,
    content: event.type == 'background' ? event.status : getTemplateContent(event, icons),
    start: new Date(event.start_date),
    rawData: event,  
    description: event.status,
    collection: [], 
    showTooltip: false
  }  

  if(typeof event.end_date != 'undefined') { 
    item.end =  new Date(event.end_date);  
  } 

  if(typeof event.className != 'undefined') { 
    item.className =  event.className
  } else if(event.status.toLowerCase().indexOf('abandoned') !== -1 || event.status.toLowerCase().indexOf('expire') !== -1) {  
    item.className =  'redBorder'  
  } else {
    item.className =  'yellowBorder' 
  }

  if(event.type == 'background') {
    item.type = event.type
  }
  
  return item
}

var tootlTip = ''
const TIME_INTERVAL = 1000

const Status = ({ number, rawData, updateRawData, standalone }) => {
  const classes = useStyles()
  const timelineRef = useRef()
  const timelineContainerRef = useRef()
  const items = useRef(new DataSet())
  const [display, setDisplay] = useState('block')
  const [ timelineRawData, setTimelineRawData ] = useState([]) 
  const [ allIcons, setAllIcons ] = useState([]) 
  const [ isLoadingTimelineRawData, setIsLoadingTimelineRawData ] = useState(true)
  const [ isLoadingTimelineData, setIsLoadingTimelineData ] = useState(false)
  const [ tooltipItem, setToolTipItem] = useState([])
  const [ timeInterval, setTimeInterval] = useState(null)
  const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
  
  const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  ) 

  useEffect(() => {
      timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
  }, [])

  

  /**
  * on Itemover for the tooltip data
  */

  const onItemover = ({item, event}) => {
    const overItem = items.current.get(item)     
    if(overItem != null) {
        onItemout()
        tootlTip = overItem.rawData.id
        showTooltip(overItem.rawData, event)
    }
  }

  /**
  * on onItemout for the remove tooltip
  */

  const onItemout = () => {
      tootlTip = ''
      resetTooltipContainer()
      setToolTipItem([])
      
      /* clearInterval(timeInterval) */
  }

  const resetTooltipContainer = () => {  
    const findOldToolTip = document.getElementsByClassName('custom_tooltip')
    if( findOldToolTip.length > 0 ) {
      findOldToolTip[0].parentNode.removeChild(findOldToolTip[0])      
    } 
  }


  // Custom ToolTip

  const showTooltip = (item, event) => {     
    setTimeout(() => {
      if(tootlTip === item.id) {      
        const color = isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary
        const height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight;  
        const checkFullScreen = document.getElementsByClassName('fullscreenModal'); 
        const element = checkFullScreen.length > 0 ? checkFullScreen[0].querySelector('#statusTimeline') : document.getElementById('statusTimeline'); 
        let text = item.status;  
        const getPosition = element.getBoundingClientRect(); 
        let tootltipTemplate = `<div class='custom_tooltip' style='background:${isDarkTheme ? themeMode.dark.palette.background.default : themeMode.light.palette.background.default} ;top:${getPosition.y}px;left:${getPosition.x}px;'><h4 style='color:${color};text-align:left;margin:0'>${text}</h4></div>`
        resetTooltipContainer() 
        if(timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
          document.body.insertAdjacentHTML('beforeend',tootltipTemplate)                
        }
      } else {
          resetTooltipContainer()
      }                
    }, TIME_INTERVAL) 
  }


  /**
  * Intial timline items dataset and ref setup
  */
  useEffect(() => {
    timelineRef.current.setOptions(options) 
    timelineRef.current.on('itemover', onItemover)
    timelineRef.current.on('itemout', onItemout)
    return () => {
      timelineRef.current.off('itemover', onItemover) 
      timelineRef.current.off('itemout', onItemout)
      resetTooltipContainer()
    } 
  }, [ onItemover, onItemout ]) 


  const processRawData = useCallback(() => {
    if(rawData.length > 0) {
      setIsLoadingTimelineRawData(false) 
      setTimelineRawData(rawData.main)
      setAllIcons(rawData.icons)
    } else {
      setIsLoadingTimelineRawData(false) 
      setTimelineRawData([])
    }

}, [rawData])

useEffect(() => {
    if(typeof rawData !== 'undefined') {
        if(typeof standalone !== 'undefined' &&  standalone === true) {
            processRawData()
        } else {
            setIsLoadingTimelineRawData(false) 
            if(rawData.main.length > 0) {
                setTimelineRawData(rawData.main)
                setAllIcons(rawData.icons)
            }
        }
    } else {
        
        const getStatusbData = async() => {
            setIsLoadingTimelineRawData(true)
            PatenTrackApi.cancelStatusData()    
            const { data } = await PatenTrackApi.getStatusData(selectedAssetsPatents[1])
            setIsLoadingTimelineRawData(false) 
            if(data !== null && data.main.length > 0 )  {
              setAllIcons(data.icons)

              const allEvents = data.main;
              let grantStatus = true, publishedDate = null, expiredStatus = false, expiredDate = null, patentEndDate = null, patentIndex = -1
              const promises = allEvents.map( (event, index) => {
                if(event.id == 'A') { 
                  publishedDate = event.end_date 
                } else if(event.id == 'B') {
                  grantStatus = true
                  patentEndDate = event.end_date
                  patentIndex = index
                } else if(event.status.toLowerCase().indexOf('expired') !== -1) {
                  expiredStatus = true
                  expiredDate = event.start_date
                }
              })
              await Promise.all(promises)
              if(patentIndex >= 0 && expiredStatus === true && expiredDate != null) {
                allEvents[patentIndex].end_date = expiredDate
                allEvents.push({
                  id: 'C',
                  start_date: expiredDate,
                  end_date: patentEndDate == null ? publishedDate : patentEndDate,
                  eventdate: expiredDate,
                  type: 'background',
                  className: 'grey',
                  status: ''
                })
              }

              setTimelineRawData(allEvents)
              updateRawData(allEvents)
            }
        }
        getStatusbData()
    }
}, [selectedAssetsPatents, rawData])


  useEffect(() => {
    if (isLoadingTimelineRawData) return 
   
    const convertedItems = timelineRawData.map((event) => convertDataToItem(event, allIcons))

    items.current = new DataSet()
    let start = new moment().subtract(2, 'year')
    let end = new moment().add(2, 'year')
    let min = start.format('YYYY-MM-DD'), max = end.format('YYYY-MM-DD') 
    if (convertedItems.length > 0) {      
      convertedItems.map( (item, index) => {
        if(index == 0) {
          min = new moment(item.start).format('YYYY-MM-DD')
          const date = typeof item.rawData.eventdate != 'undefined' && item.rawData.eventdate != '' ? item.rawData.eventdate : item.rawData.end_date
          if(new moment(date).isAfter(max)) {
            max = new moment(date).format('YYYY-MM-DD')
          }
        } else {
          if( new moment(item.start).isBefore(min) ) {
            min = new moment(item.start).format('YYYY-MM-DD')
          } else {
            const date = typeof item.rawData.end_date != 'undefined' && item.rawData.end_date != '' ? item.rawData.end_date : item.rawData.eventdate
            if(new moment(date).isAfter(max)) {
              max = new moment(date).format('YYYY-MM-DD')
            }
          } 
        }        
      })
      start = new moment(min).subtract(3, 'year').format('YYYY-MM-DD')
      end = new moment(max).add(4, 'year').format('YYYY-MM-DD')
      min = start
      max = end
      items.current.add(convertedItems)
      setDisplay('block')      
    } 
    timelineRef.current.setItems(items.current)  
    timelineRef.current.setOptions({ ...options, start, end, min, max  }) 
    
}, [ timelineRawData, allIcons, isLoadingTimelineRawData, timelineContainerRef ])

  return (
        <Paper className={`${classes.timelineRoot} timelineRoot`} square >
            <div
                id={`statusTimeline`}
                style={{ 
                    display: display,
                    filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`,
                }}
                ref={timelineContainerRef}
                className={classes.timelineStatus}
            />
            { isLoadingTimelineRawData && <CircularProgress className={classes.loader} /> }
            { isLoadingTimelineData && <Loader /> }
        </Paper>
    )
} 

export default Status