import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Paper from '@material-ui/core/Paper'

import SpanVisualize from './SpanVisualize'

import useStyles from './styles'

const LifeSpanContainer = () => {
    const classes = useStyles() 
    const [ selectedTab, setSelectedTab ] = useState(0)

    const selectedAssetsTransactionLifeSpan = useSelector(state => state.patenTrack2.transaction_life_span)

    const handleChangeTab = (e, newTab) => setSelectedTab(newTab)

    if (selectedAssetsTransactionLifeSpan.length === 0) return null

    return (
        <Paper className={classes.root} square>  
            {selectedTab === 0 && <SpanVisualize chart={selectedAssetsTransactionLifeSpan} />}
            <Tabs
                value={selectedTab}
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleChangeTab}
                className={classes.tabs}
            >
                <Tab label="Lifespan" classes={{ root: classes.tab }} />
            </Tabs>
        </Paper>
    )
}

export default LifeSpanContainer