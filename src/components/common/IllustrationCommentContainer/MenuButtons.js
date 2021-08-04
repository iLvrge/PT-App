import React, { useState, useCallback, useRef, useEffect } from 'react'

import { IconButton, Typography } from "@material-ui/core";

import useStyles from "./styles";


const MenuButtons = ({onClick, type}) => {

    const classes = useStyles()
    
    return ( 
        <div className={classes.headerContainer}>
            <IconButton onClick={(event) => onClick(event, 2)} className={`${classes.buttonMenu} ${type == 'technology' ? classes.active : ''}`}>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-network" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-chart-network fa-w-14 "><path fill="currentColor" d="M576 192c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zM64 240c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm449.6-37.2l-19.2-25.6-48 36 19.2 25.6 48-36zM576 384c-14.4 0-27.6 5-38.3 13l-96-57.6c3.8-11.2 6.3-23 6.3-35.5 0-61.9-50.1-112-112-112-8.4 0-16.6 1.1-24.4 2.9l-40.8-87.4C281.4 96 288 80.8 288 64c0-35.3-28.7-64-64-64s-64 28.7-64 64 28.7 64 64 64c1.1 0 2.1-.3 3.2-.3l41 87.8C241.5 235.9 224 267.8 224 304c0 61.9 50.1 112 112 112 32.1 0 60.8-13.7 81.2-35.3l95.8 57.5c-.5 3.2-1 6.5-1 9.8 0 35.3 28.7 64 64 64s64-28.7 64-64-28.7-64-64-64zm-240-32c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm-184-32h48v-32h-48v32z" class=""></path></svg>
                <Typography variant='body2'>Technologies</Typography>
            </IconButton>
            <IconButton onClick={(event) => onClick(event, 1)} className={`${classes.buttonMenu} ${type == 'products' ? classes.active : ''}`}>
                <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="microscope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-microscope fa-w-14 "><g class="fa-group"><path fill="currentColor" d="M104 384h208a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H104a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8z" class="fa-secondary"></path><path fill="currentColor" d="M464 448h-1.29A191 191 0 0 0 512 320c0-105.88-86.12-192-192-192v64a128 128 0 0 1 0 256H48a48 48 0 0 0-48 48 16 16 0 0 0 16 16h480a16 16 0 0 0 16-16 48 48 0 0 0-48-48zM160 320h12v16a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16v-16h12a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32V16a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v16a32 32 0 0 0-32 32v224a32 32 0 0 0 32 32z" class="fa-primary"></path></g></svg>
                <Typography variant='body2'>Our Products</Typography>
            </IconButton>
            <IconButton onClick={(event) => onClick(event, 3)} className={`${classes.buttonMenu} ${type == 'competitors' ? classes.active : ''}`}>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="telescope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-telescope fa-w-14 "><path fill="currentColor" d="M380.41991,92.1336,74.29894,241.7427c-8.31835,4.06444-12.27733,13.25583-9.05663,21.02925l8.74413,21.10934L9.881,310.43593a16.00146,16.00146,0,0,0-8.66015,20.90425L21.27748,379.762a16.00055,16.00055,0,0,0,20.90429,8.66014l64.10544-26.55464,8.74219,21.10738c3.21874,7.77343,12.51757,11.47459,21.27147,8.46678l127.0019-43.623c.1875.24219.39258.46875.584.709L216.42,490.93949A16.00034,16.00034,0,0,0,231.5977,512H248.459a15.99985,15.99985,0,0,0,15.17772-10.94139l42.16209-126.49585a71.088,71.088,0,0,0,28.44726,0l42.164,126.49585A15.99986,15.99986,0,0,0,391.58787,512h16.85937a16.00062,16.00062,0,0,0,15.17968-21.06051L376.16014,348.52765a71.2877,71.2877,0,0,0,15.85742-44.52726c0-.13086-.03906-.25-.03906-.38086l66.56637-22.86519ZM320,328.00035a24,24,0,1,1,24-24A24.02622,24.02622,0,0,1,320,328.00035ZM638.77722,216.83064,553.06241,9.88181a15.99768,15.99768,0,0,0-20.90233-8.66014L414.84372,49.81923a15.99966,15.99966,0,0,0-8.65625,20.90426l85.71286,206.94883a16.00055,16.00055,0,0,0,20.90429,8.66014L630.119,237.73489A15.99729,15.99729,0,0,0,638.77722,216.83064Z" class=""></path></svg>
                <Typography variant='body2'>Competition</Typography>
            </IconButton>
            <IconButton onClick={(event) => onClick(event, 4)} className={classes.buttonMenu}>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-edit fa-w-14 "><path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" class=""></path></svg>
            </IconButton>
        </div>
    ) 
}


export default MenuButtons;