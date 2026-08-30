import React, { useState } from 'react'
import { Button, Fade, TextField, Typography } from '@mui/material'
import { withRouter } from 'react-router-dom'

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
            onClick   = {onSignIn}
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