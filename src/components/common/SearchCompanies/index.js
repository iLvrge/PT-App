import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import useStyles from './styles'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Loader from '../Loader'
import Paper from '@mui/material/Paper'
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  searchCompany,
  addCompany,
  setSearchCompanies,
  setSearchCompanyLoading,
  cancelRequest,
  setSelectedSearchCompanies,
  setMainCompanyChecked,
  setSelectedCompany,
} from '../../../actions/patenTrackActions'

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

function SearchCompanies(props) {
  const classes = useStyles()
  const inputEl = useRef(null)
  const [ checked, setChecked ] = useState([])
  const [ timeInterval, setTimeInterval ] = useState(null)
  const [ cancelTokenSource, setCancelTokenSource ] = useState('')
  const WAIT_INTERVAL = 200

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [ ...checked ]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
    console.log('newChecked', newChecked)
    if (newChecked.length > 0) {
      newChecked.forEach(company => {
        let form = new FormData()
        form.append('name', company)
        if (props.main_company_selected === true) {
          form.append('parent_company', props.main_company_selected_name)
        }
        props.addCompany(form)
      })
    }
  }

  const [ columns ] = useState([
    { name: 'name', title: 'Name' },
    {
      name: 'counter',
      title: 'Assignments',
      getCellValue: row => parseInt(row.counter),
    },
  ])

  const [ defaultColumnWidths ] = useState([
    { columnName: 'name', width: 400 },
    { columnName: 'counter', width: 150 },
  ])

  const [ sorting, getSorting ] = useState([])

  const [ rows, setRows ] = useState([])

  const [ selection, setSelection ] = useState([])

  const [ open, setOpen ] = useState(false)

  React.useEffect(() => {
    if (props.searchCompanies && props.searchCompanies.length > 0) {
      setRows(props.searchCompanies)
    }
  }, [ props.searchCompanies ])

  const handleSearchCompany = event => {
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval)
    setTimeInterval(
      setTimeout(() => {
        setSelection([])
        if (inputEl.current.querySelector('#search_company').value.length > 2) {
          props.searchCompany(
            inputEl.current.querySelector('#search_company').value,
          )
        } else {
          props.setSearchCompanyLoading(false)
          props.setSearchCompanies([])
          props.cancelRequest()
        }
      }, WAIT_INTERVAL),
    )
  }

  const getRowId = row => row.id

  const addCompany = () => {
    console.log('selection', selection)
    if (selection && selection.length > 0) {
      let form = new FormData()
      form.append('name', JSON.stringify(selection))
      props.addCompany(form)
      setTimeout(() => {
        setSelection([])
      }, 500)
    }
  }

  /*const updateSelection = (d) => {
    if(d.length > 0) {
      const newValue = [d[d.length-1]];
      setSelection(newValue);
      addCompany(newValue[0]);
    } else {
      setSelection(d);
    }    
  };*/

  const updateSelection = (event, d) => {
    let selected = [ ...selection ]
    if (event.target.checked) {
      console.log('selected', selected)
      selected.push(d)
    } else {
      const currentIndex = selected.indexOf(d)
      selected.splice(currentIndex, 1)
    }
    setSelection(selected)
    console.log(selected, selection)
    props.setSelectedSearchCompanies(d)
  }

  const selectParentCompany = () => {
    /** */
    if (selection && selection.length > 0) {
      console.log('props.main_company_selected', props.main_company_selected)
      console.log(
        'props.main_company_selected_name',
        props.main_company_selected_name,
      )
      if (
        props.main_company_selected === true &&
        props.main_company_selected_name > 0
      ) {
        let form = new FormData()
        form.append('name', JSON.stringify(selection))
        if (props.main_company_selected === true) {
          form.append('parent_company', props.main_company_selected_name)
        }
        props.addCompany(form)
        setTimeout(() => {
          setSelection([])
          props.setMainCompanyChecked(false)
          props.setSelectedCompany('')
        }, 500)
      } else {
        setOpen(true)
        setTimeout(() => {
          setOpen(false)
        }, 3000)
      }
    } else {
      /** */
    }
  }

  function Row(props) {
    const { row } = props

    const [ open, setOpen ] = React.useState(true)

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
            {row.children.length > 0 ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            ) : (
              ''
            )}
          </TableCell>
          <TableCell style={{ width: '30px' }}>
            <Checkbox
              checked={props.selected(row.id)}
              onClick={event => props.click(event, row.id)}
              value={row.id}
              inputProps={{
                'aria-labelledby': `enhanced-table-checkbox-${props.index}`,
              }}
            />
          </TableCell>
          <TableCell align="left" component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right" style={{ paddingRight: '20px' }}>
            {row.counter === null ? row.instances : row.counter}
          </TableCell>
        </TableRow>
        {row.children.length > 0 ? (
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
                          tabIndex={-1}
                          key={`${company.id}_child`}
                        >
                          <TableCell style={{ width: '30px' }}></TableCell>
                          <TableCell style={{ width: '30px' }}></TableCell>
                          <TableCell align="left" component="th" scope="row">
                            {company.name}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ paddingRight: '20px' }}
                          >
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
        ) : (
          ''
        )}
      </React.Fragment>
    )
  }

  const isSelected = id => {
    if (selection.length > 0) {
      return selection.indexOf(id) !== -1
    } else {
      return false
    }
  }

  return (
    <div className={classes.searchContainer}>
      <div className={classes.container}>
        <div className={classes.context}>
          <Collapse in={open}>
            <Alert severity="warning">
              Please select a parent company first
            </Alert>
          </Collapse>
          <form noValidate autoComplete="off" className={classes.form}>
            <TextField
              id="search_company"
              name="search_company"
              ref={inputEl}
              label="Enter a Company Name to Search"
              onChange={handleSearchCompany}
            />
            <span className={classes.spanAbsolute}>
              {props.searchCompanies.length > 0
                ? props.searchCompanies.length.toLocaleString()
                : ''}
            </span>
            <a
              onClick={selectParentCompany}
              title="Click to associate a parent"
              className={`${classes.iconAbsolute}`}
            >
              <i className={'far fa-layer-plus'}></i>
            </a>
            <a
              onClick={addCompany}
              title="Click to create a parent"
              className={`${classes.iconAbsolute} ${classes.right}`}
            >
              <i className={'fas fa-plus'}></i>
            </a>
          </form>
          <div className={`search-list ${classes.scrollbar}`}>
            {props.isLoading ? (
              <Loader />
            ) : (
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 20,
                  maxScrollbarLength: 25,
                }}
              >
                {props.searchCompanies.length > 0 ? (
                  <Paper style={{ height: props.height - 157 }} square>
                    <Table
                      stickyHeader
                      aria-label="collapsible table"
                      className={classes.mainTable}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="center"
                            style={{ width: '30px' }}
                          ></TableCell>
                          <TableCell
                            padding="checkbox"
                            style={{ width: '30px' }}
                          ></TableCell>
                          <TableCell align="left">Name</TableCell>
                          <TableCell
                            align="right"
                            className={classes.paddingRight20}
                          >
                            Assignments
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <Row
                            key={row.id}
                            row={row}
                            index={index}
                            click={updateSelection}
                            selected={isSelected}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                ) : (
                  ''
                )}
              </PerfectScrollbar>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    isLoading: state.patenTrack.searchCompanyLoading,
    searchCompanies: state.patenTrack.searchCompanies,
    main_company_selected: state.patenTrack.main_company_selected,
    main_company_selected_name: state.patenTrack.main_company_selected_name,
  }
}

const mapDispatchToProps = {
  searchCompany,
  addCompany,
  setSearchCompanyLoading,
  setSearchCompanies,
  setSelectedSearchCompanies,
  setMainCompanyChecked,
  setSelectedCompany,
  cancelRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCompanies)
