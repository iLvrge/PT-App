import React, { Fragment, useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from './styles'
import Loader from '../../../../../common/Loader'
import { addCompany, setSearchCompanies } from '../../../../../../actions/patenTrackActions'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import StyledSearch from '../../../../../common/StyledSearch'
import { Toolbar, IconButton, Tooltip, Typography, Zoom, TextField, Button, Paper } from '@mui/material'
import { DebounceInput } from 'react-debounce-input'
import VirtualizedTable from '../../../../../common/VirtualizedTable'
import PatenTrackApi from '../../../../../../api/patenTrack2'
import SendIcon from '@mui/icons-material/Send'
import AddIcon from '@mui/icons-material/Add'
import AddMenu from './AddMenu'
import Chip from '@mui/material/Chip'
import { setMainCompaniesRowSelect } from '../../../../../../actions/patentTrackActions2'

const COLUMNS = [
  {
    label: '',
    width: 50,
    dataKey: 'id',
    role: 'checkbox',
  },
  {
    width: 240,
    minWidth: 240,
    oldWidth: 240,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 100,
    label: 'Assignments',
    align: 'right',
    dataKey: 'assignments',
  },
]

const COMPANY_HEADER_COLUMNS = [
  {
    label: '',
    width: 10,
    dataKey: 'company_id',
    /* role: 'checkboxwait', */ 
    role: "checkbox",
    disableSort: true,
    enable: false,
    formatCondition: 'status',

  },
  {
    width: 150,
    minWidth: 150,
    oldWidth: 150,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 150,
    minWidth: 150,
    oldWidth: 150,
    label: 'Status',
    dataKey: 'status',
  }
]

function SearchCompanies({ onClose, selected, setSelected }) {
  const {
    searchCompanies,
  } = useSelector(state => ({
    searchCompanies: state.patenTrack.searchCompanies,
  }))
  const searchTxtField = useRef(null);
  const dispatch = useDispatch()
  const classes = useStyles()
  const [headerColumns, setHeaderColumns] = useState(COLUMNS)
  const [ menuAnchorEl, setMenuAnchorEl ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const [ search, setSearch ] = useState('')
  const [ list, setList ] = useState([])
  const [ companyHeaderColumns, setCompanyHeaderColumns] = useState(COMPANY_HEADER_COLUMNS)
  const [ selectedCompanyRequest, setSelectedCompanyRequest] = useState([])

  const rows = useMemo(() => {
    return (searchCompanies || []).map(row => ({
      id: row.id,
      name: row.name,
      assignments: row.counter === null ? row.instances : row.counter,
    }))
  }, [ searchCompanies ])

  const onSearch = useCallback(async () => {
    /* setSelected([])
    dispatch(setSearchCompanies([]))
    PatenTrackApi.cancelRequest()
    setLoading(false)

    if (search.length > 2) {
      setLoading(true)
      const response = await PatenTrackApi.searchCompany(search)
      setLoading(false)
      dispatch(setSearchCompanies(response.data))
    } */
  }, [ setSelected, dispatch, search ])

  const getCompanyRequestList = async() => {
    setLoading(true)
    const {data} = await PatenTrackApi.getCompaniesRequest();
    setLoading(false)
    setList(data.length > 0 ? data : [])
  }
  

  useEffect(() => {
    //onSearch()
  }, [ onSearch ])

  useEffect(() => {
    getCompanyRequestList()
  }, [])

  const onDropContent = useCallback( event => {
    event.preventDefault();
    setSearch( event.dataTransfer.getData('text') )
  }, []);

  useEffect(()=>{
    if(searchTxtField.current != null) {
      const inputText = searchTxtField.current.querySelector('input[type="search"]')
      if(inputText != null) {
        inputText.addEventListener('drop', onDropContent)
      }
    }
  }, [])

  const createParent = useCallback(() => {
    if (selected && selected.length > 0) {
      let form = new FormData()
      form.append('name', JSON.stringify(selected))
      dispatch(addCompany(form))
      setSelected([])
    }
  }, [ setSelected, dispatch, selected ])

  const onSelect = useCallback((event, row) => {
    setSelected(selection => (
      selection.includes(row.id) ? selection.filter(id => id !== row.id) : [ ...selection, row.id ]),
    )
  }, [ setSelected ])

  const onSelectAll = useCallback((event) => {
    const { checked } = event.target
    setSelected(checked ? rows.map((row) => row.id) : [])
  }, [ rows, setSelected ])

  const associateToParent = useCallback((company) => () => {
    let form = new FormData()
    form.append('name', JSON.stringify(selected))
    form.append('parent_company', company.id)
    dispatch(addCompany(form))
    setSelected([])
  }, [ setSelected, dispatch, selected ])

  const resizeColumnsWidth = useCallback((dataKey, data) => {
    let previousColumns = [...headerColumns]
    const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

    if( findIndex !== -1 ) {
      previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
      previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
    }
    setHeaderColumns(previousColumns)
}, [ headerColumns ] )

const resizeColumnsStop = useCallback((dataKey, data) => {
  let previousColumns = [...headerColumns]
  const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

  if( findIndex !== -1 ) {
    previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width + data.x
  }
  setHeaderColumns(previousColumns)
}, [ headerColumns ] )


const resizeCompanyHeaderColumnsWidth = useCallback((dataKey, data) => {
  let previousColumns = [...companyHeaderColumns]
  const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

  if( findIndex !== -1 ) {
    previousColumns[findIndex].width =  previousColumns[findIndex].oldWidth + data.x
    previousColumns[findIndex].minWidth = previousColumns[findIndex].oldWidth + data.x
  }
  setCompanyHeaderColumns(previousColumns)
}, [ companyHeaderColumns ] )

const resizeCompanyHeaderColumnsStop = useCallback((dataKey, data) => {
  let previousColumns = [...companyHeaderColumns]
  const findIndex = previousColumns.findIndex( col => col.dataKey == dataKey )

  if( findIndex !== -1 ) {
    previousColumns[findIndex].oldWidth =  previousColumns[findIndex].width + data.x
  }
  setCompanyHeaderColumns(previousColumns)
}, [ companyHeaderColumns ] )

const handleOnInputChange = useCallback((e) => setSearch(e.target.value), [])
const openAddMenu = useCallback((e) => setMenuAnchorEl(e.currentTarget), [])
const closeAddMenu = useCallback(() => setMenuAnchorEl(null), [])


const onCompanyRequestRowSelect = useCallback((event, row) => {
  if(row.status != 'Data is being prepared') {
    let oldItems = [...selected]
    console.log(row.company_id)
    if(!oldItems.includes(row.company_id)){
      oldItems.push(row.company_id)
    } else {
      oldItems = oldItems.filter( item => item != row.company_id)
    }
    setSelected(oldItems)
  }
  
}, [selected])
 

const onHandleAddCompany = useCallback(async(event) => {
    const formData = new FormData();
    formData.append('name', searchTxtField.current.querySelector('input[type="text"]').value)
    const requestData = await PatenTrackApi.addCompanyRequest(formData)
    console.log('requestData', requestData)

    if(requestData) {
      searchTxtField.current.querySelector('input[type="text"]').value = ''
      getCompanyRequestList()
    }
});

  return (
    <Fragment>
      {/* <Typography variant="body2" sx={{p: 1}}>
        To add to your account the data of any company (including competitors and others) please state the requested company's name below:
      </Typography> */}
      <Toolbar className={classes.toolbar}>
        <div className={classes.toolbar}>
          <div className={classes.searchContainer} ref={searchTxtField}>
            {/* <DebounceInput
              element={StyledSearch}
              placeholder={'Search Companies'}
              value={search}              
              onChange={handleOnInputChange}
              debounceTimeout={500} /> */}
              
              <TextField 
                id="request_add_new_company" 
                name="request_add_new_company"  
                label="Request an additional company"
                size="small"
              />
          </div>
          {
            searchCompanies.length > 0 && (
              <Chip
                color='default'
                size="small"
                label={`${selected.length ? `${selected.length}/` : ''}${searchCompanies.length.toLocaleString()}`} />
            )
          } 
        </div>
          <IconButton
            color="inherit" 
            onClick={onHandleAddCompany}
            /* startIcon={<AddIcon className={classes.icon} />} */
            className={classes.btnGroup}
          >
            <SendIcon/>
          </IconButton>
          {
            selected.length > 0 && (
            <Fragment>
              <AddMenu
                anchorEl={menuAnchorEl}
                onClose={closeAddMenu}
                createParent={createParent}
                associateToParent={associateToParent} />

              <Tooltip 
                title={
                  <Typography color="inherit" variant='body2'>{'Import a company to your account'}</Typography>
                } 
                enterDelay={0}
                TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
              >
                <div>
                  <Button
                    disabled={!selected.length}
                    onClick={openAddMenu}
                    className={classes.btnGroup}
                    style={{color: '#fff'}}
                  >
                    Import
                  </Button>
                </div>
              </Tooltip>          
            </Fragment>
            )
          }
        

        <IconButton onClick={onClose} style={{ display: 'none' }} size="large">
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Paper square className={classes.root}>
        {
          loading ? (
            <Loader />
          ) : (
              <VirtualizedTable
                classes={classes}
                selected={selected}
                selectedKey={"company_id"}
                headerHeight={53.86}
                rowHeight={51}
                rowCount={list.length}
                rows={list}
                columns={companyHeaderColumns} 
                highlightRow={true} 
                higlightColums={[1]}
                onSelect={onCompanyRequestRowSelect}
                resizeColumnsWidth={resizeCompanyHeaderColumnsWidth}
                resizeColumnsStop={resizeCompanyHeaderColumnsStop}
              /> 
          )
        }
      </Paper>
    </Fragment>
  );
}

export default SearchCompanies
