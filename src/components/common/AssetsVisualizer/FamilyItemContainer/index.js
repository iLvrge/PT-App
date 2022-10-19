import React, { useState, useCallback, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { Tab, Tabs, Paper, Grid, Badge, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { Fullscreen as FullscreenIcon } from '@mui/icons-material'
import FamilyContainer from '../FamilyContainer'
import LegalEventsContainer from '../LegalEventsContainer'
import ItemData from './ItemData'
import AbstractData from './AbstractData'
import ClaimData from './ClaimData'
import SpecificationData from './SpecificationData'
import FigureData from './FigureData'
import FullScreen from '../../FullScreen'
import { numberWithCommas, applicationFormat, capitalize } from "../../../../utils/numbers";

import useStyles from './styles'
import { setAssetsUSPTO } from '../../../../actions/patentTrackActions2'

const FamilyItemContainer = ({ item, onClose, analyticsBar, chartBar, illustrationBar, visualizerBarSize, type, standalone, activeTab }) => {

    const classes = useStyles()
    const [ fullScreen, setFullScreen ] = useState(false)
    const [ selectedTab, setSelectedTab ] = useState(typeof activeTab !== 'undefined' ? activeTab : 0)
    const [ uspto, setUSPTO ] = useState('')
    const [ familyItemData, setfamilyItemData ] = useState({})
    const [ abstractData, setAbsractData ] = useState('')
    const [ claimsData, setClaimsData ] = useState('')
    const [ figureData, setFigureData ] = useState([])
    const [ citationData, setCitationData ] = useState([])
    const [ specificationData, setSpecificationData ] = useState([])
    const [ ptabData, setPtabData ] = useState([])
    const [ assignmentsData, setAssignmentsData ] = useState([])
    const [selectedNumber, setSelectedNumber] = useState('')
    const handleChangeTab = (event, newTab) => setSelectedTab(previousTab => newTab != 5 ? newTab : previousTab)
    const selectedAssetsLegalEvents = useSelector(state => state.patenTrack.assetLegalEvents)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
    const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
    const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
    const familyDataRetrieved = useSelector( state => state.patenTrack.familyDataRetrieved  )
    const selectedAssetsFamily = useSelector(state => state.patenTrack.assetFamily)    
    const auth_token = useSelector(state => state.patenTrack2.auth_token)
    const asset_details = useSelector(state => state.patenTrack2.asset_details)
    const fullScreenItems = [
        {
          id: 1,
          label: '',
          component: FamilyItemContainer,
          item,
          onClose,
          analyticsBar,
          chartBar,
          illustrationBar, 
          visualizerBarSize, 
          type,
          standalone: true,
          activeTab: selectedTab
        }
    ]
    useEffect(() => {
        if( familyDataRetrieved === true ) {
            if(item == undefined || item == null || Object.keys(item).length === 0){
                setAbsractData('')
                setClaimsData('')
                setFigureData([])
                setAssignmentsData([])  
                setCitationData([])
                setSpecificationData([])
                setPtabData([])
                setSelectedNumber('')
                if(selectedAssetsPatents.length > 0) {
                    setSelectedNumber(selectedAssetsPatents[1] !== '' ? `US${numberWithCommas(selectedAssetsPatents[1])}` : `US${applicationFormat(selectedAssetsPatents[0])}`)
                }
                return setfamilyItemData({})
            }
            
            const getFamilyItemDataFunction = async () => {
                setfamilyItemData({
                    inventors: item.inventors,
                    applicants: item.applicants,
                    assignee: item.assignee,
                    priority_date: item.priority_date,
                    patent_number: item.patent_number,
                    application_date: item.application_date,
                    publication_date: item.publication_date,
                    application_number: item.application_number,                
                    publication_country: item.publication_country,
                    publication_kind: item.publication_kind
                })
                let number = item.publication_kind.toString().toLowerCase().indexOf('a') !== -1 
                            ? 
                                `${item.publication_country}${applicationFormat(item.application_number)}${item.publication_kind}` 
                            : 
                                item.publication_country.toLowerCase().indexOf('us') !== -1 && item.application_number !== '' 
                                ? 
                                    `${item.publication_country}${applicationFormat(item.application_number)}` 
                                :  
                                    `${item.publication_country}${numberWithCommas(item.patent_number)}${item.publication_kind}`
                
                setSelectedNumber(number)
                setAbsractData(item.abstracts)
                setClaimsData(item.claims)
                setClaimsData(item.specification)
                try{
                    setFigureData(JSON.parse(item.images))                
                    setAssignmentsData(JSON.parse(item.assigments))
                } catch( err) {
                    console.log(err)
                }
            }
            getFamilyItemDataFunction()     
        } else {
            if(selectedAssetsPatents.length > 0) {
                setSelectedNumber(selectedAssetsPatents[1] !== '' ? `US${numberWithCommas(selectedAssetsPatents[1])}` : `US${applicationFormat(selectedAssetsPatents[0])}`)
            }
        }
    }, [ item, familyDataRetrieved ])

    useEffect(() => {
        if(selectedTab === 4) {
            setSelectedTab(-1)
            setTimeout(() => {
                setSelectedTab(4)
            }, 1)
        }
    }, [analyticsBar, illustrationBar, visualizerBarSize])

    const onCloseFamilyMode = useCallback(() => {
        //dispatch(toggleFamilyMode());
      }, [/*dispatch*/]);

    const onHandleChange = (event) => {
        /* setUSPTO(event.target.value) */
        if(event.target.value != '') {
            console.log('selectedAssetsPatents', selectedAssetsPatents)
            let target = event.target.value != 'Application' ? event.target.value : ''
            let url = `https://patentcenter.uspto.gov/applications/${selectedAssetsPatents[1]}${target}`
            window.open(url);
            setTimeout(() => {
                document.activeElement.blur()
            }) 
        }
    }
    
    const ItemLabel = ({label}) =>  {
        return (
            label === 'Family'
            ?
                <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.family)} showZero={false}></Badge></span>
            :
                label === 'Claims'
                ?
                    <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.claims)} showZero={false}></Badge></span>
                :
                    label === 'Figures'
                    ?
                        <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.figures)} showZero={false}></Badge></span>
                    :
                    label ===  'USPTO'
                    ?
                        <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
                            <InputLabel id="uspto-extra-info-label">USPTO</InputLabel>
                            <Select
                                labelId="uspto-extra-info-label"
                                id="uspto-extra-info"
                                value={uspto}
                                label="USPTO"
                                onChange={onHandleChange}
                            >
                                <MenuItem value={'Application'}>Application Data</MenuItem>
                                <MenuItem value={'/ifw/docs'}>Document & Transactions</MenuItem>
                                <MenuItem value={'/continuity'}>Continuity</MenuItem>
                                <MenuItem value={'/patentTermAdjustment'}>Patent Term Adjustment</MenuItem>
                                <MenuItem value={'/foreignPriority'}>Foreign Priority</MenuItem>
                                <MenuItem value={'/feeHistory'}>Fees Payment History</MenuItem>
                                <MenuItem value={'/attorney'}>Address & Attorney/Agent Information</MenuItem>
                                <MenuItem value={'/supplementalContent/fileType'}>Supplemental Content</MenuItem>
                                <MenuItem value={'/assignments/abstract'}>Assignments</MenuItem>
                                <MenuItem value={'/displayReferences/usPatentDocs'}>Display References</MenuItem>
                            </Select>
                        </FormControl>
                    :
                    label
        )
    }

    
    return(
        <Paper className={classes.root} square>

            {
                selectedCompaniesAll === true || selectedCompanies.length > 0 || type === 9 || ( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)
                ?
                    <>
                        {
                            fullScreen === false && typeof standalone === 'undefined' && (
                                <IconButton size="small" className={classes.fullscreenBtn} onClick={() => setFullScreen(!fullScreen)}>
                                    <FullscreenIcon />
                                </IconButton>
                            )
                        }
                        <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
                            {
                                [`Family`, `Abstract`, `Specifications`, `Claims`, `Figures`, 'USPTO'].map( (item, index) => (
                                    <Tab
                                        key={index}
                                        className={classes.tab}
                                        label={<ItemLabel label={item}/>}
                                        disableFocusRipple={true}
                                        disableRipple={true}
                                    />
                                ))
                            }                            
                        </Tabs>
                        <div className={classes.graphContainer}>        
                        {/* <Typography variant='body2' className={classes.heading}>{selectedNumber}</Typography> */}
                        {selectedTab === 0 && <FamilyContainer
                                    family={selectedAssetsFamily}
                                    onClose={onCloseFamilyMode} />}
                        {
                            selectedTab > 0
                            ?
                            <Grid container className={classes.dashboard}>
                                <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className={classes.flexColumn}
                                >   
                                    {selectedTab === 1 && <AbstractData data={abstractData} number={selectedNumber} />}
                                    {selectedTab === 2 && <SpecificationData data={specificationData} number={selectedNumber} />}                                    
                                    {selectedTab === 3 && <ClaimData data={claimsData} number={selectedNumber} />}                                    
                                    {selectedTab === 4 && <FigureData data={figureData} number={selectedNumber} analyticsBar={analyticsBar} illustrationBar={illustrationBar} visualizerBarSize={visualizerBarSize} standalone={standalone}/>}
                                </Grid> 
                            </Grid>
                            :
                            '' 
                        }
                        </div>
                        {  
                            fullScreen === true && (
                                <FullScreen 
                                    componentItems={fullScreenItems} 
                                    showScreen={fullScreen} 
                                    setScreen={setFullScreen}                                    
                                />
                            )
                        }
                    </>
                :
                ''
            }            
        </Paper>
    )
}


export default FamilyItemContainer