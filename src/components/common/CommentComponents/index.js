import React, { useState } from 'react'

import { connect } from 'react-redux'
import useStyles from './styles'
import FullWidthSwitcher from '../FullWidthSwitcher'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Loader from '../Loader'
import { getComments, updateComment } from '../../../actions/patenTrackActions'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

function CommentComponents(props) {
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  const [ comment, setComment ] = useState('')
  const isExpanded = props.currentWidget === 'comments'
  const [ timeInterval, setTimeInterval ] =  useState( null )
  const WAIT_INTERVAL = 2000

  const handleCommentChange = (event) => {
      // Clears the previously set timer.
      setComment(event.target.value)
      clearTimeout(timeInterval)
      setTimeInterval(setTimeout(() => {
        let method = 'POST'
        if(props.comments.length > 0) {
          method = 'PUT'
        }
        let type = 'asset', selectedItem = ''
        if(props.selectedRFID !== '') {
          type = 'collection'
          selectedItem = props.selectedRFID
        } else {
          selectedItem = props.currentAsset
        }        
        let data = new FormData()
        data.append('comment', comment)        

        props.updateComment(data, method, type, selectedItem)
      }, WAIT_INTERVAL))
  }
  let commentShow = ''
  /*if(props.comments && props.comments.length > 0){
    commentShow = props.comments[0].comment;
  }
  
  if(props.comments && props.comments.length > 0){
    props.comments.map((comment, index) =>{
      commentShow = comment.comment;
    });
  }
  */
  return (
    <div
      className     = {classes.commentsComponents}
      onMouseOver   = {() => {setShowSwitcher(true)}}
      onMouseLeave  = {() => {setShowSwitcher(false)}}
    >
      <div className={classes.container}>
        <div className={classes.context} >
        <div className={classes.scrollbar}>
          {
          props.isLoading
          ?
            <Loader/>
          :
            <PerfectScrollbar
              options={{
                suppressScrollX: true,
                minScrollbarLength: 20,
                maxScrollbarLength: 30,
              }}
            >
              <Table
                  aria-labelledby="tableTitle"
                  size={'small'}
                  aria-label="short table">            
                <TableBody>
                  {
                    props.comments.length > 0
                    ?
                    props.comments.map( (c, index) => {
                      const createdAt = new Date(c.created_at)
                      return (
                        <TableRow hover tabIndex={-1} key={index}>                      
                          <TableCell align="left" style={{ verticalAlign: 'top' }}>
                            {new Intl.DateTimeFormat('en-US').format(createdAt)}
                          </TableCell>
                          <TableCell align="left">
                            {c.comment}
                          </TableCell>
                        </TableRow>
                      )
                    })
                    :
                    props.record_item != null
                    ?
                    <TableRow hover tabIndex={-1} key={props.record_item.id}>
                      <TableCell align="left" style={{ verticalAlign: 'top',width:'120px' }}>
                        {new Intl.DateTimeFormat('en-US').format(new Date(props.record_item.created_at))}
                      </TableCell>
                      <TableCell align="left" style={{ verticalAlign: 'top' }}>
                      {props.record_item.documents.file !== '' ? <a href={props.record_item.documents.file} target={'_blank'} rel="noopener noreferrer" className={classes.open}><i className={props.record_item.documents.file.toString().toLowerCase().indexOf('.pdf') >= 0 ? 'fal fa-file-pdf' : props.record_item.documents.file.toString().toLowerCase().indexOf('.doc') >= 0 ? 'fal fa-file-word' : 'fal fa-file'}></i></a> : ''} {props.record_item.upload_file !== '' && props.record_item.upload_file !== null ? <a href={props.record_item.upload_file} target={'_blank'} rel="noopener noreferrer" className={classes.open}><i className={props.record_item.upload_file.toString().toLowerCase().indexOf('.pdf') >= 0 ? 'fal fa-file-pdf' : props.record_item.upload_file.toString().toLowerCase().indexOf('.doc') >= 0 ? 'fal fa-file-word' : 'fal fa-file'}></i></a> : ''} {props.record_item.comment}
                      </TableCell>
                    </TableRow>
                    :
                    ''
                  }
                </TableBody>
              </Table>
            </PerfectScrollbar> 
          }
        </div>
      </div>
      </div>
      <FullWidthSwitcher show={showSwitcher} widget={'comments'}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log('COMMENTS',state.patenTrack.comments)
  return {
    comments: state.patenTrack.comments,
    record_item: state.patenTrack.record_item,
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.commentsLoading,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
    selectedRFID: state.patenTrack.selectedRFID,
    currentAsset: state.patenTrack.currentAsset,
  }
}

const mapDispatchToProps = {
  getComments,
  updateComment
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentComponents)