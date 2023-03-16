import React, { useState, useEffect } from 'react'
 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Add, Remove } from '@mui/icons-material'
import moment from 'moment'
import useStyles from './styles' 
import { connect, useSelector } from 'react-redux'
import { setConnectionData,  setConnectionBoxView } from '../../../actions/patenTrackActions'
import PatenTrackApi from '../../../api/patenTrack2';
import clsx from 'clsx';

/*let pdfFile = "";*/

function ConnectionBox(props) {
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ boxData, setBoxData ] = useState({})
  const [ assetData, setAssetData ] = useState({popup: []})
  const [ fullView, setFullView ] = useState('')
  const [ visibility, setVisibility] = useState(false)
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);
  const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
  const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
  const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
 
  useEffect(() => {
    
    /* if(props.assets) {
      setAssetData(props.assets)
    } */
    if(typeof props.connectionBoxData != 'undefined' || selectedCategory == 'incorrect_names'){
      
      (async () => {
        if(typeof props.assets != undefined ) {
          setAssetData(props.assets)
        }
        if(selectedCategory == 'incorrect_names') {
          const { data } = await PatenTrackApi.getConnectionDataFromAsset(selectedAssetsPatents[1], selectedCompanies)
          console.log('data', data)
          if(typeof data.popup != 'undefined' ){
            setAssetData(data)
            setBoxData(data)
          }
        } else {
          if(typeof props.connectionBoxData != 'undefined' && (typeof props.connectionBoxData.popuptop != 'undefined' ||  (typeof props.connectionBoxData.popup != 'undefined' && props.connectionBoxData.popup.length > 0))) {
            const { data } = await PatenTrackApi.getConnectionData(typeof props.connectionBoxData.popuptop != 'undefined' ? props.connectionBoxData.popuptop : props.connectionBoxData.popup[0])
            if(typeof data.popup != 'undefined' ){
              setAssetData(data)
              setBoxData(data)
            }
          }
        }
      })();
    }
    if(props.connectionBoxView == 'true') {
      setFullView(classes.fullView)
    }

    return (() => {

    })
  },[ classes.fullView, props.assets, props.connectionBoxData, props.connectionBoxView, selectedAssetsPatents ])

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
    const info = typeof props.popup != undefined && assetData != undefined ? assetData.popup && assetData.popup.filter(p => {
      return p.id == props.popup.id
    }) : assetData != undefined ? assetData.popup[0] : null
    
    return (
      <Paper className={classes.rootContainer} square>
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
                      <ShowText key={`assignor-${index}`} classes={index > 0 && index < info[0].patAssignorName.length ? classes.marginBottom : ''} data={assignor.recorded_name}/>
                    ))
                  }
                </TableCell>
                <TableCell>
                  <ShowText classes={classes.red} data={`Assignees`}/>
                  {
                    info[0].patAssigneeName.map( (assignee, index) =>(
                      <ShowText key={`assignee-${index}`} classes={clsx({[classes.marginBottom]: index > 0 && index < info[0].patAssigneeName.length}, {[classes.highlight]: selectedCategory == 'incorrect_names'})} data={assignee.recorded_name} />
                    ))
                  }
                </TableCell>
                <TableCell colSpan={3}>
                  <ShowText classes={classes.red} data={`Assignee's Address`}/>
                  {
                    info[0].patAssigneeName.map( (assignee, index) => (
                      <div  key={`address-${index}`} className={index > 0 && index < info[0].patAssigneeName.length ? classes.marginBottom : ''}>
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
                  <ShowText data={moment(new Date(info[0].patAssignorEarliestExDate + ' 00:00:00')).format('MMM. DD YYYY')} classes={classes.marginBottom}/>
                  <ShowText classes={classes.red} data={`Recorded`}/>
                  <ShowText data={moment(new Date(info[0].recordedDate + ' 00:00:00')).format('MMM. DD YYYY')}/>                  
                </TableCell>
                <TableCell className={classes.fixedWidth}>    
                  <ShowText classes={classes.red} data={`Lapsed`}/>
                  <ShowText classes={`${classes.marginBottom} ${dateDifference(info[0].patAssignorEarliestExDate, info[0].recordedDate) > 90 ? classes.blue : ''} `} data={`${dateDifference(info[0].patAssignorEarliestExDate, info[0].recordedDate)} days`} />              
                  <ShowText classes={classes.red} data={`Reel/frame`}/>
                  <ShowText data={info[0].displayId}/>
                </TableCell>
                <TableCell colSpan={3}>
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
                    <IconButton onClick={() => setVisibility(!visibility)} size="large">{visibility === false ? <Add /> : <Remove />}</IconButton>  <span className={classes.red}>Properties ({info[0].inventionTitle.length})</span>
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
      </Paper>
    );
  } 
  return (
    <div className={classes.container}>
      {
        Object.keys(boxData).length > 0 &&
        boxData.popup.map((popup, index) => <RetreieveBoxData key={`${index} - ${popup.id}`} popup={popup}/>)
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