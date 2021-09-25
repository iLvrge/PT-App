import React, {useEffect, useState} from 'react'
import { IconButton, Typography, Zoom, Tooltip  } from '@material-ui/core'
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum'
import CloseIcon from '@material-ui/icons/Close'
import Viewer from 'react-viewer';
import useStyles from './styles'
import Loader from "../../Loader"
import PatenTrackApi from '../../../../api/patenTrack2'


const FigureData = ( { data, number } ) => {

    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [ figures, setFigures ] = useState([])
    const [ visible, setVisible ] = useState(false);

    useEffect(() => {
        let parseData = data
        try{
            parseData =  JSON.parse(data)
        } catch(e) {
            parseData = data
        }
        if((Array.isArray(parseData) && parseData.length == 0) || parseData == '' || parseData == null) {            
            getFamilyData()
        } else {
            setFigures(parseData)
        }        
    }, [data])

    useEffect(() => {
        getFamilyData()
    }, [number])

    const getFamilyData = async () => {
        setLoading(true)
        PatenTrackApi.cancelFamilyData()
        const getData = await PatenTrackApi.getFamilyData(number.replace('/', '').replace(/[, ]+/g, ''))
        setLoading(false)
        if( getData.data != null && getData.data != '' ) {
            if(getData.data.length > 0) {
                const list = []
                getData.data.forEach( src => {
                    list.push({src})
                })
                setFigures(list)
            }
        } else {
            setFigures([])
        } 
    }

    if(loading) return <Loader/> 

    return (
        <div>
            <div className={classes.iconButton}>
            {
                Array.isArray(figures) && figures.length > 0 && (
                    <Tooltip 
                        title={
                            <Typography color="inherit" variant='body2'>{ visible === false  ? `View images in panel` : `Close images panel`}</Typography>
                        } 
                        className={classes.tooltip}  
                        placement='right'
                        enterDelay={0}
                        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                    >
                        <IconButton onClick={() => { setVisible(!visible); } }>
                            { 
                                visible === false 
                                ? 
                                    <PhotoAlbumIcon/>
                                :
                                    <CloseIcon/>
                            }   
                        </IconButton>
                    </Tooltip>                    
                )
            }
            </div>
            {                
                Array.isArray(figures) && figures.length > 0 && visible === false && figures.map( (figure, index) => (
                    <img key={index} src={figure.src} className={classes.figures}/>
                ))
            }
            {
                Array.isArray(figures) && figures.length > 0 && (
                    <Viewer
                        visible={visible}
                        onClose={() => { setVisible(false); } }
                        images={figures}
                    />
                )
            }
        </div>
    )
}

export default FigureData