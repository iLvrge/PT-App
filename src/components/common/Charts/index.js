import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import moment from 'moment'

import { Grid, Typography } from '@material-ui/core'
import { DataSet, Graph3d } from 'vis-graph3d/standalone'
import { Bar as BarChart } from 'react-chartjs-2'

import useStyles from './styles'
import Loader from '../Loader'
import TabsContainer from '../Tabs'
import FullWidthSwitcher from '../FullWidthSwitcher'


import {
  getCharts,
  getChartsOne,
  setChartTabIndex,
} from '../../../actions/patenTrackActions'

const backgroundColor = 'rgb(255, 170, 0)'
const backgroundColor1 = 'rgb(75,192,192)'
// const backgroundColor2 = 'rgb(112,168,0)';

function Charts(props) {
  const { chartTab, setChartTabIndex } = props
  const classes = useStyles()
  const [ showSwitcher, setShowSwitcher ] = useState(0)
  /*const charts = props.chartsTab.length ? props.chartsTab[chartTab] : [];*/
  const tabLabel = chartTab === 2 ? 'tab3' : chartTab === 1 ? 'tab2' : 'tab1'

  const charts = props.chatWithLabel[tabLabel]
    ? props.chatWithLabel[tabLabel]
    : []
  const isExpaned = props.currentWidget === 'charts'

  const [ data, setData ] = useState(null)

  var graph = null

  const [ options, setOptions ] = useState({
    width: '100%',
    height: '100%',
    style: 'dot-line',
    showPerspective: true,
    showGrid: true,
    showShadow: false,
    keepAspectRatio: true,
    verticalRatio: 0.5,
  })

  const [ chart1, setChartOne ] = useState({ label: [], value: [], value1: [] })
  const [ chart2, setChartTwo ] = useState({ label: [], value: [], value1: [] })
  const [ chart3, setChartThree ] = useState({
    label: [],
    value: [],
    value1: [],
  })
  const [ chart4, setChartFour ] = useState({ label: [], value: [], value1: [] })
  const [ chart5, setChartFive ] = useState({
    label: [],
    value: [],
    value1: [],
    value2: [],
  })

  const callChart = useCallback(() => {
    const container = document.getElementById('graphChart')
    console.log('container', container)
    if (container != null && container !== undefined) {
      let newOption
      if (isExpaned) {
        newOption = { ...options }
        newOption.width = props.screenWidth - 200 + 'px'
        newOption.height = props.screenHeight - 200 + 'px'
      } else {
        newOption = { ...options }
        newOption.width = '100%'
        newOption.height = '100%'
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = new Graph3d(container, data, newOption)
    }
  }, [])

  useEffect(() => {
    if (
      props.chatWithLabel['tab2'] &&
      props.chatWithLabel['tab2'].chart1.length > 0
    ) {
      let tempData = new DataSet()
      let counter = 0,
        steps = 5,
        axisMax = 10,
        axisStep = axisMax / steps
      for (let x = 0; x < axisMax; x += axisStep) {
        for (let y = 0; y < axisMax; y += axisStep) {
          const value = custom(x, y)
          tempData.add({ x: x, y: y, z: value })
        }
      }
      console.log(tempData)
      setData(tempData)
      if (chartTab === 'tab2') {
        callChart()
      }
    }
    let chartOne = { label: [], value: [], value1: [] }
    if (props.chartOne.length > 0) {
      props.chartOne.map((item) => {
        chartOne.label.push(moment(new Date(item.label)).startOf('day'))
        chartOne.value.push(item.value)
        chartOne.value1.push(parseInt(item.assets))
      })
    }
    console.log('chartOne', chartOne)
    setChartOne(chartOne)

    let chartTwo = { label: [], value: [], value1: [] }
    if (props.chartTwo.length > 0) {
      props.chartTwo.map((item) => {
        chartTwo.label.push(moment(new Date(item.label)).startOf('day'))
        chartTwo.value.push(item.value)
        chartTwo.value1.push(parseInt(item.assets))
      })
    }
    setChartTwo(chartTwo)

    let chartThree = { label: [], value: [], value1: [] }
    if (props.chartThree.length > 0) {
      props.chartThree.forEach((item) => {
        chartThree.label.push(moment(new Date(item.label)).startOf('day'))
        chartThree.value.push(item.value)
        chartThree.value1.push(parseInt(item.assets))
      })
    }
    setChartThree(chartThree)

    let chartFour = { label: [], value: [], value1: [] }
    if (props.chartFour.length > 0) {
      props.chartFour.forEach((item) => {
        chartFour.label.push(moment(new Date(item.label)).startOf('day'))
        chartFour.value.push(item.value)
        chartFour.value1.push(parseInt(item.assets))
      })
    }
    setChartFour(chartFour)

    let chartFive = { label: [], value: [], value1: [], value2: [] }
    if (props.chartFive.length > 0) {
      props.chartFive.forEach((item) => {
        chartFive.label.push(moment(new Date(item.label)).startOf('day'))
        let name = item.normalize_name
        if (name === null || name === '') {
          name = item.name
        }
        chartFive.value.push(name)
        chartFive.value1.push(item.value)
        chartFive.value2.push(parseInt(item.assets))
      })
    }
    setChartFive(chartFive)
  }, [ props.chatWithLabel, props.chartOne, props.chartTwo, props.chartThree, props.chartFour, props.chartFive, chartTab, callChart ])

  //console.log("tabLabel", tabLabel, props.chatWithLabel, charts);
  const getWidthChart = () => {
    if (props.screenHeight < 400) return '50%'
    if (props.screenHeight < 500) return '70%'
    if (isExpaned) return '100%'
    if (props.screenHeight < 800) return '80%'
    return '100%'
  }

  const chartColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
  ]

  const custom = (x, y) => {
    return -Math.sin(x / Math.PI) * Math.cos(y / Math.PI) * 10 + 10
  }

  const createGraph = () => {
    callChart()
  }

  return (
    <div
      className={classes.charts}
      onMouseOver={() => {
        setShowSwitcher(true)
      }}
      onMouseLeave={() => {
        setShowSwitcher(false)
      }}
    >
      <div className={classes.chatsContainer}>
        {!props.isLoading ? (
          <div className={classes.container} style={{ width: '100%', overflow: 'auto' }}>
            {chartTab == 0 ? (
              <>
                <Grid
                  className={
                    props.currentWidget === 'charts'
                      ? classes.gridItem100
                      : classes.gridItem
                  }
                  style={{
                    maxWidth:
                      props.currentWidget === 'charts' ? '100%' : 'initial',
                    flexBasis: 'initial',
                    position: 'relative',
                  }}
                >
                  <div
                    className={classes.chart}
                    style={{
                      margin: '5px 2px 2px 5px',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <div
                      className={classes.wrap}
                      style={{
                        height: '90%',
                        width: getWidthChart(),
                        margin: '0 auto',
                      }}
                    >
                      <Typography variant="h6" className={classes.headingTop} align="center">Inventions</Typography>
                      <BarChart
                        defaults = {{
                          global : {
                            defaultFontFamily: 'Avenir Next W01',
                            defaultFontSize: '26px',
                          }
                        }}
                        data={{
                          labels: chart1.label,
                          datasets: [
                            /*{
                                label: "Inventions",
                                fill: false,
                                data: chart1.value,
                                backgroundColor: backgroundColor,
                                borderColor: backgroundColor,
                                barThickness: 10,  // number (pixels) or 'flex'
                                maxBarThickness: 10,
                                borderWidth: 1,
                                boxWidth: 0,
                                lineTension: 0,
                                yAxisID: 'y-axis-1',
                                datalabels: {
                                  display: false,
                                },
                              },*/ {
                              label: 'Inventions Assets',
                              fill: false,
                              data: chart1.value1,
                              backgroundColor: backgroundColor1,
                              borderColor: backgroundColor1,
                              barThickness: 10, // number (pixels) or 'flex'
                              maxBarThickness: 10,
                              borderWidth: 1,
                              boxWidth: 0,
                              lineTension: 0,
                              yAxisID: 'y-axis-2',
                              datalabels: {
                                display: false,
                              },
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          barValueSpacing: 20,
                          elements: {
                            line: {
                              tension: 0,
                            },
                          },
                          legend: {
                            display: false,
                          },
                          title: {
                            display: false,
                            text: 'Inventions',
                            fontSize: 16,
                            fontStyle: 'normal',
                            fontColor: '#bdbdbd'
                          },
                          layout: {
                            padding: {
                              left: 5,
                              right: 5,
                              top: 5,
                              bottom: 5,
                            },
                          },
                          scales: {
                            xAxes: [
                              {
                                type: 'time',
                                barThickness: 10, // number (pixels) or 'flex'
                                maxBarThickness: 10,
                                gridLines: {
                                  display: true,
                                },     
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                },                           
                                time: {
                                  tooltipFormat: 'MMM YY',
                                  displayFormats: {
                                    millisecond: 'MMM YY',
                                    second: 'MMM YY',
                                    minute: 'MMM YY',
                                    hour: 'MMM YY',
                                    day: 'MMM YY',
                                    week: 'MMM YY',
                                    month: 'MMM YY',
                                    quarter: 'MMM YY',
                                    year: 'MMM YY',
                                  },
                                },
                              },
                            ],
                            yAxes: [
                              {
                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                display: true,
                                position: 'left',
                                id: 'y-axis-2',
                                barPercentage: 2,
                                maxBarThickness: 100,                                
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                 
                                  beginAtZero: true,
                                  callback: function (value) {
                                    if (value % 1 === 0) {
                                      return value
                                    }
                                  },
                                },
                              },
                            ],
                          },
                        }}
                        lg={6}
                        xs={6}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid
                  className={
                    props.currentWidget === 'charts'
                      ? classes.gridItem100
                      : classes.gridItem
                  }
                  style={{
                    maxWidth:
                      props.currentWidget === 'charts' ? '100%' : 'initial',
                    flexBasis: 'initial',
                    position: 'relative',
                  }}
                >
                  <div
                    className={classes.chart}
                    style={{
                      margin: '5px 5px 2px 2px',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <div
                      className={classes.wrap}
                      style={{
                        height: '90%',
                        width: getWidthChart(),
                        margin: '0 auto',
                      }}
                    >
                      <Typography variant="h6" className={classes.headingTop} align="center">Acquisition</Typography>
                      <BarChart
                        data={{
                          labels: chart2.label,
                          datasets: [
                            {
                              label: 'Acquisition',
                              fill: false,
                              data: chart2.value,
                              backgroundColor: backgroundColor,
                              borderColor: backgroundColor,
                              barThickness: 7, // number (pixels) or 'flex'
                              maxBarThickness: 3,
                              borderWidth: 2,
                              boxWidth: 0,
                              lineTension: 0,
                              yAxisID: 'y-axis-3',
                              datalabels: {
                                display: false,
                              },
                            },
                            {
                              label: 'Acquisition Assets',
                              fill: false,
                              data: chart2.value1,
                              backgroundColor: backgroundColor1,
                              borderColor: backgroundColor1,
                              barThickness: 7, // number (pixels) or 'flex'
                              maxBarThickness: 3,
                              borderWidth: 2,
                              boxWidth: 0,
                              lineTension: 0,
                              yAxisID: 'y-axis-4',
                              datalabels: {
                                display: false,
                              },
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          barValueSpacing: 20,
                          elements: {
                            line: {
                              tension: 0,
                            },
                          },
                          legend: {
                            display: false,
                          },
                          title: {
                            display: false,
                            text: 'Acquisition',
                            fontSize: 16,
                            fontStyle: 'normal',
                            fontColor: '#bdbdbd'
                          },
                          layout: {
                            padding: {
                              left: 5,
                              right: 5,
                              top: 5,
                              bottom: 5,
                            },
                          },
                          scales: {
                            xAxes: [
                              {
                                type: 'time',
                                gridLines: {
                                  display: true,
                                },
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false
                                }, 
                                time: {
                                  tooltipFormat: 'MMM YY',
                                  displayFormats: {
                                    millisecond: 'MMM YY',
                                    second: 'MMM YY',
                                    minute: 'MMM YY',
                                    hour: 'MMM YY',
                                    day: 'MMM YY',
                                    week: 'MMM YY',
                                    month: 'MMM YY',
                                    quarter: 'MMM YY',
                                    year: 'MMM YY',
                                  },
                                },
                              },
                            ],
                            yAxes: [
                              {
                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                display: true,
                                position: 'left',
                                id: 'y-axis-3',
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                  beginAtZero: true,
                                  callback: function (value) {
                                    if (value % 1 === 0) {
                                      return value
                                    }
                                  },
                                },
                              },
                              {
                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                display: true,
                                position: 'right',
                                id: 'y-axis-4',
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                  beginAtZero: true,
                                  callback: function (value) {
                                    if (value % 1 === 0) {
                                      return value
                                    }
                                  },
                                },
                              },
                            ],
                          },
                        }}
                        lg={6}
                        xs={6}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid
                  className={
                    props.currentWidget === 'charts'
                      ? classes.gridItem100
                      : classes.gridItem
                  }
                  style={{
                    maxWidth:
                      props.currentWidget === 'charts' ? '100%' : 'initial',
                    flexBasis: 'initial',
                    position: 'relative',
                  }}
                >
                  <div
                    className={classes.chart}
                    style={{
                      margin: '2px 2px 5px 5px',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <div
                      className={classes.wrap}
                      style={{
                        height: '90%',
                        width: getWidthChart(),
                        margin: '0 auto',
                      }}
                    >
                      <Typography variant="h6" className={classes.headingTop} align="center">Sales</Typography>
                      <BarChart
                        data={{
                          labels: chart3.label,
                          datasets: [
                            {
                              label: 'Sales',
                              fill: false,
                              data: chart3.value,
                              backgroundColor: backgroundColor,
                              borderColor: backgroundColor,
                              barThickness: 10, // number (pixels) or 'flex'
                              maxBarThickness: 10,
                              borderWidth: 2,
                              boxWidth: 0,
                              lineTension: 0,
                              yAxisID: 'y-axis-3',
                              datalabels: {
                                display: false,
                              },
                            },
                            {
                              label: 'Sales Assets',
                              fill: false,
                              data: chart3.value1,
                              backgroundColor: backgroundColor1,
                              borderColor: backgroundColor1,
                              barThickness: 10, // number (pixels) or 'flex'
                              maxBarThickness: 10,
                              borderWidth: 2,
                              boxWidth: 0,
                              lineTension: 0,
                              yAxisID: 'y-axis-4',
                              datalabels: {
                                display: false,
                              },
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          barValueSpacing: 20,
                          elements: {
                            line: {
                              tension: 0,
                            },
                          },
                          legend: {
                            display: false,
                          },
                          title: {
                            display: false,
                            text: 'Sales',
                            fontSize: 16,
                            fontStyle: 'normal',
                            fontColor: '#bdbdbd'
                          },
                          layout: {
                            padding: {
                              left: 5,
                              right: 5,
                              top: 5,
                              bottom: 5,
                            },
                          },
                          scales: {
                            xAxes: [
                              {
                                type: 'time',
                                gridLines: {
                                  display: true,
                                },
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false
                                },
                                barThickness: 10, // number (pixels) or 'flex'
                                maxBarThickness: 10,
                                time: {
                                  tooltipFormat: 'MMM YY',
                                  displayFormats: {
                                    millisecond: 'MMM YY',
                                    second: 'MMM YY',
                                    minute: 'MMM YY',
                                    hour: 'MMM YY',
                                    day: 'MMM YY',
                                    week: 'MMM YY',
                                    month: 'MMM YY',
                                    quarter: 'MMM YY',
                                    year: 'MMM YY',
                                  },
                                },
                              },
                            ],
                            yAxes: [
                              {
                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                display: true,
                                position: 'left',
                                id: 'y-axis-3',
                                barPercentage: 2,
                                maxBarThickness: 100,
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                  beginAtZero: true,
                                  callback: function (value) {
                                    if (value % 1 === 0) {
                                      return value
                                    }
                                  },
                                },
                              },
                              {
                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                display: true,
                                position: 'right',
                                id: 'y-axis-4',
                                barPercentage: 2,
                                maxBarThickness: 100,
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                  beginAtZero: true,
                                  callback: function (value) {
                                    if (value % 1 === 0) {
                                      return value
                                    }
                                  },
                                },
                              },
                            ],
                          },
                        }}
                        lg={6}
                        xs={6}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid
                  className={
                    props.currentWidget === 'charts'
                      ? classes.gridItem100
                      : classes.gridItem
                  }
                  style={{
                    maxWidth:
                      props.currentWidget === 'charts' ? '100%' : 'initial',
                    flexBasis: 'initial',
                    position: 'relative',
                  }}
                >
                  <div
                    className={classes.chart}
                    style={{
                      margin: '2px 5px 5px 2px',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <div
                      className={classes.wrap}
                      style={{
                        height: '90%',
                        width: getWidthChart(),
                        margin: '0 auto',
                      }}
                    >
                      <Typography variant="h6" className={classes.headingTop} align="center">Security</Typography>
                      <BarChart
                        data={{
                          labels: chart4.label,
                          datasets: [
                            {
                              label: 'Security',
                              fill: false,
                              data: chart4.value,
                              backgroundColor: backgroundColor,
                              borderColor: backgroundColor,
                              barThickness: 10, // number (pixels) or 'flex'
                              maxBarThickness: 10,
                              borderWidth: 2,
                              boxWidth: 0,
                              lineTension: 0,
                              yAxisID: 'y-axis-3',
                              datalabels: {
                                display: false,
                              },
                            },
                            {
                              label: 'Security Assets',
                              fill: false,
                              data: chart4.value1,
                              backgroundColor: backgroundColor1,
                              borderColor: backgroundColor1,
                              barThickness: 10, // number (pixels) or 'flex'
                              maxBarThickness: 10,
                              borderWidth: 2,
                              boxWidth: 0,
                              lineTension: 0,
                              yAxisID: 'y-axis-4',
                              datalabels: {
                                display: false,
                              },
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          barValueSpacing: 50,
                          elements: {
                            line: {
                              tension: 0,
                            },
                          },
                          legend: {
                            display: false,
                          },
                          title: {
                            display: false,
                            text: 'Security',
                            fontSize: 16,
                            fontStyle: 'normal',
                            fontColor: '#bdbdbd'
                          },
                          layout: {
                            padding: {
                              left: 5,
                              right: 5,
                              top: 5,
                              bottom: 5,
                            },
                          },
                          scales: {
                            xAxes: [
                              {
                                type: 'time',
                                gridLines: {
                                  display: true,
                                },
                                barThickness: 10,
                                maxBarThickness: 10,
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false
                                },
                                time: {
                                  tooltipFormat: 'MMM YY',
                                  displayFormats: {
                                    millisecond: 'MMM YY',
                                    second: 'MMM YY',
                                    minute: 'MMM YY',
                                    hour: 'MMM YY',
                                    day: 'MMM YY',
                                    week: 'MMM YY',
                                    month: 'MMM YY',
                                    quarter: 'MMM YY',
                                    year: 'MMM YY',
                                  },
                                },
                              },
                            ],
                            yAxes: [
                              {
                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                display: true,
                                position: 'left',
                                id: 'y-axis-3',
                                barPercentage: 2,
                                maxBarThickness: 100,
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                  beginAtZero: true,
                                  callback: function (value) {
                                    if (value % 1 === 0) {
                                      return value
                                    }
                                  },
                                },
                              },
                              {
                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                display: true,
                                position: 'right',
                                id: 'y-axis-4',
                                barPercentage: 2,
                                maxBarThickness: 100,
                                ticks: {
                                  display: props.currentWidget === 'charts' ? true : false,
                                  beginAtZero: true,
                                  callback: function (value) {
                                    if (value % 1 === 0) {
                                      return value
                                    }
                                  },
                                },
                              },
                            ],
                          },
                        }}
                        lg={6}
                        xs={6}
                      />
                    </div>
                  </div>
                </Grid>
              </>
            ) : (
              ''
            )}
            {chartTab === 1 ? <div id={'graphChart'} /> : ''}
            {chartTab === 1 ? createGraph() : ''}
          </div>
        ) : (
          <div
            className={classnames(classes.container, classes.loaderWrapper)}
            style={{ height: props.screenHeight / 3.5 }}
          >
            <Loader />
          </div>
        )}

        <TabsContainer
          activeTabId={chartTab}
          setActiveTabId={setChartTabIndex}
          tabs={[ 'Tab1', 'Tab2', 'Tab3' ]}
        />
      </div>
      <FullWidthSwitcher show={showSwitcher} widget={'charts'} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    chartsTab: Object.values(state.patenTrack.charts),
    chatWithLabel: state.patenTrack.charts,
    chartOne: state.patenTrack.chart_one,
    chartTwo: state.patenTrack.chart_two,
    chartThree: state.patenTrack.chart_three,
    chartFour: state.patenTrack.chart_four,
    chartFive: state.patenTrack.chart_five,
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.chartsLoading,
    screenWidth: state.patenTrack.screenWidth,
    screenHeight: state.patenTrack.screenHeight,
    chartTab: state.patenTrack.chartTab,
  }
}

const mapDispatchToProps = {
  getCharts,
  getChartsOne,
  setChartTabIndex,
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts)
