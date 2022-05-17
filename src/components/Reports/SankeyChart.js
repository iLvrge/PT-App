import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Chart } from "react-google-charts";
import useStyles from './styles'

import Loader from '../common/Loader'
import PatenTrackApi from '../../api/patenTrack2'
import { Paper } from '@mui/material';

const SankeyChart = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [height, setHeight] = useState('100%');
    const [data, setData] = useState([]);
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

    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected);
    
    useEffect(() => {
        const getPartiesData = async() => {
            if(loading === false) {    
                setLoading(true)
                setData([])
                const formData = new FormData()
                formData.append('selectedCompanies', JSON.stringify(selectedCompanies));                
                const {data} = await PatenTrackApi.getDashboardPartiesData(formData)
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
                    if(data.length > 10) {
                        setOption(prevItem => {
                            return {...prevItem, height: data.length * 20}
                        })
                    }                    
                    setData(loadData)
                }
                setLoading(false)
            }
        }
        getPartiesData()
        return (() => {})
    }, [selectedCompanies])

    return (
        <Paper sx={{p: 2, overflow: 'auto'}} className={classes.container} square>
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
        </Paper>         
    )
}


export default SankeyChart;