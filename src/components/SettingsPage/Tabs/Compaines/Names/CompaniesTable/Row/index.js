import React, { useCallback, useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import clsx from 'clsx'
import useStyles from './styles'
import Box from '@mui/material/Box' 
import { ListItemIcon, ListItemText, MenuItem, Select } from '@mui/material'
import { useSelector } from 'react-redux'

function Row({ onSelect, isSelected, isChildSelected, row, updateData, moveItem }) {
  const [ open, setOpen ] = useState(false)
  const [dropdownValue, setDropdownRowItem] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [ editableRow, setEditableRow ] = useState(null)
  const companiesList = useSelector(state => state.patenTrack.companiesList)
  const classes = useStyles()
  const toggleOpen = useCallback((e) => {
    e.stopPropagation()
    setOpen(open => !open)
  }, [])

  const editColumn = (row) => { 
    setEditableRow(row)
  }

  const onHandleChangeName = (event) => {   
    if(event.charCode == 13 || event.keyCode == 13) {
      updateData(event.target.value, editableRow)
      setEditableRow(null)
    } else if(event.key === "Escape") {
      setEditableRow(null)
    }
  }

  const handleDropdownClose = () => {
    setDropdownOpen(false);
    setDropdownRowItem(null)
  };

  const handleDropdownOpen = (item) => { 
    setDropdownRowItem(item)
    setDropdownOpen(true);
  };

  const onHandleDropDown = (event, item) => {
    console.log('onHandleDropDown', event, event.target.value, item)
    moveItem(event.target.value, item)

  }

  const ShowDropDown = ({item}) => { 
    return (
      <Select
        labelId='dropdown-open-select-label'
        id='dropdown-open-select'
        IconComponent={(props) => (
          dropdownOpen ? <ExpandLessIcon {...props} /> : <ChevronRightIcon {...props}/>
        )}
        open={ dropdownOpen && item.id == dropdownValue.id}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
          getContentAnchorEl: null
        }}
        onClose={handleDropdownClose}
        onOpen={() => handleDropdownOpen(item)}  
        onChange={(event) =>  onHandleDropDown(event, item) }
        value={''}
      >
        <MenuItem key={-99} value={-99}>
            <ListItemIcon>
              
            </ListItemIcon>
            <ListItemText className={'heading'}>
              Move Outside 
            </ListItemText> 
        </MenuItem>
        {
          (companiesList || []).map(company => {
            return company.type == 1 
              ?
                <MenuItem key={company.id} value={company.id}>
                    <ListItemIcon>
                      
                    </ListItemIcon>
                    <ListItemText className={'heading'}>
                      {
                        company.representative_name === null
                        ? company.original_name
                        : company.representative_name}
                    </ListItemText> 
                </MenuItem>
              :
                ''
          })
          
        }
      </Select> 
    )
  }

  return (
    <React.Fragment>
      <TableRow
        className={clsx({ [classes.expand]: open })}
        hover
        onClick={event => onSelect(event, row, 'parent')}
        selected={isSelected(row.id)}
        role="checkbox"
        tabIndex={-1}
        key={row.id}>

        <TableCell padding="none">
          {
            row.children.length > 0
            ?
              <IconButton
                onClick={toggleOpen} size="small"
              >
                {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            : 
              <ShowDropDown item={row}/>
          }
          
        </TableCell>

        {/* <TableCell className={classes.actionTh} padding="none">
          <Checkbox
            checked={isSelected(row.id)}
            value={row.id}
          />
        </TableCell> */}

        {/* <TableCell>
          {row.slack !== ''
            ? 
              <a onClick={() => removeFromSlack(row.id)}>
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon slackIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg style={{width: '24px', height: '24px'}} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg>
                  </span>
                </span>
              </a>
            : ''}
        </TableCell> */}

        <TableCell 
          className={classes.padLR0}  
          {...(row.children.length > 0 ? {onClick: () => editColumn(row)} : {})}
        >
          {
            editableRow !== null && row.id == editableRow.id
            ?
              <input
                type="text"
                autoFocus
                defaultValue={row.representative_name === null
                  ? row.original_name
                  : row.representative_name}
                  onKeyDown={e => onHandleChangeName(e)}
              />
            :
              <React.Fragment>
                {
                  row.representative_name === null
                  ? row.original_name
                  : row.representative_name
                }
                {row.children.length > 0 ? `(${row.children.length})` : ''}
              </React.Fragment> 
          }
          
        </TableCell>

        <TableCell align={'center'}>
          {row.counter === null ? row.instances : row.counter}
        </TableCell>
      </TableRow>
      {
        row.children.length > 0 && (
          <TableRow>
            <TableCell className={classes.collapsedCell} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box className={classes.box}>
                  <Table>
                    <TableBody>
                      {row.children.map((company, idx) => (
                        <TableRow
                          hover
                          onClick={event => !(isSelected(row.id)) && onSelect(event, company, 'child')}
                          role="checkbox"
                          aria-checked={isChildSelected(company.id)}
                          tabIndex={-1}
                          key={`${company.id}_child`}
                          selected={isChildSelected(company.id)}
                        >
                          {/* <TableCell className={classes.actionCell}>
                            <Checkbox
                              checked={isChildSelected(company.id)}
                              inputProps={{
                                'aria-labelledby': `enhanced-table-checkbox-${idx}`,
                              }}
                              parent={row.id}
                              value={company.id}
                              disabled={isSelected(row.id)}
                            />
                          </TableCell>    */}
                          <TableCell>
                            <ShowDropDown item={company}/>
                          </TableCell>
                          <TableCell className={classes.padLR0}>
                            {company.original_name}
                          </TableCell> 
                          <TableCell align={'center'}>
                            {company.counter}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )
      }
    </React.Fragment>
  )
}

export default Row