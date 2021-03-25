import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Paper, Grid, List, Typography} from '@material-ui/core'
import SplitPane from 'react-split-pane'

import AssetsVisualizer from '../common/AssetsVisualizer'
import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
import AssetsTransactionRow from '../common/AssetsController/AssetsTransactionRow'
/* import AssetsSummary from '../common/AssetsSummary'  */

import { DEFAULT_TRANSACTIONS_LIMIT } from '../../api/patenTrack2'
import CircularProgress from '@material-ui/core/CircularProgress'

import {
    getAssetsTransactions,  
  } from '../../actions/patentTrackActions2'

import InfiniteScroll from 'react-infinite-scroll-component'
import routes from '../../routeList'
import useStyles from './styles'
import clsx from 'clsx'

const AssetTimelineCommentWithTransactionView = () => {
    const classes = useStyles() 
    const dispatch = useDispatch() 

    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)
    const reviewTransactionView = useSelector(state => state.patenTrack2.reviewTransactionView)
    const selectedTimelineAsset = useSelector(state => state.ui.timeline.selectedAsset)
    const assets = useSelector(state => state.patenTrack2.assets)

    const [assetType, setAssetType]   =  useState(0)
    const [companyId, setCompanyId]  = useState(0)
    const [customerId, setCustomerId]  = useState(0)
    const [transactions, setTransactions] = useState({transactions:[], transactionCount: 0})
    const [ offset, setOffset ] = useState(0)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [illustrationRecord, setIllustrationRecord] = useState()
    const [ isDrag, setIsDrag ] = useState(false)


    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])

    const handleInfinityLoadMore = useCallback(() => {
        dispatch(getAssetsTransactions(assetType, companyId, customerId, offset))
        setOffset(currOffset => (currOffset + DEFAULT_TRANSACTIONS_LIMIT))
    }, [ assetType, dispatch, offset, companyId, customerId ])


    useEffect(()  =>{
        if(reviewTransactionView.customerId > 0) {
            setCompanyId(reviewTransactionView.companyId)
            setAssetType(reviewTransactionView.assetType)
            setCustomerId(reviewTransactionView.customerId)

            if(assets[reviewTransactionView.assetType][reviewTransactionView.customerId]){
                setTransactions(assets[reviewTransactionView.assetType][reviewTransactionView.customerId])
            }
        }
    }, [reviewTransactionView, assets])


    /* if(customerId == 0) return <Redirect to={routes.review} /> */

    return(   
        <>
            <Grid
                item
                lg={gridWidthClassNumber}
                md={gridWidthClassNumber}
                sm={gridWidthClassNumber}
                xs={gridWidthClassNumber}
                className={classes.flexColumn}
            >
                {/* <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{ flexBasis: 'auto' }} 
                >
                    <AssetsSummary />
                </Grid> */}
                <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    <Grid container 
                        style={{ flexGrow: 1, height: '100%'}} 
                    >
                        <Grid
                            item
                            lg={2}
                            md={2}
                            sm={2}
                            xs={2}
                            className={classes.flexColumn}
                            style={{ flexGrow: 1, height: '100%', paddingRight: 10 }}
                        >
                            <Paper className={classes.root} square style={{ height: '100%' }}>
                                <div className={classes.controllersContainer}>
                                    <div className={classes.controllers}>                       
                                        <Typography>Transactions</Typography>
                                        <div className={classes.totalSelected}>{Object.keys(transactions.transactions).length > 0 && transactions.transactionCount ? transactions.transactionCount : ''}</div> 
                                    </div>
                                </div>
                                <List
                                dense
                                disablePadding
                                id={`collapse_list_transactions_${customerId}`}
                                className={classes.transactionList}
                                >
                                {transactions.transactions && Object.keys(transactions.transactions).length >= 0 &&
                                    <InfiniteScroll
                                    dataLength={Object.keys(transactions.transactions).length}
                                    next={handleInfinityLoadMore}
                                    hasMore={Object.keys(transactions.transactions).length < transactions.transactionCount}
                                    scrollableTarget={`collapse_list_transactions_${customerId}`}
                                    loader={<div className={classes.listInfinityLoader} ><CircularProgress size={20} color='secondary' /></div>}
                                    >
                                    {Object.keys(transactions.transactions).map(transactionId => (
                                        <AssetsTransactionRow
                                        key={`${assetType}-company-${companyId}-customer-${customerId}-transaction-${transactionId}`}
                                        assetType={assetType}
                                        companyId={companyId}
                                        customerId={customerId}
                                        transactionId={transactionId}
                                        />
                                    ))}
                                    </InfiniteScroll>
                                }
                                </List>
                            </Paper>
                        </Grid>
                        <Grid
                            item
                            lg={10}
                            md={10}
                            sm={10}
                            xs={10}
                            className={classes.flexColumn}
                            style={{ flexGrow: 1, height: '100%'}}
                        >
                            <SplitPane
                                className={clsx(classes.splitPane, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                                split="horizontal"
                                minSize={100}
                                defaultSize={'70%'}
                                onChange={(size) => localStorage.setItem('midSplitPos', size)}
                                >
                                    <AssetsVisualizer
                                    toggleMinimize={toggleMinimizeAssetsCommentsTimeline}
                                    isMinimized={assetsCommentsTimelineMinimized}
                                    setIllustrationRecord={setIllustrationRecord} />

                                    <AssetsCommentsTimeline toggleMinimize={toggleMinimizeAssetsCommentsTimeline} />
                            </SplitPane>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}



export default AssetTimelineCommentWithTransactionView