import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import Moment from 'moment'
import Paper from '@material-ui/core/Paper'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'

import CircularProgress from '@material-ui/core/CircularProgress'
import { DataSet } from 'vis-data/esnext'
import { Graph2d } from 'vis-timeline-73/esnext'

import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

import PatenTrackApi from '../../../api/patenTrack2'

import useStyles from './styles'

const convertChartData = datum => ({
  x: Moment(datum.label).format(),
  end: Moment(datum.label)
    .add(1, 'day')
    .format(),
  y: datum.value,
})

const options = {
  autoResize: true,
  height: '100%',
  width: '100%',
  flex: 1,
  style: 'bar',
  drawPoints: false,
  orientation: 'bottom',
  start: Moment()
    .subtract(25, 'years')
    .format(),
  end: new Date(),
}

const InsightsContainer = () => {
  const classes = useStyles()
  const graphRef1 = useRef()
  const graphRef2 = useRef()
  const graphRef3 = useRef()
  const graphRef4 = useRef()

  const graphContainerRef1 = useRef()
  const [ isLoadingCharts1, setIsLoadingCharts1 ] = useState(false)
  const [ chart1, setChart1 ] = useState()

  const graphContainerRef2 = useRef()
  const [ isLoadingCharts2, setIsLoadingCharts2 ] = useState(false)
  const [ chart2, setChart2 ] = useState()

  const graphContainerRef3 = useRef()
  const [ isLoadingCharts3, setIsLoadingCharts3 ] = useState(false)
  const [ chart3, setChart3 ] = useState()

  const graphContainerRef4 = useRef()
  const [ isLoadingCharts4, setIsLoadingCharts4 ] = useState(false)
  const [ chart4, setChart4 ] = useState()

  
  useEffect(() => {
    graphRef1.current = new Graph2d(graphContainerRef1.current, [], options)
    graphRef2.current = new Graph2d(graphContainerRef2.current, [], options)
    graphRef3.current = new Graph2d(graphContainerRef3.current, [], options)
    graphRef4.current = new Graph2d(graphContainerRef4.current, [], options)

    return () => {
      graphRef1.current.destroy()      
      graphRef2.current.destroy()
      graphRef3.current.destroy()
      graphRef4.current.destroy()
    }
  }, [])

  useEffect(() => {
    const getChartData1 = async () => {
      setIsLoadingCharts1(true)
      const { data } = await PatenTrackApi.getCharts(1)
      setChart1(data)
      const convertedData = data.map(convertChartData)
      const items = new DataSet(convertedData)
      graphRef1.current.setItems(items)
      setIsLoadingCharts1(false)
    }

    const getChartData2 = async () => {
      setIsLoadingCharts2(true)
      const { data } = await PatenTrackApi.getCharts(2)
      setChart2(data)
      const convertedData = data.map(convertChartData)
      const items = new DataSet(convertedData)
      graphRef2.current.setItems(items)
      setIsLoadingCharts2(false)
    }

    const getChartData3 = async () => {
      setIsLoadingCharts3(true)
      const { data } = await PatenTrackApi.getCharts(3)
      setChart3(data)
      const convertedData = data.map(convertChartData)
      const items = new DataSet(convertedData)
      graphRef3.current.setItems(items)
      setIsLoadingCharts3(false)
    }

    const getChartData4 = async () => {
      setIsLoadingCharts4(true)
      const { data } = await PatenTrackApi.getCharts(4)
      setChart4(data)
      const convertedData = data.map(convertChartData)
      const items = new DataSet(convertedData)
      graphRef4.current.setItems(items)
      setIsLoadingCharts4(false)
    }
    getChartData1()
    getChartData2()
    getChartData3()
    getChartData4()
  }, [])
  
  return (
    <Paper className={classes.root} square>
      <div className={classes.row}>
        <div className={classes.chartContainer}>
          <div className={classes.chartTitle}>Inventions</div>
          {isLoadingCharts1 && (
            <CircularProgress className={classes.loadingIndicator} />
          )}
          <div
            style={{
              width: '100%',
              flex: 1,
              display: chart1 ? 'block' : 'hidden',
              filter: `blur(${isLoadingCharts1 ? '4px' : 0})`,
            }}
            ref={graphContainerRef1}
            className={classes.chart}
          />
        </div>
        <div className={classes.chartContainer}>
          <div className={classes.chartTitle}>Acquisitions</div>
          {isLoadingCharts2 && (
            <CircularProgress className={classes.loadingIndicator} />
          )}
          <div
            style={{
              width: '100%',
              flex: 1,
              display: chart2 ? 'block' : 'hidden',
              filter: `blur(${isLoadingCharts2 ? '4px' : 0})`,
            }}
            ref={graphContainerRef2}
            className={classes.chart}
          />
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.chartContainer}>
          <div className={classes.chartTitle}>Sales</div>
          {isLoadingCharts3 && (
            <CircularProgress className={classes.loadingIndicator} />
          )}
          <div
            style={{
              width: '100%',
              flex: 1,
              display: chart3 ? 'block' : 'hidden',
              filter: `blur(${isLoadingCharts3 ? '4px' : 0})`,
            }}
            ref={graphContainerRef3}
            className={classes.chart}
          />
        </div>
        <div className={classes.chartContainer}>
          <div className={classes.chartTitle}>Security</div>
          {isLoadingCharts4 && (
            <CircularProgress className={classes.loadingIndicator} />
          )}
          <div
            style={{
              width: '100%',
              flex: 1,
              display: chart4 ? 'block' : 'hidden',
              filter: `blur(${isLoadingCharts4 ? '4px' : 0})`,
            }}
            ref={graphContainerRef4}
            className={classes.chart}
          />
        </div>
      </div>
    </Paper>
  )
}


export default InsightsContainer
