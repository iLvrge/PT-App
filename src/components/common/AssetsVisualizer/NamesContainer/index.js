import React, {useEffect} from 'react'
import { Chart, registerables } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

import { useSelector } from 'react-redux'
import PatenTrackApi from '../../../../api/patenTrack2';
import useStyles from './styles';
import { Paper } from '@mui/material';


const NamesContainer = () => {
    const classes = useStyles() 
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected );
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll);

    useEffect(() => {
        const getIncorrectNamesData = async () => {

            const companies = selectedCompaniesAll === true ? [] : selectedCompanies;
            if(selectedCompaniesAll === true || selectedCompanies.length > 0) {
                const {data} = await PatenTrackApi.getIncorrectNames(companies);
                if(data.length > 0) {
                    const labels = [], values = []
                    const promise = data.map( item => {
                        labels.push(item.name)
                        values.push(item.distance * 15)
                    })
                    await Promise.all(promise)
                    const ctx = document.getElementById('canvas')
           
                    Chart.register(...registerables, WordCloudController, WordElement);
                    new Chart(ctx, {
                        type: WordCloudController.id,
                        data: {
                            labels,
                            datasets: [
                                {
                                    label: 'Inccorect Names',
                                    data: [...values]
                                }
                            ]
                        }
                    });
                }
            }
        }
        getIncorrectNamesData()
    }, [selectedCompanies, selectedCompaniesAll] )
  
    return (
        <Paper className={classes.graphContainer} square>  
            <canvas id="canvas"></canvas>
        </Paper> 
    )
}


export default NamesContainer;