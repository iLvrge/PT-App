import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
// import NotificationsIcon from "@material-ui/icons/NotificationsNone";
import SettingsIcon from '@material-ui/icons/Settings'
import DashboardIcon from '@material-ui/icons/Dashboard'

import useStyles from './styles'

import { signOut } from '../../actions/authActions'

import { getProfile, setCurrentWidget, setSettingText } from '../../actions/patenTrackActions'

import Select from 'react-select'
import { setSelectedPortfolio } from '../../actions/settingsActions'
import Grid from '@material-ui/core/Grid';

const Header = (callback, deps) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const selectedPortfolio = useSelector(store => (store.settings.selectedPortfolio))
  const profile = useSelector(store => (store.patenTrack.profile))
  const user = useSelector(store => (store.patenTrack.profile ? store.patenTrack.profile.user : {}))
  const siteLogo = useSelector(state => (state.patenTrack.siteLogo.site_logo ? state.patenTrack.siteLogo.site_logo.logo_big : '/assets/images/logos/patentrack_logo.png'))
  const settingText = useSelector(state => (state.patenTrack.settingText ? state.patenTrack.settingText : 'Settings'))

  const isDashboardView = window.location.pathname.includes('dashboard')

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile(true))
    }
  }, [ dispatch, profile ])

  const handleChangeCollection = useCallback((e) => {
    dispatch(setSelectedPortfolio(e.value))
  }, [ dispatch ])

  const selectPortfoliosStyles = useMemo(() => ({
    menu: (provided, state) => ({
      ...provided,
      background: '#222222',
    }),
    container: (provided) => ({
      ...provided,
      width: 200,
      margin: '0 20px',
      outline: 'none',
    }),
    control: (provided) => ({
      ...provided,
      boxShadow: 'none',
      background: '#222222',
      borderColor: '#424242',
      '&:hover': {
        borderColor: '#424242',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: 17,
    }),
  }), [])

  return (

    <AppBar className={classes.root} color='transparent' position='relative' title={<img src={siteLogo} />}>
      <Toolbar className={classes.toolbar}>
        <Grid item sm={2} className={classes.siteLogoCon}>
          <img src={siteLogo} className={classes.siteLogo} alt={''} />
        </Grid>
        <Grid item sm={2} className={classes.companyLogoCon}>
          {
              user.organisation && 
              <img src={user.organisation.logo} className={classes.userLogoOfficial} alt={''} />
          } 
          {/* <div className={classes.organizationName}>
              {user.organisation && `${user.organisation.name}`}
          </div> */}
        </Grid>

        {false && (
          <Select
            onChange={handleChangeCollection}
            value={selectedPortfolio}
            styles={selectPortfoliosStyles}
            options={[
              {
                value: user.organisation && user.organisation.name,
                label: user.organisation && user.organisation.name,
              },
              { value: 'b', label: 'Baaa' },
              { value: 'c', label: 'Caaa' },
              { value: 'd', label: 'Daaa' },
            ]} />
        )}


        <div className={classes.rightPanel}>
          <Link to={isDashboardView ? '/settings' : '/'}>
            <Tooltip title={isDashboardView ? 'settings' : 'dashboard'}>
              <IconButton classes={{ root: classes.headerIcon }}>
                {
                  isDashboardView ?
                    <SettingsIcon  /> :
                    <DashboardIcon />
                }
              </IconButton>
            </Tooltip>
          </Link>

          {
            /* <IconButton classes={{ root: classes.headerIcon }} onClick={() => {}}>
              <NotificationsIcon />
            </IconButton> */
          }

          <div className={classes.signOut} onClick={() => {
            dispatch(signOut())
          }}>
            Sign Out
          </div>
        </div>

      </Toolbar>
    </AppBar>
  )
}

export default Header