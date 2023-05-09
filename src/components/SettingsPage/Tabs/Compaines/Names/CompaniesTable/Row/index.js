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

function Row({ selected, onSelect, isSelected, isChildSelected, row, updateData, moveItem }) {
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
    const groupName = event.target.innerText
    let targetValue = 0
    if(groupName != '') {
      if(companiesList.length > 0) { 
        const filterList = companiesList.filter(company => {
          if(company.type == 1) {
            const name = company.representative_name === null
            ? company.original_name
            : company.representative_name
            return groupName == name
          }
        }) 
        if(filterList.length > 0) {
          targetValue = filterList[0].id
        }
      }
    }  
    setDropdownOpen(!dropdownOpen) 
    if(targetValue >= 0) { 
      moveItem(targetValue, item) 
    }
  }

  const ShowDropDown = ({item, parent}) => { 
    const groups = [];
    if(companiesList.length > 0) { 
      companiesList.map(company => {
        if(company.type == 1) {
          groups.push(company)
        }
      })
    }
    
    let entry = true;
    if(typeof parent != 'undefined' && parent === true) {
      if(groups.length === 0) {
        entry = false
      }
    }  
    if(entry === false || item.status == 0) return ''
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
          }
        }}
        onClose={handleDropdownClose}
        onOpen={() => handleDropdownOpen(item)}  
        onClick={(event) => onHandleDropDown(event, item) }
        value={''}
      >
        {
          typeof parent == 'undefined' 
          ?
            <MenuItem key={-99} value={-99}> 
              <ListItemText className={'heading'}>
                Move outside this group
              </ListItemText> 
            </MenuItem>
          :
            ''
        }
        {
          groups.length > 0 
          ?
            <GetChildItems list={groups}/>
          :
            ''
        } 
      </Select> 
    )
  }

  const GetChildItems = ({list}) => { 
    return ( 
      list.map(company =>  (
        <MenuItem key={company.id} value={company.id}> 
          <ListItemText className={'heading'}>
            {
              company.representative_name === null
              ? company.original_name
              : company.representative_name}
          </ListItemText> 
        </MenuItem>
      )) 
    ) 
  }

  const rowOnClick = (event, row, type) => {
    if(selected.includes(row.id)) {
      setEditableRow(null)
    } 
    onSelect(event, row, type)
  }

  return (
    <React.Fragment>
      <TableRow
        className={clsx({ [classes.expand]: open, [classes.disabled] : row.status == 1 ? false : true, [classes.highlightRow]: row.status == 0 && isSelected(row.id)})}
        hover
        /* onClick={event => row.status == 1 ? rowOnClick(event, row, 'parent') : ''} */
        onClick={event => rowOnClick(event, row, 'parent')}
        selected={row.status == 1 ? isSelected(row.id) : false}
        role="checkbox"
        tabIndex={-1}
        key={row.id}>

        <TableCell padding="none">
          {
            row.children.length > 0
            ?
              <IconButton
                disabled = {row.status == 1 ? false : true}
                onClick={toggleOpen} size="small"
              >
                {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            : 
              <ShowDropDown item={row} parent={true}/> 
          }
          
        </TableCell>
        <TableCell 
          className={clsx(classes.padLR0, row.type == 1 ? classes.groupHeading : '')}   
        >
          {
            editableRow !== null && row.id == editableRow.id
            ?
              <input
                type="text"
                autoFocus
                disabled = {row.status == 1 ? false : true}
                defaultValue={row.representative_name === null
                  ? row.original_name
                  : row.representative_name}
                  onKeyDown={e => onHandleChangeName(e)}
              />
            :
              <span
                {...(row.children.length > 0 ? {onClick: () => editColumn(row)} : {})}
              >
                {
                  row.representative_name === null
                  ? row.original_name
                  : row.representative_name
                }
                {row.children.length > 0 ? ` (${row.children.length})` : ''}
              </span> 
          }
          
        </TableCell>

        <TableCell align={'center'}>
          {row.status == 1 ? row.counter === null ? row.instances : row.counter : ''}
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
                        className={clsx(classes.tableRow, {[classes.disabled]: company.status == 0 ? true : false})}
                          hover={company.status == 0 ? false : true} 
                          onClick={event => company.status == 1 ? rowOnClick(event, company, 'child') : ''}
                          aria-checked={isChildSelected(company.id)}
                          tabIndex={-1}
                          key={`${company.id}_child`} 
                          selected={company.status == 0 ? false : isChildSelected(company.id)} 
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
                          <TableCell style={{width: 50}}>
                            <ShowDropDown item={company}/>
                          </TableCell>
                          <TableCell className={classes.padLR0}>
                            {company.original_name}
                          </TableCell> 
                          <TableCell align={'center'} style={{width: 155}}>
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