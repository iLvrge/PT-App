import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import PatenTrackApi from '../../../api/patenTrack2'
import { numberWithCommas } from '../../../utils/numbers'
import Grid from '@material-ui/core/Grid'

import useStyles from './styles'
import Typography from '@material-ui/core/Typography'

import axios from 'axios'

const SummaryItemTotalGrowth = ({ classes, data }) => {
  const style = { color: data <  0 ? 'red' : 'green' }

  return (
    <Typography variant="body2" className={classes.summaryItemTotalGrowth} style={style}>      
      {data}%
    </Typography>
  )
}

const AssetsSummary = () => {
  const classes = useStyles()
  const [ counters, setCounters ] = useState({ application: 0, patent: 0, encumbered: 0, current_patent: 0, current_application: 0, difference_patent: 0, difference_application: 0 })
  const [ transactionsCounters, setTransactionsCounters ] = useState({
    buy: 0, buy_patent: 0, diff_buy_patent: 0, sale: 0, sale_patent: 0, diff_sale_patent: 0, security: 0, security_patent: 0, diff_security_patent: 0, release: 0, release_patent: 0, diff_release_patent: 0, license_in: 0, license_in_patent: 0, diff_license_in_patent: 0, license_out: 0, license_out_patent: 0, diff_license_out_patent: 0
  })

  const companies = useSelector(state => state.patenTrack2.companiesList)

  const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)

  useEffect(() => {
    const getTransactionsSummary = async () => {
      if(selectedCompaniesList.length === 0) {
        setTransactionsCounters({ buy: 0, buy_patent: 0, diff_buy_patent: 0, sale: 0, sale_patent: 0, diff_sale_patent: 0, security: 0, security_patent: 0, diff_security_patent: 0, release: 0, release_patent: 0, diff_release_patent: 0, license_in: 0, license_in_patent: 0, diff_license_in_patent: 0, license_out: 0, license_out_patent: 0, diff_license_out_patent: 0 })
      } else {
        const { data } = await PatenTrackApi.getTransactions(`[${encodeURI(selectedCompaniesList.map(company => company.id))}]`)
        setTransactionsCounters(data)
      }
    }
    getTransactionsSummary()
  }, [ selectedCompaniesList ])

  useEffect(() => {
    
    const getSummaryData = async () => {
      if(selectedCompaniesList.length === 0) {
        setCounters({ application: 0, patent: 0, encumbered: 0, current_patent: 0, current_application: 0, difference_patent: 0, difference_application: 0 })
      } else {
        const { data } = await PatenTrackApi.getValidateCounter(`[${encodeURI(selectedCompaniesList.map(company => company.id))}]`)
        setCounters(data)
      }
    }
    getSummaryData()
  }, [ selectedCompaniesList ])

  return (
    <div className={classes.root}>
      <Grid container spacing={1} flexwrap="wrap">
        <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body1">Patents:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body1">{numberWithCommas(counters.patent)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(counters.difference_patent)}/>
            </div>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body1">Applications:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body1">{numberWithCommas(counters.application)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(counters.difference_application)}/>
            </div>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body1">Acquired:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body1">{numberWithCommas(transactionsCounters.buy)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(transactionsCounters.diff_buy_patent)}/>
            </div>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body1">Sold:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body1">{numberWithCommas(transactionsCounters.sale)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(transactionsCounters.diff_sale_patent)}/>
            </div>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body1">Licensed In:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body1">{numberWithCommas(transactionsCounters.license_in)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(transactionsCounters.diff_license_in_patent)}/>
            </div>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body1">Licensed Out:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body1">{numberWithCommas(transactionsCounters.license_out)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(transactionsCounters.diff_license_out_patent)}/>
            </div>
          </div>
        </Grid>
        {/* <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body2">Securities:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body2">{numberWithCommas(transactionsCounters.security)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(transactionsCounters.diff_security_patent)}/>
            </div>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.summaryItemContainer}>
            <div className={classes.cell}>
              <Typography variant="body2">Released:</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <Typography variant="body2">{numberWithCommas(transactionsCounters.release)}</Typography>
            </div>
            <div className={`${classes.cell} ${classes.flexEnd}`}>
              <SummaryItemTotalGrowth classes={classes} data={parseInt(transactionsCounters.diff_release_patent)}/>
            </div>
          </div>
        </Grid> */}
      </Grid>
    </div>
  )
}

export default AssetsSummary
