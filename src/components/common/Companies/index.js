import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import useStyles from './styles'
import Loader from '../Loader'
import { getCompanies, setMainCompanyChecked, setSelectedCompany, deleteCompany, deleteSameCompany, addCompany, setSettingTabIndex, getAddressList,  getTelephoneList,  getCompanyLawyerList } from '../../../actions/patenTrackActions'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  mainTable: {
    '& table': {
      border: 0,
      '& th': {
        border: '0 !important',
      },
      '& td': {
        border: '0 !important',
      },
    },
  },
})

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  console.log(order, orderBy)
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  console.log('StableSort')
  const stabilizedThis = array.map((el, index) => [ el, index ])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  console.log(stabilizedThis.map(el => el[0]))
  return stabilizedThis.map(el => el[0])
}

function Row(props) {
  const { row } = props

  const [ open, setOpen ] = React.useState(false)

  const classes = useRowStyles()

  return (
    <React.Fragment>
      <TableRow
        className={`${classes.mainTable}`}
        hover
        role="checkbox"
        aria-checked={props.selected(row.id)}
        tabIndex={-1}
        key={`${row.id}_parent`}
        selected={props.selected(row.id)}
      >
        <TableCell style={{ width: '30px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: '30px' }}>
          <Checkbox
            checked={props.selected(row.id)}
            onClick={event => props.click(event, row.id, 'parent')}
            value={row.id}
            inputProps={{
              'aria-labelledby': `enhanced-table-checkbox-${props.index}`,
            }}
          />
        </TableCell>
        <TableCell align="left" component="th" scope="row">
          {row.representative_name === null
            ? row.original_name
            : row.representative_name}
        </TableCell>
        <TableCell align="right" style={{ paddingRight: '20px' }}>
          {row.counter === null ? row.instances : row.counter}
        </TableCell>
      </TableRow>
      <TableRow className={`${classes.mainTable}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box style={{ paddingLeft: '30px' }}>
              <Table
                aria-label="representatives"
                className={classes.childTable}
              >
                <TableBody>
                  {row.children.map((company, idx) => (
                    <TableRow
                      hover
                      onClick={event => props.click(event, company.id, 'child')}
                      role="checkbox"
                      aria-checked={props.child(company.id)}
                      tabIndex={-1}
                      key={`${company.id}_child`}
                      selected={props.child(company.id)}
                    >
                      <TableCell style={{ width: '30px' }}></TableCell>
                      <TableCell style={{ width: '30px' }}>
                        <Checkbox
                          checked={props.child(company.id)}
                          inputProps={{
                            'aria-labelledby': `enhanced-table-checkbox-${idx}`,
                          }}
                          parent={row.id}
                          value={company.id}
                        />
                      </TableCell>
                      <TableCell align="left" component="th" scope="row">
                        {company.original_name}
                      </TableCell>
                      <TableCell align="right" style={{ paddingRight: '20px' }}>
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
    </React.Fragment>
  )
}

function Companies(props) {
  const calHeight = parseInt((props.height * 39) / 100) - 3
  const classes = useStyles()

  const [ order, setOrder ] = React.useState('asc')

  const [ orderBy, setOrderBy ] = React.useState('name')

  const [ selected, setSelected ] = React.useState([])

  const [ childselected, setChildSelected ] = React.useState([])

  const [ selection, setSelection ] = useState([])

  const [ rows, setRows ] = useState([])

  useEffect(() => {
    setSelected([])
    if (props.companiesList && props.companiesList.length > 0) {
      setRows(props.companiesList)
    }
  }, [ props.companiesList ])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = property => event => {
    handleRequestSort(event, property)
  }

  const updateSelection = d => {
    if (d.length > 0) {
      const newValue = [ d[d.length - 1] ]
      setSelection(newValue)
      props.setMainCompanyChecked(true)
      props.setSelectedCompany(newValue[0])
    } else {
      setSelection(d)
      props.setMainCompanyChecked(false)
      props.setSelectedCompany('')
    }
  }

  const deleteCompany = () => {
    if (childselected.length > 0 || selected.length > 0) {
      if (window.confirm('Are you sure you want to delete')) {
        if (childselected.length > 0) {
          props.deleteSameCompany(childselected.join(','))
          setChildSelected([])
        }
        console.log('selection', selection)
        if (selected.length > 0) {
          props.deleteCompany(selection.join(','))
          props.setMainCompanyChecked(false)
          props.setSelectedCompany('')
          setSelected([])
        }
      }
    } else {
      alert('Please select company first.')
    }

    /*
    if(selection.length > 0) {
      if (window.confirm(`Are you sure you want to ${selection[0]}`)) {
        let findCompany = rows.filter(n => (n.name ===selection[0] && n.name !==n.parent)? n : undefined);
        console.log(selection, findCompany);
        if(findCompany.length ===0) {
          props.deleteCompany(selection[0]);
          props.setMainCompanyChecked( false );
          props.setSelectedCompany( "" );
        } else {
          props.deleteSameCompany( selection[0], findCompany[0].parent );
          props.setMainCompanyChecked( false );
          props.setSelectedCompany( "" );
        }        
      }
    }*/
  }
  const handleClick = (event, id, type) => {
    if (type === 'parent') {
      const selectedIndex = selected.indexOf(id)
      let newSelected = []

      if (selectedIndex === -1) {
        console.log('1')
        newSelected = newSelected.concat(selected, id)
      } else if (selectedIndex === 0) {
        console.log('2')
        newSelected = newSelected.concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
        console.log('3')
        newSelected = newSelected.concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
        console.log('4')
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        )
      }    
      updateSelection([ event.target.value ]) 
      props.setSettingTabIndex(3)
      props.getAddressList(event.target.value)
      props.getTelephoneList(event.target.value)
      props.getCompanyLawyerList(event.target.value)
      setSelected(newSelected)
    } else {
      let newSelected = []
      const selectedIndex = childselected.indexOf(id)
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(childselected, id)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(childselected.slice(1))
      } else if (selectedIndex === childselected.length - 1) {
        newSelected = newSelected.concat(childselected.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          childselected.slice(0, selectedIndex),
          childselected.slice(selectedIndex + 1),
        )
      }
      setChildSelected(newSelected)
    }
  }

  const isSelected = id => selected.indexOf(id) !== -1
  const isChildSelected = id => childselected.indexOf(id) !== -1

  const headCells = [
    {
      id: 'original_name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
      align: 'left',
      class: '',
    },
    {
      id: 'counter',
      numeric: true,
      disablePadding: false,
      label: 'Assignments',
      align: 'right',
      class: 'paddingRight20',
    },
  ]

  return (
    <div className={classes.nestedTree} style={{ height: calHeight }}>
      <div className={classes.container}>
        <div className={classes.context}>
          <span className={classes.heading}>{'My Companies Collections'} </span>
          {props.isLoading ? (
            <Loader />
          ) : (
            <TableContainer component={Paper}>
              <Table
                stickyHeader
                aria-label="collapsible table"
                className={classes.mainTable}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ width: '30px' }}>
                      <DeleteOutline
                        onClick={deleteCompany}
                        className={classes.delete}
                      />
                    </TableCell>
                    <TableCell
                      padding="checkbox"
                      style={{ width: '30px' }}
                    ></TableCell>
                    {headCells.map(headCell => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        className={
                          headCell.class !== '' ? classes[headCell.class] : ''
                        }
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={createSortHandler(headCell.id)}
                        >
                          {headCell.label}
                          {orderBy === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                              {order === 'desc'
                                ? 'sorted descending'
                                : 'sorted ascending'}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy)).map(
                    (row, index) => {
                      return (
                        <Row
                          key={row.id}
                          row={row}
                          index={index}
                          click={handleClick}
                          selected={isSelected}
                          child={isChildSelected}
                        />
                      )
                    },
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    companiesList: state.patenTrack.companiesList,
    isLoading: state.patenTrack.companyListLoading,
    main_company_selected: state.patenTrack.main_company_selected,
    main_company_selected_name: state.patenTrack.main_company_selected_name,
    searchCompaniesSelected: state.patenTrack.search_companies_selected,
  }
}

const mapDispatchToProps = {
  getCompanies,
  setMainCompanyChecked,
  setSelectedCompany,
  deleteCompany,
  deleteSameCompany,
  addCompany,
  setSettingTabIndex,
  getAddressList,
  getTelephoneList,
  getCompanyLawyerList
}

export default connect(mapStateToProps, mapDispatchToProps)(Companies)