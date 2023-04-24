import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    useDispatch,
    useSelector
} from 'react-redux'
import moment from 'moment'
import _debounce from 'lodash/debounce'
/* import { DataSet } from 'vis-data-71/esnext'
import { Timeline } from 'vis-timeline/esnext' */

import { DataSet } from 'vis-data/esnext'
import { Timeline } from 'vis-timeline-73/esnext'
import { Typography, CircularProgress, IconButton, Paper, Modal, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Close, Fullscreen } from '@mui/icons-material'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import useStyles from './styles'
import clsx from 'clsx'
import { numberWithCommas, capitalize, toTitleCase } from '../../utils/numbers'
import { assetsTypesWithKey, convertTabIdToAssetType } from '../../utils/assetTypes'
import { timelineOptions, timelineWithoutClusterOptions } from '../../utils/options'
import PatenTrackApi from '../../api/patenTrack2'
import themeMode from '../../themes/themeMode'
import AddToolTip from './AddToolTip'
import { setConnectionBoxView, setConnectionData, setPDFFile, setPDFView } from '../../actions/patenTrackActions'
import { retrievePDFFromServer, setAssetsIllustration } from '../../actions/patentTrackActions2'
import PdfViewer from '../common/PdfViewer'
import FullScreen from '../common/FullScreen'

const DATE_FORMAT = 'MMM DD, YYYY'
const CDN_PATH_LOGO = process.env.REACT_APP_COMPANY_PATH
const NO_IMAGE_AVAILABLE = 'no_image_available.jpg'

