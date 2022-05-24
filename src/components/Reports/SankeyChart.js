import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Chart } from "react-google-charts";
import useStyles from './styles'

import Loader from '../common/Loader'
import PatenTrackApi from '../../api/patenTrack2'
import { collapseClasses, Paper } from '@mui/material';
import clsx from 'clsx';

const SankeyChart = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [height, setHeight] = useState('100%');
    const [loadingAssignor, setLoadingAssingor] = useState(false);
    const [assignorHeight, setAssingorHeight] = useState('100%');
    const screenHeight = useSelector(state => state.patenTrack.screenHeight);
    const [data, setData] = useState([]);
    const [assignorData, setAssignorData] = useState([]);
    const [assignorOption, setAssignorOption] = useState({
        width: '100%',
        sankey: {
            link: { color: { fill: "#1565C0" } },
            node: {
              colors: ['#70A800', '#FFAA00','#1565C0', '#E60000'],
              label: { color: "#FFF", fontName: 'Roboto', fontSize: 12.25 }
            }
        }
    });

    const [option, setOption] = useState({
        width: '100%',
        sankey: {
            link: { color: { fill: "#1565C0" } },
            node: {
              colors: ['#70A800', '#FFAA00','#1565C0', '#E60000'],
              label: { color: "#FFF", fontName: 'Roboto', fontSize: 12.25 }
            }
        }
    });
    const CONSTANT_DECREMENT = 106;
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    
    useEffect(() => {
        const getPartiesData = async() => {
            if(loading === false) {    
                setLoading(true)
                setLoadingAssingor(true) 
                setData([])
                setAssignorData([])
                const formData = new FormData()
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies));                
                const {data} = await PatenTrackApi.getDashboardPartiesData(formData)
                const getAssignorData = await PatenTrackApi.getDashboardPartiesAssignorData(formData)
                const loadData = []
                if(data.length > 0) {
                    loadData.push(["From", "To", "Assets"])
                    data.forEach( item => {
                        loadData.push([
                            item.name,
                            item.assignee,
                            parseInt(item.number)
                        ])
                    });
                    let height = '100%'
                    if(data.length > 10) {
                        const chartHeight = data.length * 20
                        setOption(prevItem => {
                            return {...prevItem, height: chartHeight}
                        }) 
                    }  else if(data.length < 4) {
                        height =  `${parseInt((screenHeight - CONSTANT_DECREMENT) * (data.length * 25) / 100)}px`
                        setOption(prevItem => {
                            let pre = {...prevItem}
                            delete pre.height
                            return {...pre}
                        })
                    } else {
                        setOption(prevItem => {
                            let pre = {...prevItem}
                            delete pre.height
                            return {...pre}
                        })
                    }    
                    setHeight(height)       
                    setData(loadData)
                }
                setLoading(false)
                if(getAssignorData.data != null) {
                    const assignorData  = getAssignorData.data
                    const loadAssignorData = []
                    loadAssignorData.push(["From", "To", "Assets"])
                    assignorData.forEach( item => {
                        loadAssignorData.push([
                            item.assignor,
                            item.name,
                            parseInt(item.number)
                        ])
                    });
                    let assignorHeight = '100%'
                    if(assignorData.length > 10) {
                        const chartHeight = assignorData.length * 20
                        setAssignorOption(prevItem => {
                            return {...prevItem, height: chartHeight}
                        }) 
                    }  else if(assignorData.length < 4) {
                        assignorHeight =  `${parseInt((screenHeight - CONSTANT_DECREMENT) * (assignorData.length * 25) / 100)}px`
                        setAssignorOption(prevItem => {
                            let pre = {...prevItem}
                            delete pre.height
                            return {...pre}
                        })
                    } else {
                        setAssignorOption(prevItem => {
                            let pre = {...prevItem}
                            delete pre.height
                            return {...pre}
                        })
                    }    
                    setAssingorHeight(assignorHeight)       
                    setAssignorData(loadAssignorData)
                }
                setLoadingAssingor(false)
            }
        }
        getPartiesData()
        return (() => {})
    }, [selectedCompanies])
    return (
        <Paper sx={{p: 2, overflow: 'auto'}} className={clsx(classes.container, classes.containerTop)} square>
            <div className={classes.child}>
                {
                    !loading
                    ?
                        data.length > 0
                        ?
                            <Chart
                                chartType="Sankey"
                                width="100%"
                                height={height}
                                loader={<div>Loading...</div>}
                                data={data}
                                options={option}
                            />
                        :
                            ''
                    :
                        <Loader />
                }
            </div> 
            <div className={classes.child}>
                {
                    !loadingAssignor
                    ?
                        assignorData.length > 0
                        ?
                            <Chart
                                chartType="Sankey"
                                width="100%"
                                height={assignorHeight}
                                loader={<div>Loading...</div>}
                                data={assignorData}
                                options={assignorOption}
                            />
                        :
                            ''
                    :
                        <Loader />
                }        
            </div>    
        </Paper>         
    )
}


export default SankeyChart;