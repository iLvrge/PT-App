import React, { useCallback, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Grid, Paper, Typography, Link, List,
    ListItem,
    ListItemIcon,
    ListItemText,} from '@material-ui/core'
import { menuControlList } from '../../utils/controlList'
import { setControlModal } from '../../actions/uiActions'
import useStyles from './styles'
import clsx from 'clsx'

const MenuContainer = ({open}) => {
    const classes = useStyles()
    let history = useHistory()
    const dispatch = useDispatch()
    const controlModal = useSelector(state => (state.ui.controlModal))
    const gridWidthClassNumber = useSelector(state => state.patenTrack2.gridWidthClassNumber)
    const authenticated = useSelector(store => store.auth.authenticated)

    const [ active, setActive ] = useState('All')

    const onRedirect =  useCallback((e, path) => {
        //dispatch(setControlModal( !controlModal ))
        history.push(path)
      }, [ dispatch, history, controlModal ])


    const ShowLink = ({data, link}) =>{
        return (
            <>
                {
                    data.split('\n').map( (text, index) => (
                        <span key={index}>
                            {text}
                        </span> 
                    ))
                }
            </>
        ) 
    }  
    
    const Heading = ({ classes, data, variant, c, link }) => {
        return (
          <Typography variant={variant} className={c ? classes[c] : ''}>     
            {
                link 
                ? 
                <ShowLink data={data} link={link} />
                :
                data
            }
          </Typography>
        )
    }

    const onHandleMenu = (e) => {

    }

    const onHandleMenuOver = (e) => {
        console.log(e.target.innerText)
        setActive(e.target.innerText)
    }

    if (!authenticated) return <Redirect to={'/'} /> 
    return( 
        <>
        {
            open
            ?
            <Grid container className={classes.container} >
                <Grid 
                    item
                    lg={gridWidthClassNumber}
                    md={gridWidthClassNumber}
                    sm={gridWidthClassNumber}
                    xs={gridWidthClassNumber}
                    className={classes.flexColumn}
                    style={{ flexGrow: 1, height: '100%'}} 
                    >
                    <Paper className={classes.fullscreenCharts} square>
                        <Grid container className={classes.container2}>
                            <Grid item xs={2} className={classes.menuItems}>
                                <List dense={false}>
                                    <ListItem className={active === 'Maintenance' ?  classes.activeMenu : ''} onClick={onHandleMenu} onMouseOver={onHandleMenuOver} onMouseLeave={onHandleMenuOver} >
                                        <ListItemText primary={`Maintenance`} className={classes.maintain} />
                                    </ListItem>
                                    <ListItem className={active === 'Ownership' ?  classes.activeMenu : ''} onClick={onHandleMenu} onMouseOver={onHandleMenuOver} onMouseLeave={onHandleMenuOver}>
                                        <ListItemText primary={`Ownership`}   className={classes.acquisition}/>
                                    </ListItem>
                                    <ListItem className={active === 'Licensing' ?  classes.activeMenu : ''} onClick={onHandleMenu} onMouseOver={onHandleMenuOver} onMouseLeave={onHandleMenuOver} >
                                        <ListItemText primary={`Licensing`}  className={classes.maintain}/>
                                    </ListItem>
                                    <ListItem className={active === 'Financing' ?  classes.activeMenu : ''} onClick={onHandleMenu} onMouseOver={onHandleMenuOver} onMouseLeave={onHandleMenuOver}>
                                        <ListItemText primary={`Financing`}   className={classes.maintain}/>
                                    </ListItem>
                                    <ListItem  className={active === 'Due Diligence' ?  classes.activeMenu : ''} onClick={onHandleMenu} onMouseOver={onHandleMenuOver} onMouseLeave={onHandleMenuOver} >
                                        <ListItemText primary={`Due Diligence`}  className={classes.maintain}/>
                                    </ListItem>
                                    <ListItem  className={active === 'All' ?  classes.activeMenu : ''} onClick={onHandleMenu} onMouseOver={onHandleMenuOver} onMouseLeave={onHandleMenuOver} >
                                        <ListItemText primary={`All`} />
                                    </ListItem>
                                </List>
                            </Grid>
                            {
                                menuControlList.map( ( control, index ) => (
                                    <Grid container item xs={10} key={index} className={`${classes.container1} ${active == control.name || active == 'All' ? classes.enable : classes.disable}`} data-name={control.name}  spacing={2}>
                                        {
                                            control.children.length > 0 && control.children.map( ( child, idx ) => (
                                                
                                                <Grid item xs={2} key={idx}>
                                                    <Link href="#" onClick={(e) => onRedirect(e, child.redirect)}  className={clsx(classes.item, child.mainHeadingClass )}>
                                                        <Heading data={child.mainHeading} variant={`body1`} classes={classes} c={child.mainHeadingClass} link={child.redirect}/>
                                                        <Heading data={child.subHeading}  variant={`body2`} classes={classes}/>
                                                    </Link> 
                                                </Grid>
                                            ))
                                        }
                                    </Grid> 
                                ))
                            } 
                        </Grid>
                    </Paper>
                </Grid> 
            </Grid>
            :
            ''
        }
        </>
    )  
}

export default MenuContainer