import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'moment'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Paper from '@material-ui/core/Paper'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import { Close } from '@material-ui/icons'
import FullscreenIcon from '@material-ui/icons/Fullscreen'

import CircularProgress from '@material-ui/core/CircularProgress'
import { DataSet } from 'vis-data-71/esnext'
import { Graph2d } from 'vis-timeline/esnext'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import PatenTrackApi from '../../../api/patenTrack2'

import InsightsContainer from '../InsightsContainer'

import useStyles from './styles'

import { getCharts } from '../../../actions/patentTrackActions2' 


import axios from 'axios'

const AssetsCharts = () => {
  const classes = useStyles()
  const [ selectedTab, setSelectedTab ] = useState(0)
  const companyListLoading = useSelector(state => state.patenTrack2.companyListLoading)

  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

 
  const handleChangeTab = (e, newTab) => setSelectedTab(newTab)
  
  if (companyListLoading) return null

  return (
    <Paper className={classes.root} square> 
      <Tabs
        value={selectedTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChangeTab}
        className={classes.tabs}
        orientation="vertical"
        classes={{indicator: classes.indicator}}
      >
        <Tab label="Inventions" classes={{ root: classes.tab, wrapper: classes.tabText }} />
        <Tab label="Acquisitions" classes={{ root: classes.tab, wrapper: classes.tabText }} />
        <Tab label="Sales" classes={{ root: classes.tab, wrapper: classes.tabText }} />
        <Tab label="Security" classes={{ root: classes.tab, wrapper: classes.tabText }} />
      </Tabs>
      <TabPanel classes={classes} chartId={selectedTab + 1} />
    </Paper>
  )
}


const options = {
  autoResize: true,
  height: '100%',
  width: '100%',
  style: 'bar',
  drawPoints: false,
  orientation: 'bottom',
  start: Moment()
    .subtract(25, 'years')
    .format(),
  end: new Date(),
}

const TabPanel = ({ chartId, classes }) => {
  const graphRef = useRef()
  const dispatch = useDispatch()
  const graphContainerRef = useRef()
  const isLoadingCharts = useSelector(state => state.patenTrack2.isLoadingCharts)
  const chartData = useSelector(state => state.patenTrack2.assetCharts)
  const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)

  const handleClickOpenFullscreen = () => {
    setIsFullscreenOpen(true)
  }

  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false)
  }

  useEffect(() => {
    graphRef.current = new Graph2d(graphContainerRef.current, [], options)
    return () => {
      graphRef.current.destroy()
    }
  }, [])

  useEffect(() => {
    if(chartId){
      dispatch(getCharts(chartId));
    }
  }, [ chartId ])

  useEffect(() => {
    if(chartData){
      const convertedData = chartData.map(datum => ({
        x: Moment(datum.label).format(),
        end: Moment(datum.label)
          .add(1, 'day')
          .format(),
        y: datum.value,
      }))
      const items = new DataSet(convertedData)
      graphRef.current.setItems(items)
    }
  }, [chartData])

  return (
    <div className={classes.graphContainer}>

      {isLoadingCharts && (
        <CircularProgress className={classes.loadingIndicator} />
      )}

      <div
        style={{
          height: '100%',
          width: '100%',
          display: chartData ? 'block' : 'hidden',
          filter: `blur(${isLoadingCharts ? '4px' : 0})`,
        }}
        ref={graphContainerRef}
        className={classes.timeline}
      />

      <IconButton size="small" className={classes.fullscreenBtn} onClick={handleClickOpenFullscreen}>
        <FullscreenIcon />
      </IconButton>
      
      <Modal
        className={classes.fullscreenChartsModal}
        open={isFullscreenOpen}
      > 
        <Paper className={classes.fullscreenCharts} square>
          <IconButton onClick={handleCloseFullscreen} className={classes.right}>
            <Close />
          </IconButton>
          <InsightsContainer />
        </Paper>
      </Modal>
    </div>
  )
}

export default AssetsCharts
