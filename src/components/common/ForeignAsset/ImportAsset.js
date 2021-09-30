import React, {useRef, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Grid, Typography, TextField, Button, CircularProgress  } from  '@material-ui/core'

import PatenTrackApi from '../../../api/patenTrack2'

import { getTokenStorage } from '../../../utils/tokenStorage'
import useStyles from "./styles"

const ImportAsset = ({closeModal, callback}) => {
    const classes = useStyles()
    const [ isLoading, setIsLoading ] = useState(false)
    const textAreaRef  = useRef(null)
    const textFiledRef = useRef(null)
    const [assetsValue, setAssetsValue] = useState('')
    const [sheetName, setSheetName] = useState('')
    const [invalidAssets, setInvalidAssets] = useState([])

    const google_profile = useSelector(state => state.patenTrack2.google_profile)

    let rawData = ''

    const onHandlePaste = (e) => {
        e.preventDefault()
        const clipboardData = e.clipboardData || e.originalEvent.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('text');
        if(pastedData!=""){
            rawData = pastedData;
            /*Pre Format Data*/
            formatRawData();
            const items = rawData.split('\n');
            if(items.length > 0) {
                const exp = /^(?!\s*$).+/, finalItems = []
                items.forEach((value, index) => {
                    let columns = value.replace('\r','');                    
                    if(exp.test(columns)){
                        finalItems.push(columns);
                    }
                })
                if(finalItems.length > 0) {
                    setAssetsValue(finalItems.join('\n'))   
                    validateRawItems(finalItems);
                } else {
                    alert("Data is not in proper format");
                }               
            } else {
                alert("Data is not in proper format");
            }
        }  else {
            alert("Cannot pass empty string.");
        }
    }

    useEffect(() => {
        if(textAreaRef.current !== null ){
            const textarea = textAreaRef.current.querySelector('textarea');
            if(textarea !== null) {
                textarea.addEventListener("paste", onHandlePaste, false);             
                return () => {
                    textarea.removeEventListener("paste", null);
                }
            }
        }
    }, [textAreaRef])

    /**
     * Format raw pasted data
     */

    const formatRawData = () => {
        let _tabFind = rawData.match(/(?:"[^"]*"|^[^"]*$)/);
        if(typeof _tabFind[0]!="undefined"){
            let _stringFind = _tabFind[0];
            if(_stringFind == _tabFind.input){
                return false;
            } else {
                let _stringIndex = _tabFind.index;
                let _firstString = rawData.substring(0,_stringIndex);
                let _remainString = rawData.substr(_stringIndex);
                let _secondString = _remainString.substr(_stringFind.length);
                _stringFind = _stringFind.replace(/\n/g, ' ');
                _stringFind = _stringFind.replace(/"/g, '');
                rawData = _firstString+_stringFind+_secondString;
                formatRawData();
            }
        } else {
            return false;
        }
    }

    /**
     * 
     */

    const validateRawItems = async(items) => {
        console.log('Validate Raw items with database', items);
        setInvalidAssets([])
        const form = new FormData()
        form.append('foreign_assets', JSON.stringify(items))
        const { data } = await PatenTrackApi.validateForeignAssets(form)

        if( data !== null && data.length > 0) {
            console.log('invalidate assets', data)
            setInvalidAssets(data)
        }
    }

    const handleImport = async() => {        
        if(invalidAssets.length === 0) {
            setIsLoading(true)           
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            const token = JSON.parse(googleToken)  
            const { access_token } = token  
            const form = new FormData()
            form.append('sheet_name', sheetName)
            form.append('foreign_assets', JSON.stringify(assetsValue.split('\n')))
            form.append('user_account', google_profile.email)
            form.append('access_token', access_token)
            const { data } = await PatenTrackApi.saveForeignAssets(form)
            if(data !== null ) {
                setIsLoading(false)         
                if( data.error == '') {
                    setIsLoading(false)
                    closeModal(false)
                    callback()                    
                    alert(data.message)
                } else if(data.error !== ''){
                    alert(data.error)
                } else {
                    alert('Error while saving foreign assets')
                }
            } else{      
                setIsLoading(false)      
                alert('Error while saving foreign assets')
            } 
        } else {
            alert(`Some of the assets are invalid\n\n ${JSON.stringify(invalidAssets)}`)
        }
    }

    const handleChange = (event) => {
        setAssetsValue(event.target.value);
    }

    const handleTextChange = (event) => {
        setSheetName(event.target.value);
    }

    const LoadingImportButton = () => {


        return(
            <Button 
                className={classes.button}
                onClick={handleImport}
                disabled={isLoading}
            >
                {
                    isLoading ? <CircularProgress size={14} /> : 'Import'
                }
            </Button>
        )
    }

    return (
        <Paper className={classes.importContainer} square id={`import_container`}>
            <Grid container className={classes.dashboard}>
                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.flexColumn}>
                    <Typography color="inherit" variant='body2'>Paste here the list of foreign assets:</Typography>
                    <div className={classes.rows}>                        
                        <TextField
                            multiline
                            rows={20}
                            variant="outlined" 
                            value={assetsValue}
                            onChange={handleChange}
                            ref={textAreaRef}                       
                        /> 
                    </div>
                    <div className={classes.rows}>
                        <Typography color="inherit" variant='body2'>
                            Save the list under the name: 
                            <TextField  
                                variant="standard" 
                                value={sheetName}
                                className={classes.txtField}
                                onChange={handleTextChange}
                                ref={textFiledRef}
                            /> 
                            <LoadingImportButton />
                        </Typography>     
                    </div>
                </Grid>
            </Grid>
        </Paper>
    )
}


export default ImportAsset;