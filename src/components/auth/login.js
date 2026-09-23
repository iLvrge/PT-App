import React, { useState } from 'react'
import { Button, Fade, TextField, Typography } from '@mui/material'
import { withRouter } from 'react-router-dom'
import { problemType, retryAfterSeconds } from '../../api/problem'

/**
 * What to tell someone whose sign-in failed.
 *
 * This screen used to say the credentials were wrong whatever had happened —
 * including when the rate limiter had locked the address out, or the server
 * was unreachable. People then retried a password that was fine, which on a
 * locked-out address is the one thing that keeps it locked out.
 */
const signInMessage = (error) => {
  if (!error) return ''
  if (error.isNetworkError) {
    return error.isOffline
      ? 'You appear to be offline. Check your connection and try again.'
      : 'Could not reach the server. Please try again in a moment.'
  }
  if (problemType(error) === 'rate-limited') {
    const wait = retryAfterSeconds(error)
    const minutes = wait ? Math.ceil(wait / 60) : null
    return minutes
      ? `Too many sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
      : 'Too many sign-in attempts. Please try again later.'
  }
  const status = error.response && error.response.status
  if (status && status >= 500) {
    return 'The server had a problem signing you in. Please try again.'
  }
  return 'Your username and password are not correct!'
}

function Login(props) {
  const [ username, setUsername ] = useState('')
  const [ heading, setHeading ] = useState('SignIn')
  const [ forgetUsername, setForgetUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState(null)
  const [ login, setLogin ] = useState(true)
  
  const onSignIn = () => {
    props.login({
      username,
      password
    })
      .catch(err => {
        setError(err)
      })
  }

  const onReset = () => { 
    props.forget({
      username: forgetUsername
    }).catch(err => { 
      setError(err)
    })
  }

  return (
    <div className={undefined}>
      <Typography
        variant   = "h1"
        className = {"mt-8 text-center font-medium"}
      >
        {heading}
      </Typography>
      <Fade in={!!error}>
        <Typography
          color     = "secondary"
          className = {"text-center"}
        >
          {signInMessage(error)}
        </Typography>
      </Fade>
      
      {
        login 
        ?
        // A form, so Enter in either field signs in; the fields used to sit
        // in a plain div and only the button's click reached onSignIn.
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (username.length > 0 && password.length > 0) onSignIn()
          }}
        >
          <TextField
          id          = {'username'}
          value       = {username}
          onChange    = {e => setUsername(e.target.value)}
          InputProps  = {{
            classes: {
              underline: "before:border-b-[#42a5f5] after:border-b-[#1976d2] hover:before:!border-b-[#42a5f5] dark:before:border-b-[#e3f2fd] dark:after:border-b-[#90caf9] dark:hover:before:!border-b-[#e3f2fd]",
              input: undefined,
            }
          }}
          margin      = "normal"
          placeholder = "UserName"
          type        = "text"
          fullWidth
        />

        <TextField
          id          = "password"
          value       = {password}
          onChange    = {e => setPassword(e.target.value)}
          InputProps  = {{
            classes: {
              underline: "before:border-b-[#42a5f5] after:border-b-[#1976d2] hover:before:!border-b-[#42a5f5] dark:before:border-b-[#e3f2fd] dark:after:border-b-[#90caf9] dark:hover:before:!border-b-[#e3f2fd]",
              input: undefined,
            },
          }}
          margin      = "normal"
          placeholder = "Password"
          type        = "password"
          fullWidth
        />
        <div className={"mt-8 flex w-full items-center justify-between"}>
          <Button
            variant   = "contained"
            color     = "primary"
            size      = "large"
            disabled  = {
              username.length === 0 || password.length === 0
            }
            type      = "submit"
          >
            Login
          </Button>
          <Button
            color     = "primary"
            size      = "large"
            className = {"font-normal normal-case"}
            onClick = {() => {
              setHeading('Forget Password')
              setLogin(false)
            }}
          >
            Forget Password
          </Button>
        </div>
        </form>
        :
        <div>
          {
            props.auth_email_sent
            ?
            <Fade in={true}>
              <Typography
                color     = "secondary"
              >
                We have sent you an email.
              </Typography>
            </Fade>
            :
            ''
          }
          <TextField
            id          = {'forgetUsername'}
            value       = {forgetUsername}
            onChange    = {e => setForgetUsername(e.target.value)}
            InputProps  = {{
              classes: {
                underline: "before:border-b-[#42a5f5] after:border-b-[#1976d2] hover:before:!border-b-[#42a5f5] dark:before:border-b-[#e3f2fd] dark:after:border-b-[#90caf9] dark:hover:before:!border-b-[#e3f2fd]",
                input: undefined,
              }
            }}
            margin      = "normal"
            placeholder = "UserName"
            type        = "text"
            fullWidth
          />
          <Button
            variant   = "contained"
            color     = "primary"
            size      = "large"
            disabled  = {
              forgetUsername.length === 0
            }
            onClick   = {onReset}
          >
            Reset
          </Button>
          <Button
            color     = "primary"
            size      = "large"
            className = {"font-normal normal-case"}
            onClick = {() => {
              setHeading('SignIn')
              setLogin(true)
            }}
          >
            Cancel
          </Button>
        </div>
      }
      
    </div>
  )
}

export default withRouter(Login)