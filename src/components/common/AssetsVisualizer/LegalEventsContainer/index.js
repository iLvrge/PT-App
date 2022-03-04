import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Tab, Tabs, Paper, Badge, IconButton } from '@mui/material'
import { Fullscreen as FullscreenIcon } from '@mui/icons-material'
import Fees from './Fees'
import Events from './Events'
import Litigation from './Litigation'
import Ptab from './Ptab'
import Citation from './Citation'
import useStyles from './styles'
import FullScreen from '../../FullScreen'
import { numberWithCommas, applicationFormat, capitalize } from "../../../../utils/numbers";

const LegalEventsContainer = ({ events, type, standalone }) => {
  const classes = useStyles()
  const [ fullScreen, setFullScreen ] = useState(false)
  const [ selectedTab, setSelectedTab ] = useState(0)
  const [ eventsData, setEventsData ] = useState([])
  const [ litigationData, setLitigationData ] = useState([])
  const [ ptabData, setPtabData ] = useState([])
  const [ citationData, setCitationData ] = useState([])
  const [selectedNumber, setSelectedNumber] = useState('')
  const selectedAssetsPatents = useSelector( state => state.patenTrack2.selectedAssetsPatents  )
  const selectedCompaniesAll = useSelector( state => state.patenTrack2.mainCompaniesList.selectAll)
  const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )
  const auth_token = useSelector(state => state.patenTrack2.auth_token)
  const asset_details = useSelector(state => state.patenTrack2.asset_details)
  const fullScreenItems = [
    {
      id: 1,
      label: '',
      component: LegalEventsContainer,
      events,
      type,
      standalone: true,
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
          <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.fees)} showZero={false}></Badge></span>
        :
            label === 'Cited by'
            ?
              <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.citations)} showZero={false}></Badge></span>
            :
                label === 'PTAB'
                ?
                  <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.ptab)} showZero={false}></Badge></span>
                :
                  label == 'Litigation'
                  ?
                    <span className={classes.containerRelative}>{label}<Badge color='primary' max={99999} className={classes.badge} badgeContent={numberWithCommas(asset_details.litigation)} showZero={false}></Badge></span>
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
                  <IconButton size="small" className={classes.fullscreenBtn} onClick={() => setFullScreen(!fullScreen)}>
                    <FullscreenIcon />
                  </IconButton>
              )
            }
            <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
              {
                [`M.Fees`, `Cited by`, /* 'Events',  */`PTAB`, `Litigation`].map( (item, index) => (
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
              {selectedTab === 1 && <Citation data={citationData} number={selectedNumber} />}   
              {selectedTab === 2 && <Ptab data={ptabData} number={selectedNumber}/>}   
              {selectedTab === 3 && <Litigation data={litigationData} number={selectedNumber} />}   
              {selectedTab === 4 && <Events data={eventsData} number={selectedNumber} />}  
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