const TIME_INTERVAL = 1000
var tootlTip = ''
const TimelineChart = (props) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const timelineRef = useRef() //timeline Object ref
    const timelineContainerRef = useRef() //div container ref
    const items = useRef(new DataSet()) // timeline items dataset
    const [options, setTimelineOptions] = useState({
        ...timelineWithoutClusterOptions,
        template: function (item, element, data) {
            if (data.isCluster) {
                return `<span class="cluster-header">Cluster containing ${data.items.length} events.</span>`
            } else {
                if (data.rawData.tab_id != 10) {
                    let image = data.rawData.logo
                    if (image !== '' && image !== null && image != undefined) {
                        if (image.indexOf('http') === -1) {
                            image = CDN_PATH_LOGO + image
                        }
                    } else {
                        image = CDN_PATH_LOGO + NO_IMAGE_AVAILABLE
                    }
                    return `<div class="first" style="display: flex;">
                            <div class="flexMain">
                                <div class="textColumn text-height" >${toTitleCase(data.rawData.customerName)}</div>
                                <div class="textColumn">${numberWithCommas(data.rawData.totalAssets)} Asset${data.rawData.totalAssets > 1 ? 's' : ''}</div>
                                <div class="textColumn small-font">${moment(new Date(data.start)).format(DATE_FORMAT)}</div>
                            </div>
                        </div>
                        <div class="second"><span class="img-holder">
                            <img class="${data.rawData.logo == '' || data.rawData.logo == null ? 'no-image' : ''}" src='${image}' /></span>
                        </div>`
                } else {
                    return `<span class="${data.assetType} ${data.rawData.tab_id}">${data.customerName}</span>`
                }
            }
        },
        /* cluster: {
            maxItems: typeof props.standalone != 'undefined' && props.standalone === true ? 10 : 6,
            clusterCriteria: (firstItem, secondItem) => { 
              return  (firstItem.rawData.customerName.toString().toLowerCase() == secondItem.rawData.customerName.toString().toLowerCase())
            }
        } */
    })
    const [isLoadingTimelineData, setIsLoadingTimelineData] = useState(false)
    const [isLoadingTimelineRawData, setIsLoadingTimelineRawData] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [timelineRawData, setTimelineRawData] = useState([])
    const [timelineItems, setTimelineItems] = useState([])
    const [tooltipItem, setToolTipItem] = useState([])
    const [itemData, setItemData] = useState([])
    const [timeInterval, setTimeInterval] = useState(null)
    const [selectTransaction, setSelectTransaction] = useState(null)
    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    const selectedWithName = useSelector(state => state.patenTrack2.mainCompaniesList.selectedWithName)
    const screenWidth = useSelector(state => state.patenTrack.screenWidth)
    const screenHeight = useSelector(state => state.patenTrack.screenHeight)

    const fullScreenItems = [
        {
            id: 1,
            label: '',
            component: PdfViewer,
            display: true,
            pdfTab: 0,
            show_tab: false
        }
    ]

    const handleOpenPDF = async (item) => {
        const { data } = await PatenTrackApi.getCollectionIllustration(item.rf_id)
        if (data != null) {
            const obj = data.line.length > 0 ? data.line[0] : null
            if (obj != null) {
                setFullScreen(true)
                dispatch(
                    setConnectionData(obj)
                )
                dispatch(
                    setPDFView(true)
                )
                dispatch(
                    setConnectionBoxView(true)
                )
                if (obj.document1.indexOf('legacy-assignments.uspto.gov') !== -1 || (obj.document1 == "" && obj.ref_id > 0)) {
                    obj.rf_id = obj.ref_id
                    dispatch(retrievePDFFromServer(obj))
                } else {
                    dispatch(
                        setPDFFile(
                            {
                                document: obj.document1,
                                form: obj.document1,
                                agreement: obj.document1
                            }
                        )
                    )
                }
            }
        }
    }

    const handleClose = () => {
        setOpenModal(false)
    }

    const onRangeChange = useCallback((properties) => {

    }, [timelineItems])


    /**
     * this call when Timeline rangechanged
     */

    const onRangeChanged = useCallback(async (properties) => {
        items.current = new DataSet()
        if (properties.byUser === true) {
            let filter = timelineItems.filter(row => new Date(row.start) >= new Date(properties.start) &&  new Date(row.start) <= new Date(properties.end)) 
            items.current.add(filter)
        } else {
            items.current.add(timelineItems)
        }
        timelineRef.current.setItems(items.current)
    }, [timelineItems])


    const onSelect = useCallback((properties) => {
        const { items, event } = properties
        const { nodeName } = event.target.parentNode
        const item = timelineRef.current.itemsData.get(items)
        if (item.length > 0) {
            showTooltip(item[0], event, true)
        }
    }, [selectTransaction])

    const findImageColor = (item) => {
        let image = '', color = '';
        switch (parseInt(item.tab_id)) {
            case 1:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/acquisition.png'
                color = '#E60000'
                break;
            case 2:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/sales.png'
                color = '#70A800'
                break;
            case 3:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/licensein.png'
                color = '#E69800'
                break;
            case 4:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/licenseout.png'
                color = '#E69800'
                break;
            case 5:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
                color = '#00a9e6'
                break;
            case 6:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerin.png'
                color = '#FFFFFF'
                break;
            case 7:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/mergerout.png'
                color = '#FFFFFF'
                break;
            case 8:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/options.png'
                color = '#000000'
                break;
            case 9:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/courtorder.png'
                color = '#E60000'
                break;
            case 10:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/employee.png'
                color = '#FFFFFF'
                break;
            case 11:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/release.png'
                color = '#00a9e6'
                break;
            case 12:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
                color = '#00a9e6'
                break;
            case 13:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png'
                color = '#00a9e6'
                break;
            case 14:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png'
                color = '#FFFFFF'
                break;
            case 14:
            default:
                image = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/other.png'
                color = '#FFFFFF'
                break;
        }
        return { image, color }
    }
    // Custom ToolTip

    const showTooltip = (item, event, onselect) => {
        setTimeout(() => {
            if (tootlTip === item.id || (typeof onselect !== 'undefined' && onselect === true)) {
                PatenTrackApi
                    .cancelTimelineItemRequest()
                PatenTrackApi
                    .getTimelineItemData(item.id)
                    .then(response => {
                        const { data } = response
                        if (data != null && (data.assignor.length > 0 || data.assignee.length > 0) && tootlTip === data.assignment.rf_id) {
                            const executionDate = data.assignor.length > 0 ? data.assignor[0].exec_dt : ''
                            let transactionType = convertTabIdToAssetType(item.tab_id)
                            const findIndex = assetsTypesWithKey.findIndex(row => row.type == transactionType)

                            if (findIndex !== -1) {
                                transactionType = assetsTypesWithKey[findIndex].name
                            } else {
                                transactionType = capitalize(transactionType)
                            }
                            let { image, color } = findImageColor(item)

                            let calcLeft = event.clientX + 20, calcTop = event.clientY
                            if ((calcLeft + 100) > screenWidth) {
                                calcLeft = screenWidth - 300
                            }
                            if ((calcTop + 160) > screenHeight) {
                                calcTop = screenHeight - 350
                            }
                            const checkFullScreen = document.getElementsByClassName('fullscreenModal');
                            const element = checkFullScreen.length > 0 ? checkFullScreen[0].querySelector(`#timeline-${props.id}`) : document.getElementById(`timeline-${props.id}`);
                            const getPosition = element.getBoundingClientRect();

                            let tootltipTemplate = `<div class='custom_tooltip' style='border: 1px solid ${color} ;top:${getPosition.y + 5}px;left:${getPosition.x}px;background:${isDarkTheme ? themeMode.dark.palette.background.paper : themeMode.light.palette.background.paper};color:${isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}'>
                <div style='display:flex;'><div style='display:flex;flex-direction: column;${typeof data.releaseAssignor != 'undefined' && data.releaseAssignor.length > 0 ? "max-width: 48%;margin-right: 10px;" : ""} '>                            
                <h4 style='color:${color};text-align:left;margin:0'>${transactionType}</h4>
                                            <div>
                                            ${executionDate != '' ? moment(executionDate).format('ll') : ''}
                                            </div>
                                            <div>
                                            <h4>Assignors:</h4>
                                            ${data.assignor.map(or => (
                                '<div>' + or.original_name + '</div>'
                            )).join('')}
                                            </div>
                                            <div>
                                            <h4>Assignees:</h4>
                                            ${data.assignee.map(ee => (
                                '<div>' + ee.original_name + '</div>'
                            )).join('')}
                </div></div>`;
                            if (typeof data.releaseAssignor != 'undefined' && data.releaseAssignor.length > 0) {
                                const { releaseAssignor, releaseAssignee, releaseAssignment } = data
                                const releaseExecutionDate = releaseAssignor.length > 0 ? releaseAssignor[0].exec_dt : ''
                                tootltipTemplate += `<div style='display:flex;flex-direction: column;'><h4 style='color:#00a9e6;text-align:left;margin:0'>Release</h4><div>
                    ${releaseExecutionDate != '' ? moment(releaseExecutionDate).format('ll') : ''}
                    </div>
                    <div>
                    <h4>Assignors:</h4>
                    ${releaseAssignor.map(or => (
                                    '<div>' + or.original_name + '</div>'
                                )).join('')}
                    </div>
                    <div>
                    <h4>Assignees:</h4>
                    ${releaseAssignee.map(ee => (
                                    '<div>' + ee.original_name + '</div>'
                                )).join('')}
                    </div></div>`
                            }

                            tootltipTemplate += `</div></div>`
                            resetTooltipContainer()
                            if (timelineContainerRef.current != null && timelineContainerRef.current.childNodes != null) {
                                document.body.insertAdjacentHTML('beforeend', tootltipTemplate)
                                //timelineContainerRef.current.childNodes[0].insertAdjacentHTML('beforeend',tootltipTemplate)
                            }
                        } else {
                            resetTooltipContainer()
                        }
                    })
            }
        }, TIME_INTERVAL)
    }


    /**
    * on Itemover for the tooltip data
    */

    const onItemover = useCallback(({ item, event }) => {
        const overItem = timelineRef.current.itemsData.get(item)
        if (overItem != null) {
            onItemout()
            tootlTip = overItem.rawData.id
            showTooltip(overItem.rawData, event)
        }
    }, [timelineItems, timeInterval])

    /**
     * on onItemout for the remove tooltip
     */

    const onItemout = () => {
        tootlTip = ''
        PatenTrackApi.cancelTimelineItemRequest()
        resetTooltipContainer()
        setToolTipItem([])

        /* clearInterval(timeInterval) */
    }

    const resetTooltipContainer = () => {
        const findOldToolTip = document.getElementsByClassName('custom_tooltip')
        if (findOldToolTip.length > 0) {
            findOldToolTip[0].parentNode.removeChild(findOldToolTip[0])
        }
    }


    useEffect(() => {
        timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
        return (() => { })
    }, [])

    /**
     * Intial timline items dataset and ref setup
     */
    useEffect(() => {
        items.current = new DataSet()
        timelineRef.current.setOptions(options)
        timelineRef.current.on('select', onSelect)
        timelineRef.current.on('itemover', onItemover)
        timelineRef.current.on('itemout', onItemout)
        timelineRef.current.on('rangechanged', onRangeChanged)
        timelineRef.current.on('rangechange', onRangeChange)
        return () => {
            timelineRef.current.off('select', onSelect)
            timelineRef.current.off('itemover', onItemover)
            timelineRef.current.off('itemout', onItemout)
            timelineRef.current.off('rangechange', onRangeChange)
            timelineRef.current.off('rangechanged', onRangeChanged)
        }
    }, [onRangeChange, onRangeChanged, onSelect, onItemover])

    useEffect(() => {
        let { list } = props.card
        if (props.card.type == 4 || props.card.type == 7) {
            let removeRelease = []
            list.forEach(item => {
                if (parseInt(item.release_rf_id) > 0) {
                    removeRelease.push(item.release_rf_id);
                    const getOtherRelease = item.all_release_ids
                    if (getOtherRelease != '') {
                        const parseRelease = JSON.parse(getOtherRelease)
                        if (parseRelease.length > 0) {
                            parseRelease.forEach(row => removeRelease.push(Number(row.rf_id)))
                        }
                    }
                }
            })
            if (removeRelease.length > 0) {
                removeRelease = [...new Set(removeRelease)];

                removeRelease.forEach(remove => {
                    const findIndex = list.findIndex(item => item.id == remove)
                    if (findIndex !== -1) {
                        list.splice(findIndex, 1)
                    }
                })
            }
        }
        setTimelineRawData(list)
        return (() => { })
    }, [props])

    //Item for the timeline

    const convertDataToItem = (assetsCustomer) => {

        const assetType = Number.isInteger(assetsCustomer.tab_id) ? convertTabIdToAssetType(assetsCustomer.tab_id) : 'default'
        const companyName = selectedWithName.filter(company => assetsCustomer.company == company.id ? company.name : '')
        const customerFirstName = assetsCustomer.tab_id == 10 ? assetsCustomer.customerName.split(' ')[0] : assetsCustomer.customerName;

        const item = {
            type: 'point',
            start: new Date(assetsCustomer.exec_dt),
            customerName: `${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`,
            customerNameCluster: customerFirstName,
            assetType,
            companyName,
            rawData: assetsCustomer,
            className: `asset-type-${assetType} ${assetsCustomer.release_exec_dt != null ? assetsCustomer.partial_transaction == 1 ? 'asset-type-security-release-partial' : 'asset-type-security-release' : ''}`,
            collection: [{ id: assetsCustomer.id, totalAssets: assetsCustomer.totalAssets }],
            showTooltips: false
        }

        if ([5, 12].includes(parseInt(assetsCustomer.tab_id))) {
            item.type = 'range';
            item['end'] = assetsCustomer.release_exec_dt != null ? new Date(assetsCustomer.release_exec_dt) : new Date();

            const securityPDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.reel_no}-${assetsCustomer.frame_no}.pdf`
            item['security_pdf'] = securityPDF
            /* let name = `<tt><img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/></tt><dd>${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})</dd>`;
            name += `<em>`
            if(assetsCustomer.release_exec_dt != null ) {
                const getAllReleases = assetsCustomer.all_release_ids
                if(getAllReleases != '') {
                    const parseReleases = JSON.parse(getAllReleases)
                    parseReleases.forEach((r, index) => {
                        name += `<img title='${index}' src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png'/>`
                    })
                }
                const releasePDF = `https://s3-us-west-1.amazonaws.com/static.patentrack.com/assignments/var/www/html/beta/resources/shared/data/assignment-pat-${assetsCustomer.release_reel_no}-${assetsCustomer.release_frame_no}.pdf`
                item['release_pdf'] = releasePDF
            }
            name += `${assetsCustomer.partial_transaction == 1 ? `<span>(${numberWithCommas(assetsCustomer.releaseAssets)})</span>` : ''}</em>` */
            let name = `${customerFirstName} (${numberWithCommas(assetsCustomer.totalAssets)})`
            item['customerName'] = name
        }
        return item
    }

    /**
     * Add timeline items to the the dataset and set the start, end, min and max date
     */
    useEffect(() => {
        if (isLoadingTimelineRawData) return null

        const clusteredItems = timelineRawData.reduce((result, dataItem) => {
            const itemName = dataItem.tab_id == 10 ? dataItem.customerName.split(' ')[0] : dataItem.customerName
            result[`${dataItem.id}_${itemName}_${dataItem.exec_dt}`] = convertDataToItem(dataItem)
            return result
        }, {})

        const convertedItems = Object.values(clusteredItems).sort((a, b) => (new Date(a.start) > new Date(b.start)))

        setTimelineItems(convertedItems)
        items.current = new DataSet()
        let start = new moment(), end = props.type === 4 ? new moment(new Date('2500-01-01')) : new moment().add(1, 'year')
        /* if(timelineRef.current !== null && convertedItems.length > 0) {
            timelineRef.current.destroy()
            timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
            timelineRef.current.setOptions(options) 
            timelineRef.current.on('select', onSelect)
            timelineRef.current.on('itemover', onItemover)
            timelineRef.current.on('itemout', onItemout)
            console.log("timelineRef", timelineRef)
        } */

        if (convertedItems.length > 0) {
            /* start = props.type === 5 ? new moment(convertedItems[0].start).subtract(1, 'week') : props.type === 4 ? new moment(new Date('1900-01-01')) : new moment(convertedItems[convertedItems.length - 1].start).subtract(1, 'week') */
            start = new Date()
            end = new Date()
            const promise = convertedItems.map((c, index) => {
                let newDate = new Date(c.start);
                //let endDate = typeof c.end != 'undefined' && c.end != null ? new Date(c.end) : newDate
                /* if(index === 0) {
                    end = endDate
                } */
                if (newDate.getTime() < start.getTime()) {
                    start = newDate
                }
                /*  if(endDate.getTime() > end.getTime()) {
                     end = endDate
                 }  */
                return c
            })
            Promise.all(promise)
            let min = start
            if (convertedItems.length > 26) {
                start = new Date(convertedItems[25].start)
                min = new Date(convertedItems[convertedItems.length - 1].start)
            } else {
                start = new moment(start).subtract(1, 'year')
            }
            //
            if(props.type != 5) {
                end = new moment().add(6, 'month')
            } else {
                end = new Date()
            }
            
            if (timelineRef.current !== null && timelineRef.current != undefined && typeof timelineRef.current.destroy === 'function' && typeof props.standalone !== 'undefined') {
                timelineRef.current.destroy()
                timelineRef.current = new Timeline(timelineContainerRef.current, [], options)
                setTimeout(() => {
                    drawTimeline(start, end, min, convertedItems)
                }, 1)
            } else {
                items.current.add(convertedItems.slice(0, convertedItems.length > 26 ? 25 : convertedItems.length - 1))
                timelineRef.current.setOptions({ ...options, start, end, min, max: end })
                timelineRef.current.setItems(items.current)
            }
        } else { 
            start = new moment().subtract(1, 'year')
            end = new moment().add(6, 'month')
            items.current.add([])
            timelineRef.current.setItems(items.current)
            timelineRef.current.setOptions({ ...options, start, end, min: start, max: end })
        }

        return (() => { })
    }, [timelineRawData])


    const drawTimeline = (start, end, min, convertedItems) => {
        items.current.add(convertedItems.slice(0, convertedItems.length > 26 ? 25 : convertedItems.length - 1))
        timelineRef.current.setOptions({ ...options, start, end, min: min, max: end })
        timelineRef.current.setItems(items.current)
    }
    return (
        <Paper className={clsx(classes.container, classes.columnDirection)} square>
            {
                props.card.title != '' && (
                    <div className={clsx(classes.timelineHeading, 'full_heading')}>
                        <Typography variant="h6" component="div" align="center" className={clsx(classes.border, 'dashboard_buttons', classes.border1)}>
                            {props.card.title} - {numberWithCommas(timelineRawData.length)}
                        </Typography>
                        <div className={classes.fullscreenButton}>
                            <AddToolTip
                                tooltip={typeof props.standalone !== 'undefined' ? 'Close big screen view.' : 'Big screen view.'}
                                placement='bottom'
                            >
                                <IconButton size="small"
                                    onClick={() => props.handleFullScreen(props.type)}
                                    className={clsx(classes.actionIcon, typeof props.standalone !== 'undefined' ? classes.fontStandalone : '')}
                                >
                                    {typeof props.standalone !== 'undefined' ? <Close /> : <Fullscreen />}
                                </IconButton>
                            </AddToolTip>
                        </div>
                    </div>
                )
            }
            <div className={clsx(classes.timelineContainer, { [classes.timelineContainerFullheight]: typeof props.standalone !== 'undefined' ? props.standalone : props.card.type === 7 ? true : false })}>
                <div
                    id={`timeline-${props.id}`}
                    style={{
                        filter: `blur(${isLoadingTimelineRawData ? '4px' : 0})`
                    }}
                    ref={timelineContainerRef}
                    className={clsx(classes.timeline, 'timeline')}
                />
                {
                    isLoadingTimelineData &&
                    <CircularProgress size={15} color={'secondary'} className={classes.timelineProcessingIndicator} />
                }
                {isLoadingTimelineRawData && <CircularProgress className={classes.loader} />}
            </div>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', width: 400, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'hidden auto' }}
            >
                <TableContainer component={Paper} style={{ height: '100%', border: '1px solid #0B0C0E' }}>
                    <IconButton
                        onClick={handleClose}
                        className={clsx(classes.right)}
                        size="large">
                        <Close />
                    </IconButton>
                    <Table>
                        <TableBody>
                            {
                                itemData.map(item => (
                                    <TableRow>
                                        <TableCell>
                                            {item.exec_dt}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleOpenPDF(item)}
                                            >
                                                <img src='https://s3.us-west-1.amazonaws.com/static.patentrack.com/icons/pdf.png' />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            {item?.total_assets ? item.total_assets : ''}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Modal>
            {
                fullScreen === true && (
                    <FullScreen
                        componentItems={fullScreenItems}
                        showScreen={true}
                        setScreen={setFullScreen}
                    />
                )
            }
        </Paper>
    )
}

export default TimelineChart;