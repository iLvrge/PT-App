import React, 
        { useCallback, 
          useEffect, 
          useState,
          useRef
        } from 'react'

import SplitPane from 'react-split-pane'

import MainCompaniesSelector from '../common/MainCompaniesSelector'
import ForeignAsset from '../common/ForeignAsset'

import useStyles from './styles'
import clsx from 'clsx'

const MobileScreen = (props) => {
    const classes = useStyles()
    const illustrationRef = useRef()
    const [defaultSize, setDefaultSize] = useState('50%')
    const [isDrag, setIsDrag] = useState(false)
    const [sheetName, setSheetName] = useState('')


    const handleTextChange = (name) => {
        setSheetName(name);
    }

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
                                    <ForeignAsset sheetName={sheetName} handleSheetName={handleTextChange}/>
                                :
                                    <MainCompaniesSelector 
                                        selectAll={false} 
                                        defaultSelect={''} 
                                        addUrl={true} 
                                        parentBarDrag={props.setVisualizerBarSize}
                                        parentBar={props.setVisualizeOpenBar}                                
                                    />
                        :
                        '' 
                    }
            </div>
            <div></div>
        </SplitPane>
    )
}

export default MobileScreen