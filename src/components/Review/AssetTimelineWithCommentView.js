import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import SplitPane from 'react-split-pane'
import queryString from 'query-string'

import AssetsVisualizer from '../common/AssetsVisualizer'
import AssetsCommentsTimeline from '../common/AssetsCommentsTimeline'
/* import AssetsSummary from '../common/AssetsSummary' */
import { resizePane, resizePane2 } from '../../utils/splitpane'
import { setSlackAuthCode, getSlackAuthCode } from '../../utils/tokenStorage'


import useStyles from './styles'
import clsx from 'clsx'

const AssetTimelineWithCommentView = () => {

    const classes = useStyles()
    const location = useLocation()
    const dispatch = useDispatch()
    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)
    const [ assetsCommentsTimelineMinimized, setAssetsCommentsTimelineMinimized ] = useState(false)
    const [illustrationRecord, setIllustrationRecord] = useState()
    const [ commentBarSize , setCommentBarSize ] = useState('30%')

    const [size, setSize] = useState(0)

    const toggleMinimizeAssetsCommentsTimeline = useCallback(() => {
        setAssetsCommentsTimelineMinimized(assetsCommentsTimelineMinimized => !assetsCommentsTimelineMinimized)
    }, [])

    useEffect(() => {
        const querystring = queryString.parse( location.search )
        if( Object.keys(querystring).length > 0 && querystring.code != '' ){
            setSlackAuthCode( querystring.code )
            console.log( "getSlackAuthCode", getSlackAuthCode() )
        }
    }, [ location ])

    return(
        <>
            <Grid
                item
                lg={gridWidthClassNumber}
                md={gridWidthClassNumber}
                sm={gridWidthClassNumber}
                xs={gridWidthClassNumber}
                className={classes.flexColumn}
                style={{ flexGrow: 1, height: '100%'}} 
                >
                    {/* <div className={classes.assetSummary}>
                        <AssetsSummary />
                    </div> */}
                    <SplitPane
                        className={clsx(classes.splitPane, classes.splitPane2OverflowHidden, { [classes.minimized]: assetsCommentsTimelineMinimized })}
                        split="horizontal"
                        minSize={50}
                        defaultSize={commentBarSize}
                        onDragFinished={(size) => {
                            resizePane2(size, setSize)
                            resizePane('split5', size, setCommentBarSize)
                        }}
                        primary={'second'}
                        >
                            <AssetsVisualizer
                            toggleMinimize={toggleMinimizeAssetsCommentsTimeline}
                            isMinimized={assetsCommentsTimelineMinimized}
                            setIllustrationRecord={setIllustrationRecord} />

                            <AssetsCommentsTimeline toggleMinimize={toggleMinimizeAssetsCommentsTimeline} size={size}/>
                    </SplitPane>
            </Grid>            
        </>
    )
}



export default AssetTimelineWithCommentView