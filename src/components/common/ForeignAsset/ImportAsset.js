import React, {useRef, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Grid, Typography, TextField, Button, CircularProgress  } from  '@material-ui/core'
import DisplayItems from './DisplayItems'
import PatenTrackApi from '../../../api/patenTrack2'

import { getTokenStorage } from '../../../utils/tokenStorage'
import useStyles from "./styles"

const ImportAsset = ({items, invalidItems, closeModal, callback, updateItems, updateInvalidItems}) => {
    const classes = useStyles()
    const [ isLoading, setIsLoading ] = useState(false)
    const textAreaRef  = useRef(null)
    const textFiledRef = useRef(null)
    const [assetsValue, setAssetsValue] = useState([])
    const [sheetName, setSheetName] = useState('')
    const [invalidAssets, setInvalidAssets] = useState(invalidItems)
    const [currentItem, setCurrentItem] = useState('')


    useEffect(() => {
        if(assetsValue.length === 0) {
            setAssetsValue(items)
        }
    }, [items])


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
                    /* setAssetsValue(finalItems.join('\n'))    */
                    const oldItems = [...assetsValue, ...finalItems]
                    setAssetsValue([...new Set(oldItems)])   
                    updateItems([...new Set(oldItems)])
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
     * Validate Items
     */

    const validateRawItems = async(items) => {
        console.log('Validate Raw items with database', items);
        setInvalidAssets([])
        updateInvalidItems([])
        const form = new FormData()
        form.append('foreign_assets', JSON.stringify(items))
        const { data } = await PatenTrackApi.validateForeignAssets(form)

        if( data !== null && data.length > 0) {
            console.log('invalidate assets', data)
            setInvalidAssets(data)
            updateInvalidItems(data)
        }
    }

    const handleImport = async() => {  
        const form = new FormData()
        form.append('foreign_assets', JSON.stringify(assetsValue))
        const { data } = await PatenTrackApi.validateForeignAssets(form)
        if(data.length === 0) {
            setIsLoading(true)           
            const googleToken = getTokenStorage( 'google_auth_token_info' )
            const token = JSON.parse(googleToken)  
            const { access_token } = token  
            const form = new FormData()
            form.append('sheet_name', sheetName)
            form.append('foreign_assets', JSON.stringify(assetsValue))
            form.append('user_account', google_profile.email)
            form.append('access_token', access_token)
            const { data } = await PatenTrackApi.saveForeignAssets(form)
            if(data !== null ) {
                setIsLoading(false)         
                if( data.error == '') {
                    setAssetsValue([])
                    setInvalidAssets([])
                    setIsLoading(false)
                    closeModal(false)
                    updateItems([])
                    updateInvalidItems([])
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
            setInvalidAssets(data)
            updateInvalidItems(data)
            alert(`The following items were not found in the USPTO database and should be removed from the list: \n ${data.join(", ")}`)
        }
    }

    const onAddNewItemKeyPress = (event) => {
        if (event.key === 'Enter') {
            const items = [...assetsValue]
            items.push(event.target.value)
            setAssetsValue(items)
            updateItems(items)
            setCurrentItem('')
        }
    }

    
    const handleChange = (event) => {
        setCurrentItem(event.target.value);
    }

    const handleTextChange = (event) => {
        setSheetName(event.target.value);
    }

    const onHandleChangeItem = (items) => {
        setAssetsValue(items)
        updateItems(items)
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
                    <Typography color="inherit" variant='body2' component="div">
                        Paste here the list of external assets: 
                        <TextField 
                            variant="standard" 
                            multiline
                            rows={1}
                            value={currentItem}
                            className={classes.txtField}
                            onChange={handleChange}
                            onKeyPress={onAddNewItemKeyPress}
                            ref={textAreaRef}                       
                        />
                    </Typography>
                    <div className={classes.rows}>
                        <Typography color="inherit" variant='body2' component="div">
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
                    <div className={classes.rows}>    
                        <Grid item lg={12} md={12} sm={12} xs={9} className={classes.flexColumn}>
                            <DisplayItems items={assetsValue} invalidItems={invalidAssets} updateItems={onHandleChangeItem}/>
                        </Grid>
                    </div>                    
                </Grid>
            </Grid>
        </Paper>
    )
}


export default ImportAsset;