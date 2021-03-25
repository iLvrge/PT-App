import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Box, Collapse, Tooltip, Checkbox,  TableRow, TableCell, CircularProgress } from '@material-ui/core'
import { AutoSizer, Column, SortDirection, Table, defaultTableRowRenderer } from 'react-virtualized'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DEFAULT_CUSTOMERS_LIMIT } from '../../../api/patenTrack2'
import {
    setSelectedAssetsTypes,
    getAssetsCustomers,
    getMoreAssetsCustomers,
    setSelectedAssetsCustomers,
  } from '../../../actions/patentTrackActions2'

import useStyles from './styles' 
import clsx from 'clsx'

const CustomerTable = ({ assetType, counter }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [ rowHeight, setRowHeight ] = useState(40)
    const isLoadingCustomers = useSelector(state => state.patenTrack2.assetsCustomersLoading)
    const assetsCustomers = useSelector(state => state.patenTrack2.assets[assetType])
    const selectedCompaniesList = useSelector(state => state.patenTrack2.selectedCompaniesList)
    const [ offset, setOffset ] = useState(DEFAULT_CUSTOMERS_LIMIT)
    const _getRowHeight = ({ index }) => 40  

    const getRowClassName = useCallback(() => {
        return clsx(classes.tableRow, classes.flexContainer, classes.tableRowHover)
    }, [ classes ])

    const checkBoxRender = useCallback(({ cellData, columnIndex, rowIndex }) => {
        return (
            <Tooltip title={cellData}>        
            <TableCell
                className={clsx(classes.tableCell, classes.flexContainer)}
                variant="body"
                style={{ height: rowHeight }}>
                <Checkbox  />
            </TableCell>
            </Tooltip>
        )
    }, [ classes, rowHeight ])

    const cellRenderer = useCallback(({ cellData, columnIndex, rowIndex }) => {
        return (
            <Tooltip title={cellData}>        
            <TableCell
                className={clsx(classes.tableCell, classes.flexContainer)}
                variant="body"
                style={{ height: rowHeight }}>
                {cellData}
            </TableCell>
            </Tooltip>
        )
    }, [ classes, rowHeight ])  

    const rowRenderer = props => {
        const { index, style, className, key, rowData } = props;        
        return defaultTableRowRenderer(props);
    }

    useEffect(() => {
        const companyIds = selectedCompaniesList.map(company => company.id)
        dispatch(getAssetsCustomers(assetType, companyIds))
        setOffset(DEFAULT_CUSTOMERS_LIMIT)
    }, [ assetType, selectedCompaniesList ])

    const handleOnClickLoadMore = useCallback(() => {
        const companyIds = selectedCompaniesList.map(company => company.id)
        dispatch(getMoreAssetsCustomers(assetType, companyIds, offset))
        setOffset(currOffset => (currOffset + DEFAULT_CUSTOMERS_LIMIT))
    }, [ assetType, dispatch, offset, selectedCompaniesList ])

    useEffect(() => {
        console.log("assetsCustomers", assetsCustomers)
    }, [assetsCustomers])

    return (
        <>
        {
            isLoadingCustomers
            ?
                <CircularProgress size={16} color={'#fff'} style={{marginTop: 4}} />
            :
            
            <InfiniteScroll
                dataLength={Object.keys(assetsCustomers).length}
                next={handleOnClickLoadMore}
                hasMore={Object.keys(assetsCustomers).length < counter}
                scrollableTarget={`collapse_list_${assetType}`}
                loader={<div className={classes.listInfinityLoader} ><CircularProgress size={20} color='secondary' /></div>}
            >
                <AutoSizer>
                    {({ height, width }) => (
                        <Table
                            className={classes.table}
                            rowRenderer={rowRenderer}
                            rowClassName={getRowClassName}
                            headerHeight={rowHeight}
                            width={width}
                            height={height}
                            rowHeight={_getRowHeight}
                            rowCount={assetsCustomers.length}
                            rowGetter={({ index }) => assetsCustomers[index]}
                        >
                            <Column
                            label=''
                            dataKey='customer_id'
                            width={ width * 0.16 }
                            className={classes.flexContainer}
                            cellRenderer={checkBoxRender}
                            />
                            <Column
                            label='Name'
                            dataKey='name'
                            className={classes.flexContainer}
                            width={ width * 0.66 }
                            cellRenderer={cellRenderer}
                            />
                            <Column
                            label=''
                            dataKey='transactionCount'
                            className={classes.flexContainer}
                            width={ width * 0.18 }
                            cellRenderer={cellRenderer}
                            />
                        </Table> 
                    )}
                </AutoSizer> 
            </InfiniteScroll>
        }
        </>
    )
}

export default CustomerTable
