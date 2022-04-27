import React, {useState, useRef, useEffect} from 'react'
import SplitPane from "react-split-pane"
import useStyles from "./styles"

import { updateResizerBar } from '../../../utils/resizeBar'
import ConnectionBox from '../ConnectionBox'
import PdfViewer from '../PdfViewer'


const IllustrationPdf = ({split, cls, primary, illustrationData, dragStart, dragFinished, analyticsBar, type}) => {
    const classes = useStyles();
    const [resizeFrame, setResizeFrame] = useState(false);
    const chartAnalyticsContainer = useRef(null);
    const [isDrag, setIsDrag] = useState(false);

    useEffect(() => {
        updateResizerBar(chartAnalyticsContainer, true, 1)
    }, [ chartAnalyticsContainer ])

    return (
        <div style={{ height: "100%" }} className={classes.root}>
            <SplitPane
                className={cls}
                split={split}
                minSize={10}
                maxSize={-100}
                defaultSize={'50%'}
                pane1Style={{
                pointerEvents: isDrag ? 'none' : 'auto',
                }}
                primary={primary}
                onDragStarted={() => {
                dragStart(true);
                setIsDrag(true);
                }}
                onDragFinished={size => {
                dragFinished(false);
                setIsDrag(false);
                }}
                ref={chartAnalyticsContainer}
            >
                <div
                id={`assets_`}
                style={{ height: "100%" }}
                >
                <PdfViewer
                    display={"false"}
                    fullScreen={false}
                    resize={resizeFrame}
                />
                </div>
                <div
                className={`${classes.commentContainer} ${
                    isDrag === true ? classes.notInteractive : classes.isInteractive
                }`}
                >
                    <ConnectionBox display={"false"} assets={illustrationData} type={type}/>
                </div>
            </SplitPane>
        </div>        
    )
}




export default IllustrationPdf