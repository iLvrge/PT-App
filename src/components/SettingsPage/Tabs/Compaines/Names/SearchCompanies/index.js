import React, { Fragment, useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from './styles'
import Loader from '../../../../../common/Loader'
import IconButton from '@material-ui/core/IconButton'
import { addCompany, setSearchCompanies } from '../../../../../../actions/patenTrackActions'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import StyledSearch from '../../../../../common/StyledSearch'
import Tooltip from '@material-ui/core/Tooltip'
import Toolbar from '@material-ui/core/Toolbar'
import { DebounceInput } from 'react-debounce-input'
import VirtualizedTable from '../../../../../common/VirtualizedTable'
import PatenTrackApi from '../../../../../../api/patenTrack'
import SendIcon from '@material-ui/icons/Send'
import AddMenu from './AddMenu'
import Chip from '@material-ui/core/Chip'

const COLUMNS = [
  {
    label: '',
    width: 50,
    dataKey: 'id',
    role: 'checkbox',
  },
  {
    width: 240,
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

function SearchCompanies({ onClose, selected, setSelected }) {
  const {
    searchCompanies,
  } = useSelector(state => ({
    searchCompanies: state.patenTrack.searchCompanies,
  }))
  const searchTxtField = useRef(null);
  const dispatch = useDispatch()
  const classes = useStyles()
  const [ menuAnchorEl, setMenuAnchorEl ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const [ search, setSearch ] = useState('')

  const rows = useMemo(() => {
    return (searchCompanies || []).map(row => ({
      id: row.id,
      name: row.name,
      assignments: row.counter === null ? row.instances : row.counter,
    }))
  }, [ searchCompanies ])

  const onSearch = useCallback(async () => {
    setSelected([])
    dispatch(setSearchCompanies([]))
    PatenTrackApi.cancelRequest()
    setLoading(false)

    if (search.length > 2) {
      setLoading(true)
      const response = await PatenTrackApi.searchCompany(search)
      setLoading(false)
      dispatch(setSearchCompanies(response.data))
    }
  }, [ setSelected, dispatch, search ])

  useEffect(() => {
    onSearch()
  }, [ onSearch ])

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

  const handleOnInputChange = useCallback((e) => setSearch(e.target.value), [])
  const openAddMenu = useCallback((e) => setMenuAnchorEl(e.currentTarget), [])
  const closeAddMenu = useCallback(() => setMenuAnchorEl(null), [])

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <div className={classes.toolbar}>
          <div className={classes.searchContainer} ref={searchTxtField}>
            <DebounceInput
              element={StyledSearch}
              placeholder={'Search Companies'}
              value={search}              
              onChange={handleOnInputChange}
              debounceTimeout={500} />
          </div>
          {
            searchCompanies.length > 0 && (
              <Chip
                variant='default'
                color='default'
                size="small"
                label={`${selected.length ? `${selected.length}/` : ''}${searchCompanies.length.toLocaleString()}`} />
            )
          }

        </div>

        <Fragment>
          <AddMenu
            anchorEl={menuAnchorEl}
            onClose={closeAddMenu}
            createParent={createParent}
            associateToParent={associateToParent} />

          <Tooltip title={'Send'}>
            <div>
              <IconButton
                disabled={!selected.length}
                
                color={'primary'}
                onClick={openAddMenu}>
                <SendIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Fragment>

        <IconButton onClick={onClose} style={{ display: 'none' }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <div className={classes.list}>
        {
          loading ? (
            <Loader />
          ) : (
            <VirtualizedTable
              classes={classes}
              selected={selected}
              headerHeight={53.86}
              rowHeight={50}
              rowCount={rows.length}
              rows={rows}
              columns={COLUMNS}
              onSelect={onSelect}
              onSelectAll={onSelectAll}
            />
          )
        }
      </div>
    </Fragment>
  )
}

export default SearchCompanies
