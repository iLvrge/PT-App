import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
    Paper,
    Grid,
    Button 
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import PatenTrackApi from '../../../api/patenTrack2'   

import {downloadFile} from '../../../utils/html_encode_decode'

import AutoCompleteSearch from './AutoCompleteSearch'

import useStyles from './styles'

/***
 * User input form for selecting Assignee, Assignor, and Correspondance
 * Create XML 
 * Upload to uspto 
 */

const UserInputForm = React.forwardRef((props, ref) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const [ openAssignee, setOpenAssignee ] = useState(false)
    const [ openAssignor, setOpenAssignor ] = useState(false)
    const [ openCorrespondence, setOpenCorrespondence ] = useState(false)
    const [ optionsAssignee, setOptionsAssignee ] = useState([])
    const [ optionsAssignor, setOptionsAssignor ] = useState([])
    const [ optionsCorrespondence, setOptionsCorrespondence ] = useState([])

    const [ loadingAssignee, setLoadingAssignee ] = useState(false)
    const [ loadingAssignor, setLoadingAssignor ] = useState(false)
    const [ loadingCorrespondence, setLoadingCorrespondence ] = useState(false)

    const [ selectedAssignee, setSelectedAssignee ] = useState([])
    const [ selectedAssignor, setSelectedAssignor ] = useState([])
    const [ selectedCorrespondence, setSelectedCorrespondence ] = useState(null)

    const selectedAssetsPatents = useSelector(state => state.patenTrack2.selectedAssetsPatents)
    const selectedAssetsTransactions = useSelector(state => state.patenTrack2.assetTypeAssignments.selected)
    const selectedCompanies = useSelector( state => state.patenTrack2.mainCompaniesList.selected )

    const [ transactionPatents, setTransactionPatents ] = useState([])

    useEffect(() =>{
        if( selectedAssetsTransactions.length > 0 ) {
            (async() => {
                const {data} = await PatenTrackApi.getAssignorAssigneeByTransaction( selectedAssetsTransactions[0], selectedCompanies )
                if(data != null) {
                    const {assignees, assignors, assignments, patent} = data

                    if( ( assignees != undefined || assignees != null ) && assignees.length > 0 ) {
                        const findAllAssignee = []
                        const promiseAssignee = assignees.map( assignee => {
                            let name = assignee.name

                            if( assignee.assignor_and_assignee != null && assignee.assignor_and_assignee.representative != null ) {
                                name = assignee.assignor_and_assignee.representative.name
                            } else {
                                name = assignee.assignor_and_assignee.name
                            }
                            findAllAssignee.push({id: assignee.assignor_and_assignee_id, name})
                        })
                        await Promise.all(promiseAssignee)
                        setSelectedAssignee(findAllAssignee)
                    }

                    if( ( assignors != undefined || assignors != null ) && assignors.length > 0 ) {
                        const findAllAssignor = []
                        const promiseAssignor = assignors.map( assignor => {
                            let name = assignor.name

                            if( assignor.assignor_and_assignee != null && assignor.assignor_and_assignee.representative != null ) {
                                name = assignor.assignor_and_assignee.representative.name
                            } else {
                                name = assignor.assignor_and_assignee.name
                            }
                            findAllAssignor.push({id: assignor.assignor_and_assignee_id, name})
                        })
                        await Promise.all(promiseAssignor)
                        setSelectedAssignor(findAllAssignor)
                    }

                    if( ( assignments != undefined || assignments != null ) && Object.keys(assignments).length > 0 ) {
                        setSelectedCorrespondence({id: assignments.id,  name:  assignments.name != '' ? assignments.name : assignments.caddress_1 })
                    }

                    if( ( patent != undefined || patent != null ) && patent.length > 0 ) {
                        setTransactionPatents(patent)
                    }
                }
            })()            
        }
    }, [ selectedAssetsTransactions, selectedCompanies ])

    /**
     * 
     * @param {event} event
     * Send request to server for downloading XML 
     */
    const downloadXML = useCallback(async (event) => {
        event.preventDefault()
        console.log('downloadXML', selectedAssignee, selectedAssignor, selectedCorrespondence, selectedAssetsPatents, selectedAssetsTransactions)
        if( selectedAssignee.length > 0 && selectedAssignor.length > 0 && selectedCorrespondence != null && Object.keys(selectedCorrespondence).length > 0 ) {
            
            const formData = new FormData()
            formData.append('asset', JSON.stringify(selectedAssetsPatents))    
            formData.append('transactions', JSON.stringify(selectedAssetsTransactions))    
            formData.append('assignee',  JSON.stringify(selectedAssignee))
            formData.append('assignor',  JSON.stringify(selectedAssignor))
            formData.append('correspondance',  JSON.stringify(selectedCorrespondence))
            formData.append('transaction_patent', JSON.stringify(transactionPatents))

            const response = await PatenTrackApi.downloadXMLFromServer(formData)
            if(response) {
                const { data } = response
                downloadFile(data)                
            }
        } else {
            /** */
            if(selectedAssignee.length == 0) {
                alert("Please add assignee.")
            }

            if(selectedAssignor.length == 0) {
                alert("Please add assignor.")
            }

            if( selectedCorrespondence == null && Object.keys(selectedCorrespondence).length == 0 ) {
                alert("Please add correspondance.")
            }
        }
    }, [ dispatch, selectedAssignee, selectedAssignor, selectedCorrespondence, selectedAssetsPatents, selectedAssetsTransactions ])

    /**
     * 
     * @param {event} event 
     * Open USPTO site in TV or in new TAB
     */
    const openUSPTO = (event) => {
        window.open('https://epas.uspto.gov/epas/guidelines.jsp', '_BLANK')
    }

    /**
     * when correspondence input change send request to server to search for Correspondence
     * @param {event} event 
     * @param {inputValue} value 
     */

    const onChangeCorrespondence = useCallback(async (event, value) => {
        if( event != null ) {
            event.preventDefault()
            try {            
                if (value.length > 2) {
                    PatenTrackApi.cancelRequest()
                    setOptionsCorrespondence([])
                    setLoadingCorrespondence(true)
                    const response = await PatenTrackApi.searchEntity(value, 2)
                    setLoadingCorrespondence(false)
                    if(response) {
                        setOptionsCorrespondence(response.data != null ? response.data : [])
                    }               
                }
            } catch (e){
                console.log(e)
            } 
        }               
    }, [])

    /**
     * when assignor input change send request to server to search for Assignor
     * @param {event} event 
     * @param {inputValue} value 
     */

    const onChangeAssignor = useCallback(async (event, value) => {
        event.preventDefault()
        try {            
            if (value.length > 2) {                
                PatenTrackApi.cancelRequest()
                setOptionsAssignor([])
                setLoadingAssignor(true)
                const response = await PatenTrackApi.searchEntity(value, 1)
                setLoadingAssignor(false)
                if(response) {
                    setOptionsAssignor(response.data != null ? response.data : [])
                }               
            }
        } catch (e){
            console.log(e)
        }        
    }, [])

    /**
     * when assigne input change send request to server to search for Assignee
     * @param {event} event 
     * @param {inputValue} value 
     */

    const onChangeAssignee = useCallback(async (event, value) => {
        event.preventDefault()
        try {            
            if (value.length > 2) {
                PatenTrackApi.cancelRequest()
                setOptionsAssignee([])
                setLoadingAssignee(true)
                const response = await PatenTrackApi.searchEntity(value, 1)
                setLoadingAssignee(false)
                if(response) {
                    setOptionsAssignee(response.data != null ? response.data : [])
                }               
            }
        } catch (e){
            console.log(e)
        }        
    }, [])

    /**
     * When autocomplete assignee change
     */

    const onHandleChangeAssignee = useCallback((option, value, reason) => {
        if(reason === 'remove-option' || reason === 'select-option') {
            setSelectedAssignee(value)
        }
    }, [])

    /**
     * When autocomplete assignor change
     */

    const onHandleChangeAssignor = useCallback((option, value, reason) => {
        if(reason === 'remove-option' || reason === 'select-option') {
            setSelectedAssignor(value)
        }
    }, []) 

    /**
     * When autocomplete correspondence change
     */

    const onHandleChangeCorrespondence = useCallback((option, value, reason) => {
        if(reason === 'remove-option' || reason === 'select-option') {
            setSelectedCorrespondence(value)
        }
    }, [])

    return (
        <Paper className={classes.formContainer} square ref={ref}>
            <Grid container className={classes.formWrapper}>
                <Grid container className={classes.form} spacing={3}>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={4}
                        xs={4}
                        className={classes.flexColumn} 
                    >
                        <AutoCompleteSearch
                            value={selectedAssignee}
                            open={openAssignee}
                            setOpen={setOpenAssignee}
                            setOptions={setOptionsAssignee}
                            onHandleChange={onHandleChangeAssignee}
                            options={optionsAssignee}
                            loading={loadingAssignee}
                            onInputChange={onChangeAssignee}
                            id={'assignee-select'}
                            noOptionsText={'No Assignee found'}
                            label={'Assignee'}
                            multiple={true}
                        />
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={4}
                        xs={4}
                        className={classes.flexColumn}
                    >
                        <AutoCompleteSearch
                            value={selectedAssignor}
                            open={openAssignor}
                            setOpen={setOpenAssignor}
                            setOptions={setOptionsAssignor}
                            onHandleChange={onHandleChangeAssignor}
                            options={optionsAssignor}
                            loading={loadingAssignor}
                            onInputChange={onChangeAssignor}
                            id={'assignor-select'}
                            noOptionsText={'No Assignor found'}
                            label={'Assignor'}
                            multiple={true}
                        />                        
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={4}
                        xs={4}
                        className={classes.flexColumn}
                    >
                        <AutoCompleteSearch
                            value={selectedCorrespondence}
                            open={openCorrespondence}
                            setOpen={setOpenCorrespondence}
                            setOptions={setOptionsCorrespondence}
                            onHandleChange={onHandleChangeCorrespondence}
                            options={optionsCorrespondence}
                            loading={loadingCorrespondence}
                            onInputChange={onChangeCorrespondence}
                            id={'correspondence-select'}
                            noOptionsText={'No Correspondence found'}
                            label={'Correspondence'}
                            multiple={false}
                        /> 
                    </Grid> 
                    <div className={classes.btnContainer}>
                        <Button variant="contained" className={classes.btn} onClick={(event) => {downloadXML(event)}}>Save to hardrive</Button>
                        <Button variant="contained" className={classes.btn} onClick={(event) => {openUSPTO(event)}}>Upload to USPTO</Button>
                    </div>                    
                </Grid>
            </Grid>
        </Paper>
    )
})




export default UserInputForm