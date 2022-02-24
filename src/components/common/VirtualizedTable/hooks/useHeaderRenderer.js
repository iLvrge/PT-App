import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TableCell from '@material-ui/core/TableCell'
import clsx from 'clsx'
import Checkbox from '@material-ui/core/Checkbox'
import Radio from '@material-ui/core/Radio'
import { FilterList } from '@material-ui/icons'
import Badge from '@material-ui/core/Badge'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Menu from '@material-ui/core/Menu'
import Fade from '@material-ui/core/Fade'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Draggable from "react-draggable"
import _groupBy from 'lodash/groupBy'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined'

import { numberWithCommas } from '../../../../utils/numbers'

const useStyles = makeStyles(() => ({
  listItemIcon: {
    minWidth: 0,
  },
  filterList: {
    marginRight: 3,
    fontSize: 13,
  },
  th: {
    display: 'flex',
    border: 'none',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableCell: {
    flex: 1,
    whiteSpace: 'nowrap',
    border: 'none',
    alignItems: 'center',
    padding: '0',
  },
  paper: {
    maxHeight: 300,
    overflow: 'auto',
  },
  chip: {
    marginLeft: 15,
  },
  badge: {
    position: 'absolute',
    left: '-4px', 
    '& .MuiBadge-colorPrimary': {
      top: '4px',
      backgroundColor: 'inherit',
      right: 'inherit',
      transform: 'none'
    }    
  },
  badgeSelection: {
    position: 'absolute',
    left: 'calc(100% - 83%)', 
    '& .MuiBadge-colorPrimary': {
      top: '4px',
      backgroundColor: 'inherit',
      right: 'inherit',
      transform: 'none',
      color: '#E60000'
    }   
  },
  labelPos: {
    position: 'absolute',
    top: 13,
    left: 13,
  }
}))

const HeadCell = ({
  headerHeight,
  createSortHandler,
  onSelectAll,
  allSelected,
  isIndeterminate,
  sortBy,
  dataKey,
  sortDirection,
  label,
  columns,
  columnIndex,
  rows,
  totalRows,
  grandTotal,
  grandTotalAssets,
  onChangeColumnFilters,
  resizeColumnsWidth,
  resizeColumnsStop,
  icon,
  checkedIcon,
  selectedItems,
  selectedGroup
}) => {
  /*console.log('LIBRARY1', selectedItems, selectedGroup, typeof selectedGroup, typeof selectedGroup !== 'undefined')*/
  /* if(typeof selectedGroup !== 'undefined') {
    console.log('LIBRARY1', selectedItems, selectedGroup, typeof selectedGroup, typeof selectedGroup !== 'undefined')
  } */
  const classes = useStyles()
  const { align, headerAlign, role, disableSort, filterable, paddingLeft, badge, showGrandTotal, grandTotalField, draggable, headingIcon, show_selection_count, secondLabel, show, showDropdown, list, onClickHeadDropdown, show_button, button } = columns[columnIndex]
  const [ anchorEl, setAnchorEl ] = useState(null)
  const [ columnFilters, setColumnFilters ] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const openMenu = e => setAnchorEl(e.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  useEffect(() => {
    onChangeColumnFilters(dataKey, columnFilters)
  }, [ onChangeColumnFilters, dataKey, columnFilters ])

  const filterValues = useMemo(() => {
    return Object.entries(_groupBy(rows, dataKey)).map(([ key, values ]) => ({ key, count: values.length }))
  }, [ rows, dataKey ])

  const onChangeFilter = (value) => () => (
    setColumnFilters(prevFilters => prevFilters.includes(value) ? prevFilters.filter((val) => val !== value) : [ ...prevFilters, value ])
  )

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleDropdownOpen = () => {
    setDropdownOpen(true);
  };
  
  /* console.log('useHEaderRenderer=>', allSelected, selectedItems.length, totalRows, (selectedItems.length > 0 && selectedItems.length < totalRows) ) */
  return ( 
    <TableCell
      component={'div'}
      padding={role === 'checkbox' ? 'none' : undefined}
      className={clsx(classes.tableCell, classes.flexContainer, classes.th)}
      variant="head"
      style={{ height: headerHeight, paddingLeft: paddingLeft != undefined ? paddingLeft : 'inherit' }}
      align={typeof headerAlign !== 'undefined' ? headerAlign : align}>
      {
        role === 'checkbox' ? (     
          onSelectAll && (
            <>
              <Checkbox checked={totalRows > 0 && (allSelected  || selectedItems.length == totalRows) } onChange={onSelectAll} indeterminate={selectedItems.length > 0 && selectedItems.length < totalRows} {...(icon != undefined ? { icon, checkedIcon } : {})}/>
              {
                show_selection_count === true && selectedItems.length > 0 
                ?
                <Badge color='primary' max={99999} className={classes.badgeSelection} badgeContent={numberWithCommas(typeof selectedGroup !== 'undefined' ? selectedItems.length - selectedGroup.length : selectedItems.length)} showZero={false}></Badge>
                :
                ''
              } 
            </>
          )
        ) : role === 'radio' ? (
          <>
            {
              typeof show === 'undefined' || typeof show !== 'undefined' &&  show === true ? <Radio color="secondary" onChange={onSelectAll} checked={allSelected}/> : ''
            }
            {
              show_selection_count === true && selectedItems.length > 0
              ?
              <Badge color='primary' max={99999} className={classes.badgeSelection} badgeContent={numberWithCommas(typeof selectedGroup !== 'undefined' ? selectedItems.length - selectedGroup.length : selectedItems.length)} showZero={false}></Badge>
              :
              ''
            }
          </>
        ) : role === 'static_dropdown' && showDropdown === true ? (
          <Select
              labelId='dropdown-open-select-label'
              id='dropdown-open-select'
              IconComponent={(props) => (
                <ExpandMoreOutlinedIcon {...props}/>
              )}
              open={dropdownOpen}
              onClose={handleDropdownClose}
              onOpen={handleDropdownOpen} 
              value={''}
              onChange={onClickHeadDropdown}
            >
              {
                list.map( (c, idx) => (
                  <MenuItem key={idx} value={c.id}>
                    {
                      c.icon != '' ? c.icon : c.image != '' ? <img src={c.image} style={{width: '21px'}}/> : ''
                    }
                    <Typography variant="inherit" className={'heading'}> {c.name}</Typography> 
                  </MenuItem> 
                ))
              } 
            </Select>
        ) : (
          <>
            {
              filterable && (
                <FilterList
                  className={classes.filterList}
                  color={columnFilters.length ? 'secondary' : 'inherit'}
                  size={'small'}
                  onClick={openMenu} />
              )
            }  
            {
              headingIcon == 'company'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={`tableheadingIcon noStroke`}><path d="M46.4 7.8L34.9 6.1V1c0-.6-.4-1-1-1H1.8c-.6 0-1 .4-1 1v46c0 .6.4 1 1 1h44.5c.6 0 1-.4 1-1V8.8c-.1-.5-.4-.9-.9-1zM19.9 46h-4.1v-6h4.1v6zm13 0h-11v-7c0-.6-.4-1-1-1h-6.1c-.6 0-1 .4-1 1v7h-11V2h30.1v44zm2 0V8.1l10.4 1.6v4.9h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7v6.2h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7V31h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7v6.2h-2.7c-.6 0-1 .4-1 1s.4 1 1 1h2.7V46H34.9z"></path><path d="M21.5 9h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 16.8h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 24.6h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM21.5 32.4h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM25.2 41.9c0 .6.4 1 1 1h2.7c.6 0 1-.4 1-1s-.4-1-1-1h-2.7c-.6 0-1 .5-1 1zM6.8 42.9h2.7c.6 0 1-.4 1-1s-.4-1-1-1H6.8c-.6 0-1 .4-1 1s.5 1 1 1zM8.2 9h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 16.8h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 24.6h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1zM8.2 32.4h6c.6 0 1-.4 1-1s-.4-1-1-1h-6c-.6 0-1 .4-1 1s.4 1 1 1z"></path></svg>
                  </span>
                </span>
              : 
              headingIcon == 'activities'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`tableheadingIcon noStroke`}><path d="M0 0h24v24H0z" fill="none"></path><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"></path></svg>
                  </span>
                </span>
              :
              headingIcon == 'parties'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`tableheadingIcon noStroke`} ><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"></path></svg>
                  </span>
                </span>                
              :
              headingIcon == 'inventors'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" className={`tableheadingIcon noStroke`} ><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M13,8.57c-0.79,0-1.43,0.64-1.43,1.43s0.64,1.43,1.43,1.43s1.43-0.64,1.43-1.43S13.79,8.57,13,8.57z"></path><path d="M13,3C9.25,3,6.2,5.94,6.02,9.64L4.1,12.2C3.85,12.53,4.09,13,4.5,13H6v3c0,1.1,0.9,2,2,2h1v3h7v-4.68 c2.36-1.12,4-3.53,4-6.32C20,6.13,16.87,3,13,3z M16,10c0,0.13-0.01,0.26-0.02,0.39l0.83,0.66c0.08,0.06,0.1,0.16,0.05,0.25 l-0.8,1.39c-0.05,0.09-0.16,0.12-0.24,0.09l-0.99-0.4c-0.21,0.16-0.43,0.29-0.67,0.39L14,13.83c-0.01,0.1-0.1,0.17-0.2,0.17h-1.6 c-0.1,0-0.18-0.07-0.2-0.17l-0.15-1.06c-0.25-0.1-0.47-0.23-0.68-0.39l-0.99,0.4c-0.09,0.03-0.2,0-0.25-0.09l-0.8-1.39 c-0.05-0.08-0.03-0.19,0.05-0.25l0.84-0.66C10.01,10.26,10,10.13,10,10c0-0.13,0.02-0.27,0.04-0.39L9.19,8.95 c-0.08-0.06-0.1-0.16-0.05-0.26l0.8-1.38c0.05-0.09,0.15-0.12,0.24-0.09l1,0.4c0.2-0.15,0.43-0.29,0.67-0.39l0.15-1.06 C12.02,6.07,12.1,6,12.2,6h1.6c0.1,0,0.18,0.07,0.2,0.17l0.15,1.06c0.24,0.1,0.46,0.23,0.67,0.39l1-0.4c0.09-0.03,0.2,0,0.24,0.09 l0.8,1.38c0.05,0.09,0.03,0.2-0.05,0.26l-0.85,0.66C15.99,9.73,16,9.86,16,10z"></path></g></g></svg>
                  </span>
                </span>                
              :
              headingIcon == 'transactions'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg id="icons" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={`tableheadingIcon noStroke`}><path d="M52,7H12a6,6,0,0,0-6,6V51a6,6,0,0,0,6,6H52a6,6,0,0,0,6-6V13A6,6,0,0,0,52,7Zm2,44a2,2,0,0,1-2,2H12a2,2,0,0,1-2-2V13a2,2,0,0,1,2-2H52a2,2,0,0,1,2,2Z"/><path d="M45,29a2,2,0,0,0,0-4H22.83l2.58-2.59a2,2,0,0,0-2.82-2.82l-6,6a2,2,0,0,0-.44,2.18A2,2,0,0,0,18,29Z"/><path d="M47,36H20a2,2,0,0,0,0,4H42.17l-2.58,2.59a2,2,0,1,0,2.82,2.82l6-6a2,2,0,0,0,.44-2.18A2,2,0,0,0,47,36Z"/></svg>
                  </span>
                </span>                              
              :
              headingIcon == 'assets'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`tableheadingIcon noStroke`} ><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"></path></svg>
                  </span>
                </span>
              :
              headingIcon == 'recorded'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 30 30" version="1.1" viewBox="0 0 30 30" className={`tableheadingIcon addStroke`}><g><path d="M28.595,7.562l-5.438-6.309l-1.078-1.25H9.228c-1.727,0-3.124,1.397-3.124,3.124v3.971H8.04l-0.001-3.21   c0.004-0.971,0.784-1.756,1.752-1.756l10.994-0.01v5.208c0.001,1.939,1.567,3.51,3.507,3.51h3.807L27.91,25.86   c-0.004,0.967-0.784,1.747-1.752,1.754L9.652,27.606c-0.883,0-1.594-0.866-1.6-1.935V24.4H6.114v1.896   c0,1.907,1.277,3.455,2.845,3.455l17.763-0.005c1.726,0,3.124-1.404,3.124-3.126V9.016L28.595,7.562" fill="#292929"></path><path d="M20.145,25.368H0V6.129h20.145V25.368 M1.934,23.432h16.274V8.065H1.934"></path><path d="M10.314,9.069   c0.305,0.141,0.242,0.328,0.148,1.201c-0.097,0.905-0.414,2.554-1.032,4.173c-0.616,1.622-1.529,3.21-2.325,4.39   c-0.797,1.178-1.478,1.943-1.998,2.386c-0.519,0.441-0.882,0.559-1.115,0.599c-0.233,0.04-0.339,0-0.405-0.117   c-0.063-0.118-0.084-0.315-0.031-0.551c0.053-0.234,0.181-0.51,0.542-0.863c0.36-0.354,0.956-0.785,1.785-1.188   c0.829-0.402,1.891-0.775,2.762-1.031s1.551-0.393,2.146-0.5c0.595-0.108,1.104-0.187,1.604-0.226c0.5-0.04,0.988-0.04,1.467,0   c0.478,0.039,0.945,0.117,1.348,0.216c0.406,0.097,0.745,0.217,1.042,0.402c0.299,0.187,0.552,0.441,0.681,0.726   c0.127,0.286,0.127,0.6,0.021,0.825c-0.105,0.227-0.318,0.364-0.563,0.441c-0.246,0.08-0.522,0.099-0.851,0   c-0.33-0.098-0.712-0.314-1.115-0.599c-0.404-0.284-0.829-0.638-1.381-1.187c-0.553-0.551-1.232-1.298-1.807-2.023   c-0.573-0.727-1.041-1.434-1.358-2.033c-0.319-0.599-0.489-1.09-0.627-1.582c-0.138-0.491-0.244-0.98-0.287-1.422   c-0.043-0.443-0.021-0.837,0.021-1.149c0.042-0.315,0.106-0.55,0.213-0.708c0.106-0.157,0.256-0.235,0.362-0.275   s0.169-0.04,0.234-0.049c0.063-0.009,0.126-0.029,0.222,0c0.094,0.03,0.216,0.104,0.34,0.18" fill="none" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="0.75"></path></g></svg>
                  </span>
                </span>
              :
              headingIcon == 'initiated'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`tableheadingIcon noStroke`} ><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>
                  </span>
                </span>
              :
              headingIcon == 'slack_image'
              ?
                <span className={`MuiButtonBase-root MuiIconButton-root headingIcon slackIcon`}>
                  <span className={`MuiIconButton-label`}>
                    <svg style={{width: '24px', height: '24px'}} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 270 270"><g><g><path fill="#E01E5A" d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"></path><path fill="#E01E5A" d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V151.2z"></path></g><g><path fill="#36C5F0" d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"></path><path fill="#36C5F0" d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9H118.8z"></path></g><g><path fill="#2EB67D" d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"></path><path fill="#2EB67D" d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9V118.8z"></path></g><g><path fill="#ECB22E" d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"></path><path fill="#ECB22E" d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9H151.2z"></path></g></g></svg>
                  </span>
                </span>
              :
              headingIcon == 'pdf'
              ?
                <img src={`https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/pdf_file.svg`} style={{width: '24px', height: '24px'}}/>
              :
              '' 
            }
            {
              disableSort 
              ? 
                label
              : (
                <TableSortLabel
                  onClick={createSortHandler(dataKey)}
                  active={dataKey === sortBy}
                  direction={sortDirection.toLowerCase()}>                    
                    { label }                    
                    {badge === true && totalRows > 0 ? <Badge color='primary' max={9999999} className={classes.badge} badgeContent={`${numberWithCommas(totalRows)} ${ secondLabel !== undefined ? secondLabel : ''}`} showZero></Badge> : ''}
                    {showGrandTotal === true && ( grandTotal > 0 || rows.length > 0 && rows[rows.length - 1].grand_total > 0 || (typeof grandTotalAssets !== 'undefined' && grandTotalAssets > 0 && grandTotalField == 'grandTotalAssets')) ? <Badge color='primary' max={9999999} className={classes.badge} badgeContent={`${numberWithCommas((typeof grandTotalAssets !== 'undefined' && grandTotalField == 'grandTotalAssets' && grandTotalAssets > 0) ? grandTotalAssets : grandTotal > 0 ? grandTotal : rows.length > 0 && rows[rows.length - 1].grand_total ? rows[rows.length - 1].grand_total : 0)} ${ secondLabel !== undefined ? secondLabel : ''}`} showZero></Badge> : ''}
                    { badge === false && showGrandTotal === false &&  secondLabel !== undefined ? <div className={classes.labelPos}>{secondLabel}</div> : ''}
                    { show_button === true ? button : '' }
                </TableSortLabel>
              )
            }
            { 
              (
                <Menu
                  anchorEl={anchorEl}
                  open={!!anchorEl}
                  onClose={closeMenu}
                  classes={{ paper: classes.paper }}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  TransitionComponent={Fade}>
                  {
                    filterValues.map(({ key, count }) => {
                      return (
                        <MenuItem key={key} onClick={onChangeFilter(key)}>
                          <ListItemIcon className={classes.listItemIcon}>
                            <Checkbox
                              checked={columnFilters.includes(key)}
                              edge="start"
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': 'labelId' }}
                            />
                          </ListItemIcon>
                          <ListItemText id={'labelId'} primary={key} />
                          <Chip className={classes.chip} label={count} size={'small'} variant={'outlined'} />
                        </MenuItem>
                      )
                    })
                  }
                </Menu>
              )
            }
          </>
        )
      }
      
      {
        draggable === true ?
        <Draggable
          axis="x"
          defaultClassName="DragHandle"
          defaultClassNameDragging="DragHandleActive"
          onDrag={(event, data) => 
            resizeColumnsWidth(
              dataKey,
              data
            )
          } 
          onStop={(event, data) => 
            resizeColumnsStop(
              dataKey,
              data
            )
          }
          position={{ x: 0 }}
          zIndex={999}
        >
          <span className="DragHandleIcon">⋮</span>
        </Draggable>
        :
        ''
      }
    </TableCell>
  )
}

