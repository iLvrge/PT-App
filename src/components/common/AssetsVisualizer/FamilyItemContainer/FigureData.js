import React, {useEffect, useState} from 'react'
import Viewer from 'react-viewer';
import useStyles from './styles'
import Loader from "../../Loader"
import PatenTrackApi from '../../../../api/patenTrack2'


const FigureData = ( { analyticsBar, data, number } ) => {
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

    

    const containerRef = node => {
        if (node !== null) {
            const containerButtons = node.querySelector('.react-viewer-toolbar')
            console.log('containerButtons', containerButtons, node)
            if(containerButtons !== null) {                
                const resetButton = containerButtons.querySelector('.react-viewer-icon-reset')
                console.log('resetButton', resetButton)
                if( resetButton !== null ) {
                    console.log('resetButton.parentElement.style.display', resetButton.parentElement.style.display)
                    resetButton.parentElement.style.display = 'none'
                }
            } else {
                setTimeout(() => {
                    containerRef(node)
                }, 500)
            }
        }
    }

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
        <div ref={containerRef} className={classes.container}>    
            <div className={classes.inlineContainer} id='container'></div>
            {
                Array.isArray(figures) && figures.length > 0 && (
                    <Viewer
                        visible={visible}
                        container={document.getElementById("container")}
                        images={figures}
                        defaultScale={1}
                        minScale={1}
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