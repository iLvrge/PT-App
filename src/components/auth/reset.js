import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Fade, TextField, Typography } from '@mui/material'
import { withRouter } from 'react-router-dom'

function Reset(props) {
  const [ password, setPassword ] = useState('')
  const [ confirm_password, setConfirmPassword ] = useState('')
  const [ notMatched , setNotMatched ] = useState(false)
  const [ message, setMessage ] = useState('')
  
  
  const onUpdatePassword = () => { 
    setNotMatched( false )
    if(password.length < 8 || confirm_password.length < 8){
        setNotMatched( true )
        setMessage('Min 8 character length of password and confirm password.')
    } else if(password !== confirm_password){
        setNotMatched( true )
        setMessage('Password and Confirm password not matched')
    } else { 
        props.passwordReset({
            code: props.code,
            password: password,
            confirm_password: confirm_password
        })
        .catch(err => {
            setNotMatched( true )
            setMessage(err)
        })
    }
  }

  return (
    <div className={undefined}>
      <Typography
        variant   = "h1"
        className = {"mt-8 text-center font-medium"}
      >
        Reset Password
      </Typography>     
      <div>
        {
            notMatched 
            ?
            <Fade in={true}>
                <Typography
                color     = "secondary"
                className = {"text-center"}
                >
                {message}
                </Typography>
            </Fade>
            :
            ''
        }
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
        <TextField
          id          = "confirm_password"
          value       = {confirm_password}
          onChange    = {e => setConfirmPassword(e.target.value)}
          InputProps  = {{
            classes: {
              underline: "before:border-b-[#42a5f5] after:border-b-[#1976d2] hover:before:!border-b-[#42a5f5] dark:before:border-b-[#e3f2fd] dark:after:border-b-[#90caf9] dark:hover:before:!border-b-[#e3f2fd]",
              input: undefined,
            },
          }}
          margin      = "normal"
          placeholder = "Confirm Password"
          type        = "password"
          fullWidth
        />
        <Button
            variant   = "contained"
            color     = "primary"
            size      = "large"
            disabled  = {
                password.length === 0 || confirm_password.length === 0
            }
            onClick   = {onUpdatePassword}
          >
            Update
          </Button>
          <Button
            color     = "primary"
            size      = "large"
            className = {"font-normal normal-case"}
            component={Link} to="/"
          >
            Cancel
          </Button>
      </div>
    </div>
  )
}

export default withRouter(Reset)