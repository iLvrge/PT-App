import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Tab, Tabs, Paper, Badge, IconButton } from '@mui/material'
import { Fullscreen as FullscreenIcon } from '@mui/icons-material'
import Fees from './Fees'
import Status from './Status'
import Litigation from './Litigation'
import Ptab from './Ptab'
import Citation from './Citation'
import useStyles from './styles'
import FullScreen from '../../FullScreen'
import { numberWithCommas, applicationFormat, capitalize } from "../../../../utils/numbers";
import clsx from 'clsx'

const LegalEventsContainer = ({ events, type, standalone, activeTab }) => {
  const classes = useStyles()
  const [ fullScreen, setFullScreen ] = useState(false)
  const [ selectedTab, setSelectedTab ] = useState(typeof activeTab !== 'undefined' ? activeTab : 0)
  const [ eventsData, setEventsData ] = useState([])
  const [ eventsStatusData, setEventsStatusData ] = useState([])
  const [ litigationData, setLitigationData ] = useState([])
  const [ ptabRawData, setPtabRawData ] = useState([])
  const [ citationData, setCitationData ] = useState([])
  const [selectedNumber, setSelectedNumber] = useState('')
  const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
  const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
  const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
  const auth_token = useSelector(state => state.patenTrack2.auth_token)
  const asset_details = useSelector(state => state.patenTrack2.asset_details)
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory)
  const fullScreenItems = [
    {
      id: 1,
      label: '',
      component: LegalEventsContainer,
      events,
      type,
      standalone: true,
      activeTab: selectedTab,
      rawData: ptabRawData,
      updateRawData: setPtabRawData,
      citationRawData: citationData, 
      updateCitationRawData: setCitationData
    }
  ]
  useEffect(() => {
    setSelectedNumber(selectedAssetsPatents[1] !== '' ? `US${numberWithCommas(selectedAssetsPatents[1])}` : `US${applicationFormat(selectedAssetsPatents[0])}`)
  }, [])

  const handleChangeTab = (event, newTab) => setSelectedTab(newTab)

  const ItemLabel = ({label}) =>  {
    return (
        label === 'M.Fees'
        ?
          <span className={clsx(classes.containerRelative, {[classes.redColor]: asset_details.fees > 20 ? true : false})}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.fees)} showZero={false}></Badge></span>
        :
            label === 'Cited by'
            ?
              <span className={clsx(classes.containerRelative, {[classes.redColor]: asset_details.citations > 20 ? true : false})}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.citations)} showZero={false}></Badge></span>
            :
                label === 'PTAB'
                ?
                  <span className={clsx(classes.containerRelative, {[classes.redColor]: asset_details.ptab > 20 ? true : false})}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.ptab)} showZero={false}></Badge></span>
                :
                  label == 'Litigation'
                  ?
                    <span className={clsx(classes.containerRelative, {[classes.redColor]: asset_details.litigation > 20 ? true : false})}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.litigation)} showZero={false}></Badge></span>
                  :
                  label == 'Status'
                  ?
                    <span className={clsx(classes.containerRelative, {[classes.redColor]: asset_details.status > 20 ? true : false})}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.status)} showZero={false}></Badge></span>
                  :
                  label
    )
}

  
  return (
    <Paper className={classes.root} square >
        {
          selectedCompaniesAll === true || selectedCompanies.length > 0 || type === 9 || ( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)
          ?
          <>
            {
              fullScreen === false && typeof standalone === 'undefined' && (
                  <IconButton size="small" className={clsx(classes.fullscreenBtn, 'full_screen_btn')} onClick={() => setFullScreen(!fullScreen)}>
                    <FullscreenIcon />
                  </IconButton>
              )
            }
            <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
              {
                [`M.Fees`, `Cited by`, `Status`, `PTAB`, `Litigation`].map( (item, index) => (
                  <Tab
                    key={index}
                    className={classes.tab} 
                    label={<ItemLabel label={item}/>}
                  /> 
                ))
              }                            
            </Tabs>
            <div className={classes.graphContainer}>  
              {selectedTab === 0 && <Fees events={events} number={selectedNumber} />}
              {selectedTab === 1 && <Citation updateCitationRawData={setCitationData} number={selectedNumber} />}   
              {selectedTab === 2 && <Status data={eventsData} number={selectedNumber} updateRawData={setEventsStatusData}/>}  
              {selectedTab === 3 && <Ptab number={selectedNumber} updateRawData={setPtabRawData}/>}   
              {selectedTab === 4 && <Litigation data={litigationData} number={selectedNumber} />}   
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

export default LegalEventsContainer