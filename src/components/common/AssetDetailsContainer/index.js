import React, { useState, useCallback, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import SplitPane from "react-split-pane"
import { IconButton, Modal, Paper } from "@mui/material"
import ConnectionBox from '../../common/ConnectionBox'
import FamilyItemContainer from '../AssetsVisualizer/FamilyItemContainer'
import USPTOContainer from '../AssetsVisualizer/USPTOContainer'
/* import FamilyContainer from '..//AssetsVisualizer/FamilyContainer' */
import LegalEventsContainer from '../AssetsVisualizer/LegalEventsContainer'
import LifeSpanContainer from '../AssetsVisualizer/LifeSpanContainer'
import InventionVisualizer from '..//AssetsVisualizer/InventionVisualizer'
import PdfViewer from '../../common/PdfViewer'
import {
  setTimelineSelectedItem,
  setTimelineSelectedAsset,
  toggleFamilyItemMode,
  toggleFamilyMode,
  toggleUsptoMode,
} from "../../../actions/uiActions"
import { updateResizerBar } from '../../../utils/resizeBar'

import ArrowButton from "../ArrowButton"
import useStyles from "./styles"
import GeoChart from "../AssetsVisualizer/GeoChart"
import GoogleCharts from "../AssetsVisualizer/GoogleCharts"
import TimelineSecurity from "../AssetsVisualizer/TimelineSecurity"
import ErrorBoundary from '../ErrorBoundary'

const AssetDetailsContainer = ({
  cls,
  split,
  minSize,
  defaultSize,
  fn,
  fnParams,
  fnVarName,
  dragStart,
  dragFinished,
  bar,
  chartBar,
  analyticsBar,
  primary,
  parentBarDrag,
  parentBar,
  illustrationData,
  visualizerBarSize,
  openCustomerBar,
  commentBar,
  illustrationBar,
  customerBarSize,
  companyBarSize,
  type,
  cube
}) => { 
  const classes = useStyles();
  const dispatch = useDispatch();
  const chartAnalyticsContainer = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  
  const [toggleDetailsButtonType, setToggleDetailsButtonType] = useState(true);
  const [openDetailsBar, setDetailsOpenBar] = useState(bar);
  const [detailsButtonVisible, setDetailsButtonVisible] = useState(false);
 
  const [
    toggleIllustrationButtonType,
    setToggleIllustrationButtonType,
  ] = useState(true);
  const [openIllustrationBar, setIllustrationOpenBar] = useState(true);
  const [illustrationButtonVisible, setIllustrationButtonVisible] = useState(
    false,
  );
  const [resizeFrame, setResizeFrame] = useState(false);

  const connectionBoxView = useSelector(
    state => state.patenTrack.connectionBoxView,
  );
  const assetIllustration = useSelector(
    state => state.patenTrack2.assetIllustration,
  );
  const selectedAssetsFamily = useSelector(
    state => state.patenTrack.assetFamily,
  );
  const selectedAssetsFamilyItem = useSelector(
    state => state.patenTrack.familyItem,
  );
  
  const pdfView = useSelector(state => state.patenTrack.pdfView);
  const pdfViewModal = useSelector(state => state.patenTrack.pdfViewModal)
  const timelineScreen = useSelector(state => state.ui.timelineScreen);
  const usptoMode = useSelector(state => state.ui.usptoMode);
  const familyMode = useSelector(state => state.ui.familyMode);
  const familyItemMode = useSelector(state => state.ui.familyItemMode);
  const lifeSpanMode = useSelector(state => state.ui.lifeSpanMode);
  const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
  const selectedAssetsLegalEvents = useSelector(state => state.patenTrack.assetLegalEvents)

  

  useEffect(() => {
    updateResizerBar(chartAnalyticsContainer, analyticsBar, 1)
  }, [ chartAnalyticsContainer, analyticsBar ])


  useEffect(() => {
    if(chartBar === true && analyticsBar === true && defaultSize == '100%') {
      fnParams('50%')
    }
  }, [chartBar, analyticsBar, defaultSize])

  /* useEffect(() => {        
        if( chartAnalyticsContainer != null && chartAnalyticsContainer.current != null ) {            
            if( familyItemMode === true && familyMode === true && familyDataRetrieved === true && legalEventDataRetrieved === true) {
                updateHeight()
            } 
        }
    }, [ familyItemMode, familyMode, familyDataRetrieved,  legalEventDataRetrieved, chartAnalyticsContainer ])


    const updateHeight = () => {
        setTimeout(() => {
            if( chartAnalyticsContainer.current != null && chartAnalyticsContainer.current.pane1 != null && chartAnalyticsContainer.current.pane2 != null ) {
                const pane1Container = chartAnalyticsContainer.current.pane1.querySelector('div#timelineCharts')
                const pane2Container = chartAnalyticsContainer.current.pane2.querySelector('div#familyTimeline')
                if( pane1Container != null && pane2Container != null ) { 
                    const pane2ItemSet = pane2Container.querySelector('div.vis-content div.vis-itemset')
                    const pane1Itemset = pane1Container.querySelector('div.vis-content div.vis-itemset')
                    if( pane2ItemSet != null && pane1Itemset != null ) {                        
                        const container2Height = pane2ItemSet.style.height
                        const container1Height = pane1Itemset.style.height
                        if(container2Height != '' && container1Height != '' && container2Height != 30 && container1Height != 30 ) {
                            let constValue = 1 - (parseInt(container1Height) / (parseInt(container1Height) + parseInt(container2Height)))
               
                            const calcHeight = 100 * constValue.toFixed('2')
                            if(calcHeight == 100) {
                                pane2Container.closest('div.Pane2').style.height = '34.2%'    
                            } else {
                                pane2Container.closest('div.Pane2').style.height = calcHeight + '%'
                            }
                            changeContainer()
                        } else { 
                            updateHeight()
                        }
                    } else { 
                        updateHeight()
                    } 
                } else {
                    updateHeight()
                }
            } else {
                updateHeight() 
            }          
        }, 100)
    } */

  

  const handleDetailsBarOpen = () => {
    setToggleDetailsButtonType(!toggleDetailsButtonType);
    parentBar(!bar);
    if (!bar === false) {
      parentBarDrag(0);
    } else {
      parentBarDrag("30%");
    }
  };

  const handleDetailsButton = (event, flag) => {
    event.preventDefault();
    setDetailsButtonVisible(flag);
  };

  const handleIllustrationButton = (event, flag) => {
    event.preventDefault();
    setIllustrationButtonVisible(flag);
  };

  const onCloseUspto = useCallback(() => {
    dispatch(toggleUsptoMode());
  }, [dispatch]);

  const onCloseFamilyMode = useCallback(() => {
    dispatch(toggleFamilyMode());
  }, [dispatch]);

  const onCloseFamilyItemMode = useCallback(() => {
    dispatch(toggleFamilyItemMode(false));
  }, [dispatch]);

  const changeContainer = () => {
    if (chartAnalyticsContainer.current != null) {
      const mainRoot = chartAnalyticsContainer.current.pane1.querySelector(
        "div.timelineRoot",
      );
      const timelineChart = chartAnalyticsContainer.current.pane1.querySelector(
        "div#timelineCharts",
      );
      if (mainRoot != undefined && timelineChart != undefined) {
        let alignItem = "flex-end";
        if (timelineChart.clientHeight > mainRoot.clientHeight) {
          alignItem = "flex-start";
        }
        mainRoot.style.alignItems = alignItem;
      }
    }
  };
  
  return (
    <div style={{ height: "100%" }} className={classes.root}>
      {
        usptoMode === true && (
          <USPTOContainer
            asset={assetIllustration} 
            onClose={onCloseUspto} 
            type={type}
          />
        )
      }
      {
        connectionBoxView === true  &&
        (  
          <SplitPane
            className={cls}
            split={split}
            minSize={10}
            maxSize={-100}
            defaultSize={illustrationData != '' && illustrationData != null && Object.keys(illustrationData).length > 0 ? '50%' : '0%'}
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
        )
      }
      {
        bar === true && (
          <SplitPane
            className={cls}
            split={split}
            minSize={minSize}
            maxSize={-100}
            defaultSize={defaultSize}
          /*  onChange={() => changeContainer()} */
            onDragStarted={() => {
              dragStart(true);
              setIsDrag(true);
            }}
            onDragFinished={size => {
              dragFinished(false);
              fn(fnVarName, size, fnParams);
              setIsDrag(false);
            }}
            pane1Style={{
              pointerEvents: isDrag ? 'none' : 'auto',
            }}
            primary={primary}
            ref={chartAnalyticsContainer}
          >
            <div
              id={`charts_container`}
              style={{ height: "100%" }}
            > 
              <ErrorBoundary>
                {/* <ArrowButton
                  arrowId={`arrow_charts`}
                  handleClick={handleDetailsBarOpen}
                  buttonType={toggleDetailsButtonType}
                  buttonVisible={detailsButtonVisible}
                  arrow={3}
                  cls={classes.btnLeft}
                /> */}

                {
                  pdfViewModal &&
                  <Modal open={pdfViewModal} className={classes.fullscreenChartsModal} >
                    <Paper className={classes.fullscreenCharts} square>
                      <PdfViewer display={'true'} />
                    </Paper>
                  </Modal>
                } 
                {
                  chartBar == true ? (
                    cube === true && assetIllustration == null
                    ?
                      <GeoChart
                        chartBar={chartBar} 
                        openCustomerBar={openCustomerBar} 
                        visualizerBarSize={visualizerBarSize}
                        type={type}
                      />
                    :
                    timelineScreen === true  && assetIllustration == null
                    ?
                      <GoogleCharts
                        chartBar={chartBar} 
                        openCustomerBar={openCustomerBar} 
                        visualizerBarSize={visualizerBarSize}
                        type={type}
                      />
                    :                  
                    connectionBoxView === true ? (
                        <PdfViewer
                          display={"false"}
                          fullScreen={false}
                          resize={resizeFrame}
                        />  
                    ) : lifeSpanMode === true ? (
                        <InventionVisualizer 
                          defaultSize={defaultSize} 
                          illustrationBar={openIllustrationBar} 
                          visualizerBarSize={visualizerBarSize} 
                          analyticsBar={analyticsBar} 
                          openCustomerBar={openCustomerBar} 
                          commentBar={commentBar} 
                          customerBarSize={customerBarSize} 
                          companyBarSize={companyBarSize}
                          type={type} />
                    ) : familyItemMode === true ? (
                        <FamilyItemContainer 
                          item={selectedAssetsFamilyItem} 
                          onClose={onCloseFamilyItemMode} 
                          analyticsBar={analyticsBar} 
                          chartBar={chartBar} 
                          illustrationBar={illustrationBar}
                          visualizerBarSize={visualizerBarSize} 
                          type={type}
                        />
                    ) : (
                      <InventionVisualizer 
                        defaultSize={defaultSize} 
                        illustrationBar={openIllustrationBar} 
                        visualizerBarSize={visualizerBarSize} 
                        analyticsBar={analyticsBar} 
                        openCustomerBar={openCustomerBar} 
                        commentBar={commentBar} 
                        customerBarSize={customerBarSize} 
                        companyBarSize={companyBarSize}
                        type={type} />
                    )
                  )
                  :
                    '' 
                }
              </ErrorBoundary>
            </div>
            <div
              className={`${classes.commentContainer} ${
                isDrag === true ? classes.notInteractive : classes.isInteractive
              }`}
              /* onMouseOver={event => handleIllustrationButton(event, true)}
              onMouseLeave={event => handleIllustrationButton(event, false)} */
            >
              <ErrorBoundary>
                {
                  analyticsBar === true 
                    ? 
                      timelineScreen === true  && assetIllustration == null
                      ?
                        <TimelineSecurity
                          chartBar={chartBar} 
                          openCustomerBar={openCustomerBar} 
                          visualizerBarSize={visualizerBarSize}
                          type={type}
                        />
                      :
                      openIllustrationBar === true ? (
                        <>
                          {      
                            lifeSpanMode === true ? (
                              <LifeSpanContainer 
                                chartBar={chartBar} 
                                openCustomerBar={openCustomerBar} 
                                visualizerBarSize={visualizerBarSize}
                                type={type}/>
                            ) :
                            familyMode && (
                                <LegalEventsContainer
                                  events={selectedAssetsLegalEvents} 
                                  type={type}/>
                            ) 
                          }
                        </>
                      ) :
                      (
                        <LifeSpanContainer 
                          chartBar={chartBar} 
                          openCustomerBar={openCustomerBar} 
                          visualizerBarSize={visualizerBarSize}
                          type={type}/>
                      )
                    : 
                      ''
                }
              </ErrorBoundary>
            </div>
          </SplitPane>
        ) 
      }    
    </div>
  ); 
};

export default AssetDetailsContainer;
