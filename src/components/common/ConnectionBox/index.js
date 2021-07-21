import React, { useState, useEffect } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { Add, Remove } from '@material-ui/icons'
import moment from 'moment'
import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import { connect } from 'react-redux'
import { setConnectionData,  setConnectionBoxView } from '../../../actions/patenTrackActions'
import PatenTrackApi from '../../../api/patenTrack2';

/*let pdfFile = "";*/

function ConnectionBox(props) {
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ boxData, setBoxData ] = useState({})
  const [ assetData, setAssetData ] = useState({})
  const [ fullView, setFullView ] = useState('')
  const [ visibility, setVisibility] = useState(false)

  useEffect(() => {
    /* if(props.assets) {
      setAssetData(props.assets)
    } */
    if(props.connectionBoxData){
      (async () => {
        const { data } = await PatenTrackApi.getConnectionData(props.connectionBoxData.popuptop)
        const oldAssetsData = props.assets
        oldAssetsData.popup = data.popup
        setAssetData(oldAssetsData)
        setBoxData(data)
      })();
    }
    if(props.connectionBoxView == 'true') {
      setFullView(classes.fullView)
    }
  },[ classes.fullView, props.assets, props.connectionBoxData, props.connectionBoxView ])

  const closeViewer = () => {
    props.setConnectionData({})
    props.setConnectionBoxView(false)
  }

  const ShowText = ({ classes, data }) => {
    return (
      <Typography variant="body2" className={classes}>      
        {data}
      </Typography>
    )
  }

  const dateDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1))
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const RetreieveBoxData = (props) => {
    const info = assetData.popup && assetData.popup.filter(p => {
      return p.id == props.popup.id
    })
    const index = assetData.popup && assetData.popup.findIndex(x => x.id === props.popup.id)
    return(
      <div key={props.keyIndex} className={classes.rootContainer}>
      {
        info && info != null && info.length > 0 && Object.keys(info[0]).length > 0 
        ?
        <>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell className={classes.cellHeading}><ShowText data={info[0].conveyanceText}/></TableCell>
              </TableRow>
              </TableBody>
          </Table>  
          <Table className={classes.table}>
            <TableBody>
            <TableRow>
                <TableCell>
                  <ShowText classes={classes.red} data={`Assignors`}/>
                  {
                    info[0].patAssignorName.map( (assignor, index) =>(
                      <ShowText key={`assignor-${index}`} className={index > 0 && index < info[0].patAssignorName.length ? classes.marginBottom : ''} data={assignor}/>
                    ))
                  }
                </TableCell>
                <TableCell>
                  <ShowText classes={classes.red} data={`Assignees`}/>
                  {
                    info[0].patAssigneeName.map( (assignee, index) =>(
                      <ShowText key={`assignee-${index}`} className={index > 0 && index < info[0].patAssigneeName.length ? classes.marginBottom : ''} data={assignee} />
                    ))
                  }
                </TableCell>
                <TableCell colSpan={2}>
                  <ShowText classes={classes.red} data={`Assignee's Address`}/>
                  {
                    info[0].patAssigneeName.map( (assignee, index) => (
                      <div className={index > 0 && index < info[0].patAssigneeName.length ? classes.marginBottom : ''}>
                        <ShowText data={info[0].patAssigneeAddress1[index]}/>
                        <ShowText data={`${info[0].patAssigneeCity[index]} ${info[0].patAssigneeState[index]} ${info[0].patAssigneePostcode[index]}`}/>
                      </div>
                    ))
                  }                  
                </TableCell>           
              </TableRow>
              <TableRow>
                <TableCell className={classes.fixedWidth}>
                  <ShowText classes={classes.red} data={`Executed`}/>
                  <ShowText data={moment(new Date(info[0].patAssignorEarliestExDate)).format('MMM. DD YYYY')} classes={classes.marginBottom}/>
                  <ShowText classes={classes.red} data={`Recorded`}/>
                  <ShowText data={moment(new Date(info[0].recordedDate)).format('MMM. DD YYYY')}/>                  
                </TableCell>
                <TableCell className={classes.fixedWidth}>    
                  <ShowText classes={classes.red} data={`Lapsed`}/>
                  <ShowText classes={`${classes.marginBottom} ${dateDifference(info[0].patAssignorEarliestExDate, info[0].recordedDate) > 90 ? classes.blue : ''} `} data={`${dateDifference(info[0].patAssignorEarliestExDate, info[0].recordedDate)} days`} />              
                  <ShowText classes={classes.red} data={`Reel/frame`}/>
                  <ShowText data={info[0].displayId}/>
                </TableCell>
                <TableCell colSpan={2}>
                  <ShowText classes={classes.red} data={`Correspondent`}/>
                  <ShowText data={info[0].corrName} classes={classes.marginBottom}/>
                  <ShowText data={info[0].corrAddress1}/>
                  <ShowText data={info[0].corrAddress2}/>
                  <ShowText data={info[0].corrAddress3}/>
                </TableCell>                
              </TableRow>              
            </TableBody>
          </Table>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body2"> 
                    <IconButton onClick={() => setVisibility(!visibility)}>{visibility === false ? <Add /> : <Remove />}</IconButton>  <span className={classes.red}>Properties ({info[0].inventionTitle.length})</span>
                  </Typography>
                </TableCell>
              </TableRow>
              </TableBody>
          </Table>
          <Table className={`${classes.table} ${classes.tablebg}`}>
            <TableHead>
              <TableRow>
                {
                  ['Patent', 'Publication', 'Application', 'PCT International registration'].map((col, index) => (
                    <TableCell key={index}><ShowText data={col}/></TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                visibility === true && info[0].inventionTitle.map((invention, index) => {
                  return (
                    <>
                      <TableRow key={`invention-${index+2}`}>
                        <TableCell><ShowText data={info[0].patNum[index]}/></TableCell>
                        <TableCell><ShowText data={info[0].publNum[index]}/></TableCell>
                        <TableCell><ShowText data={info[0].applNum[index]}/></TableCell>
                        <TableCell><ShowText data={info[0].pctNum[index]}/></TableCell>
                      </TableRow>
                    </>
                  )
                })
              }
            </TableBody>
          </Table>
        </>
        :
        ''
      }
      </div>
    )
  } 
  return (
    <div className={classes.container}>
      {
        Object.keys(boxData).length > 0 &&
        boxData.popup.map((pop, index) => <RetreieveBoxData key={index} keyIndex={pop} popup={pop}/>)
      }                 
    </div>
  )
}


const mapStateToProps = state => {
    return {
      connectionBoxData: state.patenTrack.connectionBoxData,
      connectionBoxView: state.patenTrack.connectionBoxView,
      /*assets: state.patenTrack.assets,*/
    }
}

const mapDispatchToProps = {   
  setConnectionData,
  setConnectionBoxView
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionBox)