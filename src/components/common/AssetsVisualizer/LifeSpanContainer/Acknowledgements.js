import React, { useEffect, useState, useRef } from 'react'
import useStyles from './styles'


import FullScreen from '../../FullScreen'

const Acknowledgements = () => {
    const containerRef = useRef(null)
    const classes = useStyles() 
    const menuItems = [
        {
            id: 1,
            label: 'Acknowledgments',
            component: Acknowledgements,
            standalone: true,
        }
    ]
    

    return (
        <>
            {
                typeof standalone === 'undefined' && (
                    <div className={classes.fullScreenContainer}>
                        <FullScreen componentItems={menuItems}/>
                    </div>
                )
            } 
            <div className={classes.graphContainer} ref={containerRef}>  
                
            </div> 
        </>
    )
}

export default Acknowledgements