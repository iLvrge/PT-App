import React, 
        { useCallback, 
          useEffect, 
          useState,
          useRef,
          useMemo
        } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitPane from 'react-split-pane'

import MainCompaniesSelector from '../common/MainCompaniesSelector'
import AssignmentsType from '../common/AssignmentsType'
import ForeignAsset from '../common/ForeignAsset'
import IllustrationContainer from '../common/AssetsVisualizer/IllustrationContainer'
import TimelineContainer from '../common/AssetsVisualizer/TimelineContainer'

import useStyles from './styles'
import clsx from 'clsx'

const MobileScreen = (props) => {
    const classes = useStyles()
    const illustrationRef = useRef()
    const [defaultSize, setDefaultSize] = useState('50%')
    const [isDrag, setIsDrag] = useState(false)
    const [sheetName, setSheetName] = useState('')
    const [ isFullscreenOpen, setIsFullscreenOpen ] = useState(false)
    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedAssetAssignments = useSelector( state => state.patenTrack2.assetTypeAssignments.selected )
    const assetIllustration = useSelector(state => state.patenTrack2.assetIllustration)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const assetCompaniesRowSelect = useSelector(state => state.patenTrack2.mainCompaniesList.row_select)
	const search_string = useSelector(state => state.patenTrack2.search_string) 

    const handleTextChange = (name) => {
        setSheetName(name);
    }

    const shouldShowTimeline = useMemo(
        () => (!selectedAssetsPatents.length &&  !assetIllustration),
        [ selectedAssetsPatents, selectedAssetAssignments, assetIllustration ],
    )
    
    return (
        <SplitPane
            className={clsx(classes.splitPane, classes.splitPane2OverflowHidden, classes.splitPane1OverflowUnset, classes.paneHeightZero)}
            split={`horizontal`} 
            minSize={50}
            defaultSize={defaultSize}
            onDragStarted={() => {
                setIsDrag(!isDrag)
            }}
            onDragFinished={(size) => {
                setIsDrag(!isDrag)
            }} 
            maxSize={-10} 
            primary={'second'}
            ref={illustrationRef}
            pane1Style={{
                pointerEvents: isDrag === true ? 'none' : 'auto',
            }}
        >
            <div 
                className={classes.companyBar}>
                    {
                        props.openBar === true 
                        ? 
                            props.type == 9 
                                ? 
                                    <ForeignAsset 
                                        sheetName={sheetName} 
                                        handleSheetName={handleTextChange}
                                    />
                                :
                                    <MainCompaniesSelector 
                                        selectAll={false} 
                                        defaultSelect={''} 
                                        addUrl={true} 
                                        parentBarDrag={props.setVisualizerBarSize}
                                        parentBar={props.setVisualizeOpenBar}                                
                                    />
                        :
                        props.openTypeBar === true
                        ?
                            <AssignmentsType
                                parentBarDrag={props.setVisualizerBarSize}
                                parentBar={props.setVisualizeOpenBar}
                                type={props.type}
                                {...(props.type === 2 && {defaultLoad: false})}
                            />
                        :
                            ''
                    }
            </div>
            <div
                className={classes.companyBar}>
                {
                    props.openIllustrationBar === true && (   search_string != '' || 
                        assetCompaniesRowSelect.length > 0 || 
                        selectedCompaniesAll === true || 
                        selectedCompanies.length > 0 ||
                        props.type === 9
                    )
                    ?
                        shouldShowTimeline
                        ?
                            <TimelineContainer 
                                assignmentBar={props.assignmentBar} 
                                assignmentBarToggle={props.assignmentBarToggle} 
                                type={props.type}
                            />
                        :                            
                            <IllustrationContainer 
                                isFullscreenOpen={isFullscreenOpen} 
                                asset={assetIllustration} 
                                setIllustrationRecord={props.illustrationRecord} 
                                chartsBar={props.chartsBar}
                                chartsBarToggle={props.chartsBarToggle} 
                                checkChartAnalytics={props.checkChartAnalytics}
                                gap={props.gap}
                            />
                    :
                    ''
                }
            </div>
        </SplitPane>
    )
}

export default MobileScreen