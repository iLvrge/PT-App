import React, {useEffect, useState} from 'react'
import Viewer from 'react-viewer';
import useStyles from './styles'
import Loader from "../../Loader"
import PatenTrackApi from '../../../../api/patenTrack2'


const FigureData = ( { analyticsBar, illustrationBar, visualizerBarSize, data, number, standalone } ) => {
    const classes = useStyles()
    const [ loading, setLoading ] = useState(false)
    const [ figures, setFigures ] = useState([])
    const [ visible, setVisible ] = useState(true) 

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
    console.log('standalone', standalone)
    return (
        <div className={classes.container}>    
            <div className={classes.inlineContainer} id={`container`}></div>
            {
                Array.isArray(figures) && figures.length > 0 && (
                    <Viewer
                        visible={visible}
                        container={typeof standalone !== 'undefined' && standalone === true ? document.querySelector('.fullscreenModal #container') : document.getElementById('container')}
                        images={figures}
                        defaultScale={1}
                        minScale={1}
                        drag={false}
                        disableKeyboardSupport={true}
                        noClose={true}
                        noImgDetails={true}
                        scalable={false}
                        noResetZoomAfterChange={true}
                        disableMouseZoom={true}
                    />
                )
            }
        </div> 
    )
}  

export default FigureData