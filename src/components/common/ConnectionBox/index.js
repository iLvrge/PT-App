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
import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import { connect } from 'react-redux'
import { setConnectionData,  setConnectionBoxView } from '../../../actions/patenTrackActions'

/*let pdfFile = "";*/

function CommentBox(props) {
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ boxData, setBoxData ] = useState({})
  const [ assetData, setAssetData ] = useState({})
  const [ fullView, setFullView ] = useState('')
  const [ visibility, setVisibility] = useState(false)

  useEffect(() => {
    if(props.assets) {
      setAssetData(props.assets)
    }
    if(props.connectionBoxData){
      setBoxData(props.connectionBoxData)
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
      <Typography variant="body2">      
        {data}
      </Typography>
    )
  }

  const RetreieveBoxData = (props) => {
    const info = assetData.popup && assetData.popup.filter(p => {
      return p.id == props.popup
    })
    const index = assetData.popup && assetData.popup.findIndex(x => x.id === props.popup)
    return(
      <div key={props.keyIndex}>
      {
        info && info != null && info.length > 0 && Object.keys(info[0]).length > 0 
        ?
        <>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell><ShowText classes={classes} data={info[0].conveyanceText}/></TableCell>
              </TableRow>
              </TableBody>
          </Table>  
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell>
                  <ShowText classes={classes} data={`Execution Date`}/>
                  <ShowText classes={classes} data={info[0].patAssignorEarliestExDate}/>
                </TableCell>
                <TableCell>
                  <ShowText classes={classes} data={`Reel/frame`}/>
                  <ShowText classes={classes} data={info[0].displayId}/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <ShowText classes={classes} data={`Assignors`}/>
                  {
                    info[0].patAssignorName.map( (assignor, index) =>(
                      <ShowText key={`assignor-${index}`} classes={classes} data={assignor}/>
                    ))
                  }
                </TableCell>
                <TableCell>
                  <ShowText classes={classes} data={`Assignee`}/>
                  {
                    info[0].patAssigneeName.map( (assignor, index) =>(
                      <ShowText key={`assignee-${index}`} classes={classes} data={assignor}/>
                    ))
                  }
                  <ShowText classes={classes} data={info[0].patAssigneeAddress1[index]}/>
                  <ShowText classes={classes} data={info[0].patAssigneeCity[index]}/>
                  <ShowText classes={classes} data={info[0].patAssigneeState[index]}/>
                  <ShowText classes={classes} data={info[0].patAssigneePostcode[index]}/>
                </TableCell>
                <TableCell>
                  <ShowText classes={classes} data={`Correspondent`}/>
                  <ShowText classes={classes} data={info[0].corrName}/>
                  <ShowText classes={classes} data={info[0].corrAddress1}/>
                  <ShowText classes={classes} data={info[0].corrAddress2}/>
                  <ShowText classes={classes} data={info[0].corrAddress3}/>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body2"> 
                    <IconButton onClick={() => setVisibility(!visibility)}>{visibility === false ? <Add /> : <Remove />}</IconButton>  Properties ({info[0].inventionTitle.length})
                  </Typography>
                </TableCell>
              </TableRow>
              </TableBody>
          </Table>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {
                  ['Patent', 'Publication', 'Application', 'PCT International registration'].map((col, index) => (
                    <TableCell key={index}><ShowText classes={classes} data={col}/></TableCell>
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
                        <TableCell><ShowText classes={classes} data={info[0].patNum[index]}/></TableCell>
                        <TableCell><ShowText classes={classes} data={info[0].publNum[index]}/></TableCell>
                        <TableCell><ShowText classes={classes} data={info[0].applNum[index]}/></TableCell>
                        <TableCell><ShowText classes={classes} data={info[0].pctNum[index]}/></TableCell>
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
    <Paper className={classes.root} square>
      {/* <span className={classes.close} onClick={closeViewer}><i className={'fal fa-times-circle'}></i></span> */}
      <div className={classes.container}>
        {
          Object.keys(boxData).length > 0 &&
          boxData.popup.map(pop => <RetreieveBoxData key={pop} keyIndex={pop} popup={pop}/>)
        }                 
      </div>  
    </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentBox)