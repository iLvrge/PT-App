import React, {useRef, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paper, Grid, Typography, TextField } from  '@mui/material'
import DisplayItems from './DisplayItems'
import PatenTrackApi from '../../../api/patenTrack2'

import { getTokenStorage } from '../../../utils/tokenStorage'
import useStyles from "./styles"

const ImportAsset = ({items, invalidItems, updateItems, updateInvalidItems, deleteItem, handlePatchItem}) => {
    const classes = useStyles()
    
    const textAreaRef  = useRef(null)
    const textFiledRef = useRef(null)
    const [assetsValue, setAssetsValue] = useState(items)    
    const [invalidAssets, setInvalidAssets] = useState(invalidItems)
    const [currentItem, setCurrentItem] = useState('')

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
                    const newItems = [...new Set(oldItems)]
                    setAssetsValue(newItems)   
                    updateItems(newItems)
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

    

    const onHandleChangeItem = (items) => {
        setAssetsValue(items)
        updateItems(items)
    }

    

    return (
        <Paper className={classes.importContainer} square id={`import_container`}>
            <Grid container className={classes.dashboard}>
                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.flexColumn} p={2}>
                    <Typography color="inherit" variant='body2' component="div" className={classes.typography}>
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
                        <Grid item lg={12} md={12} sm={12} xs={9} className={classes.flexColumn}>
                            <DisplayItems items={assetsValue} invalidItems={invalidAssets} updateItems={onHandleChangeItem} callbackDeleteItem={deleteItem} handlePatchItem={handlePatchItem}/>
                        </Grid>
                    </div>                    
                </Grid>
            </Grid>
        </Paper>
    )
}


export default ImportAsset;