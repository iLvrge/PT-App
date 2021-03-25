import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Paper, List, ListSubheader, CircularProgress, IconButton } from '@material-ui/core'
import AssetsTransactionRow from './AssetsTransactionRow'
import ArrowButton from '../ArrowButton'
import {
    getAssetsTransactions,  
  } from '../../../actions/patentTrackActions2'


  
import { DEFAULT_TRANSACTIONS_LIMIT } from '../../../api/patenTrack2'


import InfiniteScroll from 'react-infinite-scroll-component'
import useStyles from './styles'

const AssetsTransactionStandalone = ({
    handleTransactionBarSize = (value) => {}
}) => {
    const classes = useStyles() 
    const dispatch = useDispatch() 
    const [assetType, setAssetType]   =  useState(0)
    const [companyId, setCompanyId]  = useState(0)
    const [customerId, setCustomerId]  = useState(0)

    const [toggleButtonType , setToggleButtonType] = useState(true)

    const [openBar, setOpenBar] = useState(true)
    const [transactionButtonVisible, setTransactionButtonVisible] = useState(false)

    const [transactions, setTransactions] = useState({transactions:[], transactionCount: 0})

    const assets = useSelector(state => state.patenTrack2.assets)

    const reviewTransactionView = useSelector(state => state.patenTrack2.reviewTransactionView)
    const [ offset, setOffset ] = useState(0)

    const handleTransactionBarOpen = () => {
        setToggleButtonType( !toggleButtonType )
        setOpenBar( !openBar )
        if(!openBar === false) {
            handleTransactionBarSize(25)
        } else {
            handleTransactionBarSize(150)
        }
    }

    const handleTransactionButton = (event, flag) => {
        event.preventDefault()
        setTransactionButtonVisible( flag )
    }

    useEffect(()  =>{
        if(reviewTransactionView.customerId > 0) {
            setCompanyId(reviewTransactionView.companyId)
            setAssetType(reviewTransactionView.assetType)
            setCustomerId(reviewTransactionView.customerId)

            if(assets[reviewTransactionView.assetType][reviewTransactionView.customerId]){
                const newTransactions = assets[reviewTransactionView.assetType][reviewTransactionView.customerId]
                const stateTransactions = {...transactions, ...newTransactions}
                setTransactions(stateTransactions)
            }
        }
    }, [reviewTransactionView, assets])


    const handleInfinityLoadMore = useCallback(() => {
        dispatch(getAssetsTransactions(assetType, companyId, customerId, offset))
        setOffset(currOffset => (currOffset + DEFAULT_TRANSACTIONS_LIMIT))
    }, [ assetType, dispatch, offset, companyId, customerId ])


    return(
        <Paper className={classes.root} square style={{ height: '100%' }}            
            onMouseOver={(event) => handleTransactionButton(event, true)}
            onMouseLeave={(event) => handleTransactionButton(event, false)}
        >
            
            {
                openBar === true
                ?
                    <>
                    
                    <List
                        dense
                        disablePadding
                        id={`collapse_list_transactions_${customerId}`}
                        className={classes.transactionList}
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                Assets <span className={classes.totalSelected}>{transactions != undefined && Object.keys(transactions.transactions).length > 0 && transactions.transactionCount ? transactions.transactionCount : ''}</span>
                            </ListSubheader>
                            }
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
                    </>
                :

                <div className={classes.showIcon}>
                    <IconButton onClick={handleTransactionBarOpen}><i class="fal fa-folder-tree"></i></IconButton>
                </div>
            }
            
        </Paper>
    )
}

export default AssetsTransactionStandalone