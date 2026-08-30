import React, { useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loader from '../common/Loader'

import { Grid, Typography } from '@mui/material'

import logo from './logo.svg'
import Login from './login'
import Reset from './reset'
import * as authActions from '../../actions/authActions'

import getToken from '../../api/token'

function Auth(props) {

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
 

  if (props.auth.authenticated && getToken() !== '') { 
    return <Redirect to="/dashboard" />;
  }
  return (
    <div>
      {!props.auth.redirect_page ? (
        <Grid container className={"absolute left-0 top-0 flex h-screen w-screen items-center justify-center"}>
          <div className={"flex h-full w-3/5 flex-col items-center justify-center bg-[#1976d2] dark:bg-[#90caf9] max-[1199.95px]:hidden"}>
            <img src={logo} alt="logo" className={"mb-8 w-[165px]"} />
            <Typography className={"text-[84px] font-medium text-white max-[1199.95px]:text-5xl"}>PatenTrack</Typography>
          </div>
          <div className={"flex h-full w-2/5 flex-col items-center justify-around max-[1199.95px]:w-1/2"}>
            <div className={"w-[320px]"}>
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
