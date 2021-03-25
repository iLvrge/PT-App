import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Fade, TextField, Typography } from '@material-ui/core'
import useStyles from './styles'
import { withRouter } from 'react-router-dom'

function Reset(props) {
  const classes = useStyles()
  const [ password, setPassword ] = useState('')
  const [ confirm_password, setConfirmPassword ] = useState('')
  const [ notMatched , setNotMatched ] = useState(false)
  const [ message, setMessage ] = useState('')
  
  
  const onUpdatePassword = () => {
    console.log('UPDATE PASSWORD')
    setNotMatched( false )
    if(password.length < 8 || confirm_password.length < 8){
        setNotMatched( true )
        setMessage('Min 8 character length of password and confirm password.')
    } else if(password !== confirm_password){
        setNotMatched( true )
        setMessage('Password and Confirm password not matched')
    } else {
        console.log('Sending request')
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
    <div className={classes.loginForm}>
      <Typography
        variant   = "h1"
        className = {classes.greeting}
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
                className = {classes.errorMessage}
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
              underline: classes.textFieldUnderline,
              input: classes.textField,
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
              underline: classes.textFieldUnderline,
              input: classes.textField,
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
            className = {classes.forgetButton}
            component={Link} to="/"
          >
            Cancel
          </Button>
      </div>
    </div>
  )
}

export default withRouter(Reset)