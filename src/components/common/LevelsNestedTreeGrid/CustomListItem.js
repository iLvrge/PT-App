import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ArrowRight, ArrowDropDown } from '@material-ui/icons'
import CustomList from './CustomList'
import useStyles from './styles'

import {
  getCustomersNameCollections,
  getCustomerRFIDAssets,
  setTreeOpen,
  setCurrentCollectionID,
  setCurrentAsset,
  getAssetsOutsource,
  getAssets,
  getFilterTimeLine,
  setCurTreeLevel1,
  setCurTreeLevel2,
  setCurTreeLevel3,
  setCurTreeLevel4,
  initCurTreeLevel1,
  initCurTreeLevel2,
  initCurTreeLevel3,
  initCurTreeLevel4,
  getComments,
  setIllustrationUrl,
  setTimelineTabIndex,
  getCollectionIllustration,
} from '../../../actions/patenTrackActions'
import { signOut } from '../../../actions/authActions'

const getLabel = (depth, props) => {
  switch (depth) {
    case 0:
    case 1:
      return props.name
    case 2:
      return props.rf_id
    case 3:
      return props.grant_doc_num ? props.grant_doc_num : props.appno_doc_num
    default:
      return ''
  }
}

function CustomListItem(props) {
  const { depth } = props
  const classes = useStyles()
  const [ redirect, setRedirect ] = useState(false)
  const { timelineTab, setTimelineTabIndex } = props

  const errorProcess = err => {
    if (
      err !== undefined &&
      err.status === 401 &&
      err.data === 'Authorization error'
    ) {
      props.signOut()
      return true
    }
    return false
  }

  const getFontSize = () => {
    if (props.screenHeight < 500 || props.screenWidth < 992) return 8
    if (props.screenHeight < 700 || props.screenWidth < 1200) return 12
    if (props.screenHeight < 900 || props.screenWidth < 1400) return 14
    return 16
  }

  const getActiveColor = () => {
    switch (depth) {
      case 0:
        return 'red'
      case 1:
        return 'rgb(36, 147, 242)'
      case 2:
        return 'orange'
      case 3:
        return 'green'
      default:
        return ''
    }
  }

  const isSelected = () => {
    const curLabels = Object.values(props.curTree)
    let i
    for (i = 0; i < props.parent.length; i++) {
      if (props.parent[i] !== curLabels[i]) {
        return false
      }
    }
    if (curLabels[i] === getLabel(depth, props)) return true
    return false
  }

  return (
    <li
      className={classes.listItem}
      style={{ color: isSelected() ? getActiveColor() : '#bdbdbd' }}
    >
      <div
        onClick={() => {
          switch (depth) {
            case 0:
              /*isSelected() ? 
                props.initCurTreeLevel1(props.tabId)                
              :
                props.setCurTreeLevel1(props.tabId, getLabel(depth, props));
                props.setCurTreeLevel2(props.tabId, '');
                props.setCurTreeLevel3(props.tabId, '');
                props.setCurTreeLevel4(props.tabId, '');
                if( props.timelineTab ===1 ) {
                  props.setTimelineTabIndex(0);
                }*/
              props.initCurTreeLevel1(props.tabId)
              props.setCurTreeLevel1(props.tabId, getLabel(depth, props))
              props.setCurTreeLevel2(props.tabId, '')
              props.setCurTreeLevel3(props.tabId, '')
              props.setCurTreeLevel4(props.tabId, '')
              if (props.timelineTab === 1) {
                props.setTimelineTabIndex(0)
              }
              break
            case 1:
              /*props.setCurTreeLevel1(props.tabId, props.parent[0]);
              isSelected() ?
                props.initCurTreeLevel2(props.tabId)
              :
                props.setCurTreeLevel2(props.tabId, getLabel(depth, props));
                props.setCurTreeLevel3(props.tabId, '');
                props.setCurTreeLevel4(props.tabId, '');
                if( props.timelineTab ===1 ) {
                  props.setTimelineTabIndex(0);
                }*/
              props.setCurTreeLevel1(props.tabId, props.parent[0])
              props.initCurTreeLevel2(props.tabId)
              props.setCurTreeLevel2(props.tabId, getLabel(depth, props))
              props.setCurTreeLevel3(props.tabId, '')
              props.setCurTreeLevel4(props.tabId, '')
              if (props.timelineTab === 1) {
                props.setTimelineTabIndex(0)
              }
              break
            case 2:
              /*props.setCurTreeLevel1(props.tabId, props.parent[0]);
              props.setCurTreeLevel2(props.tabId, props.parent[1]);
              isSelected() ?
                props.initCurTreeLevel3(props.tabId)
              :
                props.setCurTreeLevel3(props.tabId, getLabel(depth, props));
                props.setCurTreeLevel4(props.tabId, '');
                props.getComments('collection', getLabel(depth, props)).catch(err => errorProcess({...err}.response));
                */
              props.setCurTreeLevel1(props.tabId, props.parent[0])
              props.setCurTreeLevel2(props.tabId, props.parent[1])
              props.initCurTreeLevel3(props.tabId)
              props.setCurTreeLevel3(props.tabId, getLabel(depth, props))
              props.setCurTreeLevel4(props.tabId, '')
              props
                .getComments('collection', getLabel(depth, props))
                .catch(err => errorProcess({ ...err }.response))
              break
            case 3:
              /*props.setCurTreeLevel1(props.tabId, props.parent[0]);
              props.setCurTreeLevel2(props.tabId, props.parent[1]);
              props.setCurTreeLevel3(props.tabId, props.parent[2]);
              isSelected() ?
                props.initCurTreeLevel4(props.tabId)
              :
                props.setCurTreeLevel4(props.tabId, getLabel(depth, props));
                props.getComments('asset', getLabel(depth, props)).catch(err => errorProcess({...err}.response));*/
              props.setCurTreeLevel1(props.tabId, props.parent[0])
              props.setCurTreeLevel2(props.tabId, props.parent[1])
              props.setCurTreeLevel3(props.tabId, props.parent[2])
              props.initCurTreeLevel4(props.tabId)
              props.setCurTreeLevel4(props.tabId, getLabel(depth, props))
              props
                .getComments('asset', getLabel(depth, props))
                .catch(err => errorProcess({ ...err }.response))
              break
            default:
              break
          }
          /*if(props.isOpened) {
            props.setTreeOpen(getLabel(depth, props), !props.isOpened);
            return;
          }
          props.setTreeOpen(getLabel(depth, props), !props.isOpened);*/
          if (!props.isOpened) {
            props.setTreeOpen(getLabel(depth, props), !props.isOpened)
          }
          const label = getLabel(depth, props)
          console.log('depth', depth)
          if (depth === 0) {
            props
              .getFilterTimeLine(label, label, 0)
              .catch(err => errorProcess({ ...err }.response))
          }
          if (depth === 1) {
            props
              .getCustomersNameCollections(label)
              .catch(err => errorProcess({ ...err }.response))
            props
              .getFilterTimeLine(props.parent[0], label, 1)
              .catch(err => errorProcess({ ...err }.response))
          }
          if (depth === 2) {
            console.log('SET:' + label)
            props.setCurrentCollectionID(label)
            props.setCurrentAsset('')
            props
              .getCustomerRFIDAssets(label)
              .catch(err => errorProcess({ ...err }.response))
            props.setIllustrationUrl('about:blank')
            props
              .getCollectionIllustration(label)
              .catch(err => errorProcess({ ...err }.response))
            props
              .getFilterTimeLine(props.parent[0], label, 2)
              .catch(err => errorProcess({ ...err }.response))
          }
          if (depth === 3) {
            console.log('3rd level')
            props.setCurrentAsset(label)
            props.setCurrentCollectionID('')
            /**Reset iframe */
            props.setIllustrationUrl('about:blank')
            /*console.log("In iframe");*/
            /**Reset iframe */
            props
              .getAssetsOutsource(label)
              .catch(err => errorProcess({ ...err }.response))
            props
              .getAssets(label)
              .catch(err => errorProcess({ ...err }.response))
            props
              .getFilterTimeLine(props.parent[0], label, 3)
              .catch(err => errorProcess({ ...err }.response))
          }
        }}
        style={{ display: 'flex' }}
      >
        {depth !== 3 && (props.isOpened ? <ArrowDropDown /> : <ArrowRight />)}
        <span>{getLabel(depth, props)}</span>
      </div>
      {props.isOpened && props.child ? (
        <CustomList
          data={props.child}
          depth={props.depth + 1}
          tabId={props.tabId}
          parent={[ ...props.parent, getLabel(depth, props) ]}
        />
      ) : (
        ''
      )}
    </li>
  )
}
/**
 * 
          style={{
            paddingLeft: depth === 3 ? '1rem' : 0,
            fontSize: getFontSize()
          }}
 */
