import React, { useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loader from '../common/Loader'

import { Grid, Typography } from '@material-ui/core'

import useStyles from './styles'
import logo from './logo.svg'
import Login from './login'
import Reset from './reset'
import * as authActions from '../../actions/authActions'

function Auth(props) {
  const classes = useStyles()

  const [ showLogin, setShowLogin ] = useState(true)

  const [ runReset, setRunReset ] = useState(0)

  const [ passReset, setPassReset ] = useState(0)

  let { token } = useParams()

  if (
    token !== undefined &&
    props.auth.isLoadingReset === true &&
    runReset === 0
  ) {
    setRunReset(1)
    setShowLogin(false)
    props.actions.checkCode(token).catch(err => {
      console.log(err)
      setShowLogin(true)
    })
  }

  if (props.auth.password_reset === true && passReset === 0) {
    setPassReset(1)
    setShowLogin(true)
  }


  if (props.auth.authenticated) return <Redirect to={'/dashboard'} />
  return (
    <div>
      {!props.auth.redirect_page ? (
        <Grid container className={classes.container}>
          <div className={classes.logotypeContainer}>
            <img src={logo} alt="logo" className={classes.logotypeImage} />
            <Typography className={classes.logotypeText}>PatenTrack</Typography>
          </div>
          <div className={classes.formContainer}>
            <div className={classes.form}>
              {showLogin ? (
                <Login
                  login={props.actions.login}
                  forget={props.actions.forget}
                  auth_email_sent={props.auth.auth_email_sent}
                />
              ) : props.auth.isLoadingReset ? (
                <Loader />
              ) : (
                <Reset
                  code={props.auth.code}
                  passwordReset={props.actions.passwordReset}
                  password_reset={props.password_reset}
                />
              )}
            </div>
          </div>
        </Grid>
      ) : (
        ''
      )}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
