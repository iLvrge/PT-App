import React,{ 
            useCallback, 
        } from 'react'
import  { useDispatch, 
          useSelector 
        } from 'react-redux'
import  { 
          useHistory
        } from 'react-router-dom'
import { Box } from '@material-ui/core';

import { 
    InputBase, 
} from '@material-ui/core'

import {
    Search as SearchIcon
} from '@material-ui/icons'

import useStyles from './styles'

import { 
    setSelectedAssetsTransactions, 
    setSelectedAssetsPatents, 
    setAssetsIllustration, 
    setSearchString, 
    setResetAll,
} from '../../actions/patentTrackActions2'

const SearchBar = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const search_string = useSelector(state => state.patenTrack2.search_string)

    /**
    * Call the function for search by pressing enter key
    */
    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            dispatch(setResetAll())
            dispatch(setAssetsIllustration(null))
            dispatch(setSelectedAssetsTransactions([]))
            dispatch(setSelectedAssetsPatents([]))      
            dispatch(setSearchString(event.target.value))
            history.push("/search")
        }
    }, [ dispatch, history ])

    return(
        <Box 
            display='flex'
            className={classes.search}
        >
            <div className={classes.searchIcon}> 
                <SearchIcon />
            </div>
            <InputBase
                placeholder='Search…'
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                defaultValue={ search_string != null ? search_string : ''}
                inputProps={{ 'aria-label': 'search' }}
                onKeyDown={handleKeyDown}
            />
        </Box>
    )

}


export default SearchBar;