const mapStateToProps = (state, ownProps) => {
  const label = getLabel(ownProps.depth, ownProps)

  switch (ownProps.depth) {
    case 0:
      return {
        ...ownProps,
        screenHeight: state.patenTrack.screenHeight,
        screenWidth: state.patenTrack.screenWidth,
        isOpened: state.patenTrack.tree[label]
          ? state.patenTrack.tree[label]
          : false,
        curTree: state.patenTrack.curTree[ownProps.tabId],
        timelineTab: state.patenTrack.timelineTab,
      }
    case 1:
      return {
        ...ownProps,
        screenHeight: state.patenTrack.screenHeight,
        screenWidth: state.patenTrack.screenWidth,
        child: state.patenTrack.customersNamesCollections[ownProps.name],
        isOpened: state.patenTrack.tree[label]
          ? state.patenTrack.tree[label]
          : false,
        curTree: state.patenTrack.curTree[ownProps.tabId],
        timelineTab: state.patenTrack.timelineTab,
      }
    case 2:
      return {
        ...ownProps,
        child: state.patenTrack.customersRFIDAssets[ownProps.rf_id],
        isOpened: state.patenTrack.tree[label]
          ? state.patenTrack.tree[label]
          : false,
        curTree: state.patenTrack.curTree[ownProps.tabId],
        timelineTab: state.patenTrack.timelineTab,
        screenHeight: state.patenTrack.screenHeight,
        screenWidth: state.patenTrack.screenWidth,
      }
    case 3:
      return {
        ...ownProps,
        screenHeight: state.patenTrack.screenHeight,
        screenWidth: state.patenTrack.screenWidth,
        curTree: state.patenTrack.curTree[ownProps.tabId],
        timelineTab: state.patenTrack.timelineTab,
      }
    default:
      return {
        screenHeight: state.patenTrack.screenHeight,
        screenWidth: state.patenTrack.screenWidth,
        timelineTab: state.patenTrack.timelineTab,
      }
  }
}

const mapDispatchToProps = {
  getCustomersNameCollections,
  getCustomerRFIDAssets,
  getAssetsOutsource,
  setTreeOpen,
  setCurrentCollectionID,
  setCurrentAsset,
  getAssets,
  getFilterTimeLine,
  setCurTreeLevel1,
  setCurTreeLevel2,
  setCurTreeLevel3,
  setCurTreeLevel4,
  initCurTreeLevel1,
  initCurTreeLevel2,
  initCurTreeLevel3,
  initCurTreeLevel4,
  getComments,
  setIllustrationUrl,
  setTimelineTabIndex,
  getCollectionIllustration,
  signOut,
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomListItem)
