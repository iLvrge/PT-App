import React, {} from 'react'
import { Grid }  from '@mui/material'

import useStyles from './styles'

import CardElement from './CardElement'
import ClientList from './ClientList'
const Reports = () => {
    const classes = useStyles();
    const cardsList = [
        {
            title: 'Broken Chain of Title',
            sub_heading: 'patents ad ad d ad ad ad',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Lost Patents',
            sub_heading: 'assignee has a typo',
            number: 20,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Encumbrances',
            sub_heading: 'irrelevant assignee recorded on your patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Wrong address',
            sub_heading: 'adress',
            number: 124,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Wrong Lawyer',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Unecessary Patents',
            sub_heading: 'patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Missed monetization opportunities',
            sub_heading: 'abandoned patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Late Maintainance',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Corrections',
            sub_heading: 'typo in the name of lawyer, wrong lawyer addres, no longer works with that lawyer',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Late recordings',
            sub_heading: 'patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Deflated Collateral',
            sub_heading: 'abandoned patents',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        },
        {
            title: 'Challenged',
            sub_heading: 'Surcharge payments  number of the maintainance actvities',
            number: 72,
            patent: '',
            application: '',
            rf_id: ''
        }
    ]
    return (
        <Grid
            container
            className={classes.container}
            spacing={2}
            rowSpacing={2} 
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{pt: 1, pr: 2}}
        >
            <Grid
                item lg={2} md={2} sm={2} xs={2}  
                style={{height: '100%'}}
            >
                <div 
                    className={classes.companyBar}
                    id={`client_container`} >
                    {   
                        <ClientList />
                    }
                </div>
            </Grid>
            <Grid
                item lg={10} md={10} sm={10} xs={10} 
                style={{height: '100%', overflowY: 'auto' }}
            >
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        cardsList.map( (card, index) => (
                            <Grid
                                item lg={3} md={4} sm={6} 
                                className={classes.flexColumn}
                            >
                                <CardElement 
                                    key={index} 
                                    card={card}
                                    id={index}
                                />
                            </Grid>
                        ))
                    }
                </Grid>                
            </Grid>
        </Grid>
    );
}

export default Reports;