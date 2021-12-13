import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Tab, Tabs, Paper } from '@material-ui/core'
import Fees from './Fees'
import Events from './Events'
import Litigation from './Litigation'
import Ptab from './Ptab'
import Citation from './Citation'
import useStyles from './styles'
import { numberWithCommas, applicationFormat, capitalize } from "../../../../utils/numbers";

const LegalEventsContainer = ({ events, type }) => {
  const classes = useStyles()
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

  useEffect(() => {
    setSelectedNumber(selectedAssetsPatents[1] !== '' ? `US${numberWithCommas(selectedAssetsPatents[1])}` : `US${applicationFormat(selectedAssetsPatents[0])}`)
  }, [])

  const handleChangeTab = (event, newTab) => setSelectedTab(newTab)
  
  return (
    <Paper className={classes.root} square >
        {
          selectedCompaniesAll === true || selectedCompanies.length > 0 || type === 9 || ( process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' && auth_token !== null)
          ?
          <>
            <Tabs className={classes.tabs} variant={'scrollable'} value={selectedTab} onChange={handleChangeTab}>
              {
                [`M.Fees(${asset_details.fees})`, `F.Citations(${asset_details.citations})`, /* 'Events',  */`PTAB(${asset_details.ptab})`, `Litigation(${asset_details.litigation})`].map( (item, index) => (
                  <Tab
                    key={index}
                    className={classes.tab} 
                    label={item}
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
          </>
          :
          ''
        }     
    </Paper>
  )
} 

export default LegalEventsContainer