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
    const [ visible, setVisible ] = useState(true);
    const [ mode, setMode ] = useState('inline')


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
                            <Typography color="inherit" variant='body2'>{ visible === 'inline'  ? `View images in panel` : `Close images panel`}</Typography>
                        } 
                        className={classes.tooltip}  
                        placement='right'
                        enterDelay={0}
                        TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }} 
                    >
                        <IconButton onClick={() => { setMode(mode === 'inline' ? 'modal' : 'inline'); } }>
                            { 
                                mode === 'inline' 
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
            <div className={classes.inlineContainer} id='container'></div>
            {
                Array.isArray(figures) && figures.length > 0 && mode === 'inline' && (
                    <Viewer
                        visible={visible}
                        container={document.getElementById("container")}
                        images={figures}
                        noClose={true}
                        noImgDetails={true}
                    />
                )
            }

            {
                Array.isArray(figures) && figures.length > 0 && mode === 'modal' && (
                    <Viewer
                        visible={visible}
                        images={figures}
                        noImgDetails={true}
                        onClose={() => {setMode(mode === 'inline' ? 'modal' : 'inline');}}
                    />
                )
            }
        </div>
    )
}  

export default FigureData