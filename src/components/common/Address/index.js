import React, { useState, useEffect, forwardRef, useRef  } from 'react'
import { connect } from 'react-redux'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AddBox from '@mui/icons-material/AddBox'

import { Collapse, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField } from '@mui/material'

import { addAddress, addCompanyLawyer, addTelephone } from '../../../actions/patenTrackActions'

function Address(props) {

    const ref = useRef(null)

    const [ message, setMessage ] = useState('')

    const [ open, setOpen ] = useState(false)

    const [ warning, setWarning ] = useState(false)

    const [ formId, setFormID ] = useState(false)

    const [ label, setLabel ] = useState('')

    const [ header, setHeader ] = useState('')

    useEffect(() => {
        let mounted = true    
        if( props.addressList.length > 0 ) {
                
        }
        return () => mounted = false
    },[ props.addressList ])

    const openPopup = (t) => {
        setFormID(t)
        setOpen(true)
        setHeader(t == 1 ? 'Address' : t == 2 ? 'Lawyer' : 'Telephone')
        setLabel(t == 1 ? 'Address:' : t == 2 ? 'Lawyer name:' : 'Telephone number:')
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = (frm) => {
        if(props.main_company_selected_name > 0) {
            const form = new FormData(frm)
            setTimeout(() => {setOpen( false )}, 1000)
            return formId == 1 ? props.addAddress(form, props.main_company_selected_name) :  formId == 2 ? props.addCompanyLawyer(form, props.main_company_selected_name) : props.addTelephone(form, props.main_company_selected_name)            
        } else {
            alert('Please select company first.')
        }        
    }

    const showList = (t) => {
        const items = t == 1 ? props.addressList : t == 2 ? props.companyLawyerList : props.telephoneList
        return (
            <List>
            {
            items.map(
              (item, index) =>
                <ListItem>
                    <ListItemText
                        primary={item.item}
                    />
                </ListItem>
            )
            }
            </List>
        )
    }


  return (
    <div
      className  = {"relative z-[1000] flex h-full w-full grow flex-col"}
    >
      <div className={"absolute bottom-0 left-[5px] right-[5px] top-[5px] flex grow text-white [&_.MuiCollapse-root]:absolute [&_.MuiCollapse-root]:right-0 [&_.MuiCollapse-root]:z-[9] [&_.MuiCollapse-root]:text-black"}>
        <Collapse in={warning}>
          <Alert severity="warning">
            {message}
          </Alert>
        </Collapse>
        <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="draggable-dialog-title"
        maxWidth={'sm'}
        fullWidth={true}
        className={'record-modal'}
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {header}
            </DialogTitle>
            <DialogContent>          
                <div>
                <form ref={ref}  noValidate autoComplete="off">
                    <div>
                        <TextField id="name" label={label} name="name" />      
                    </div>
                </form>
                </div>
            </DialogContent>
            <DialogActions>
                <Button  onClick={handleClose} color="secondary">
                Cancel
                </Button>
                <Button autoFocus  color="primary" className={"cursor-pointer"} onClick={() => {handleSubmit(ref.current) }}>Save</Button>
            </DialogActions>
        </Dialog>
        <Grid
            item lg={4} md={4} sm={4} xs={4}
            className={"flex flex-col"}
        >            
            <Typography variant="h6">
                <AddBox fontSize="inherit" className={"cursor-pointer"} onClick={() => openPopup(1)}/> Address
            </Typography>
            <div className={"relative w-full grow overflow-hidden [&_.MuiPaper-root]:bg-[inherit] [&_.MuiTableCell-head]:bg-[inherit] [&_.MuiToolbar-gutters]:p-0"}
            style={{ height: props.height * 39  / 100 }}
            >
            {
                props.addressList.length > 0 && showList(1)
            }
            </div>            
        </Grid>
        <Grid
            item lg={4} md={4} sm={4} xs={4}
            className={"flex flex-col"}
        >
            <Typography variant="h6" >
                <AddBox fontSize="inherit" onClick={() => openPopup(2)}/> Lawyer
            </Typography>     
            <div className={"relative w-full grow overflow-hidden [&_.MuiPaper-root]:bg-[inherit] [&_.MuiTableCell-head]:bg-[inherit] [&_.MuiToolbar-gutters]:p-0"}
            style={{ height: props.height * 39  / 100 }}
            >
            {
                props.companyLawyerList.length > 0 && showList(2)
            } 
            </div>                  
        </Grid>
        <Grid
            item lg={4} md={4} sm={4} xs={4}
            className={"flex flex-col"}
        >
            <Typography variant="h6">
                <AddBox fontSize="inherit" onClick={() => openPopup(3)}/> Telephone
            </Typography> 
            <div className={"relative w-full grow overflow-hidden [&_.MuiPaper-root]:bg-[inherit] [&_.MuiTableCell-head]:bg-[inherit] [&_.MuiToolbar-gutters]:p-0"}
            style={{ height: props.height * 39  / 100 }}
            >
            {
                props.telephoneList.length > 0 && showList(3)
            } 
            </div>                      
        </Grid>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    addressList: state.patenTrack.addressList,
    telephoneList: state.patenTrack.telephoneList,
    companyLawyerList: state.patenTrack.companyLawyerList,
    main_company_selected: state.patenTrack.main_company_selected,
    main_company_selected_name: state.patenTrack.main_company_selected_name,
  }
}

const mapDispatchToProps = {
  addAddress,
  addCompanyLawyer,
  addTelephone
}

export default connect(mapStateToProps, mapDispatchToProps)(Address)