function useHeaderRenderer(rows, headerHeight, columns, createSortHandler, onSelectAll, allSelected, isIndeterminate, totalRows, grandTotal, grandTotalAssets, onChangeColumnFilters, resizeColumnsWidth, resizeColumnsStop, icon, checkedIcon, selectedItems, selectedGroup) {
  
  return useCallback(({ sortBy, dataKey, sortDirection, label, columnIndex }) => {
    return (
      <HeadCell
        columns={columns}
        columnIndex={columnIndex}
        headerHeight={headerHeight}
        createSortHandler={createSortHandler}
        selectedGroup={selectedGroup}
        selectedItems={selectedItems}
        onSelectAll={onSelectAll}
        icon={icon}
        checkedIcon={checkedIcon}
        allSelected={allSelected}
        isIndeterminate={isIndeterminate}
        sortBy={sortBy}
        dataKey={dataKey}
        sortDirection={sortDirection}
        label={label}
        rows={rows}
        totalRows={totalRows}
        grandTotal={grandTotal}
        grandTotalAssets={grandTotalAssets}
        onChangeColumnFilters={onChangeColumnFilters}
        resizeColumnsWidth={resizeColumnsWidth}
        resizeColumnsStop={resizeColumnsStop}
      />
    )
  }, [
    headerHeight,
    columns,
    createSortHandler,
    onSelectAll,
    allSelected,
    isIndeterminate,
    rows,
    totalRows,
    onChangeColumnFilters,
    selectedItems
  ])
}


export default useHeaderRenderer

// checked={columnFilters.some((filter) => filter.columnName === column.name && filter.value === value)}
