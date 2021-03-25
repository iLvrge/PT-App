import React, { useState } from 'react'
import { Button, Fade, TextField, Typography } from '@material-ui/core'
import useStyles from './styles'
import { withRouter } from 'react-router-dom'

function Login(props) {
  const classes = useStyles()
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
    console.log('RESET')
    props.forget({
      username: forgetUsername
    }).catch(err => {
      setError(err)
    })
  }

  return (
    <div className={classes.loginForm}>
      <Typography
        variant   = "h1"
        className = {classes.greeting}
      >
        {heading}
      </Typography>
      <Fade in={!!error}>
        <Typography
          color     = "secondary"
          className = {classes.errorMessage}
        >
          Your username and password are not correct!
        </Typography>
      </Fade>
      
      {
        login 
        ?
        <div>
          <TextField
          id          = {'username'}
          value       = {username}
          onChange    = {e => setUsername(e.target.value)}
          InputProps  = {{
            classes: {
              underline: classes.textFieldUnderline,
              input: classes.textField,
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
              underline: classes.textFieldUnderline,
              input: classes.textField,
            },
          }}
          margin      = "normal"
          placeholder = "Password"
          type        = "password"
          fullWidth
        />
        <div className={classes.formButtons}>
          <Button
            variant   = "contained"
            color     = "primary"
            size      = "large"
            disabled  = {
              username.length === 0 || password.length === 0
            }
            onClick   = {onSignIn}
          >
            Login
          </Button>
          <Button
            color     = "primary"
            size      = "large"
            className = {classes.forgetButton}
            onClick = {() => {
              setHeading('Forget Password')
              setLogin(false)
            }}
          >
            Forget Password
          </Button>
        </div>
        </div>
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
                underline: classes.textFieldUnderline,
                input: classes.textField,
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
            className = {classes.forgetButton}
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