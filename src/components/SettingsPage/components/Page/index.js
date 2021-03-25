import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import useStyles from './styles'
import Paper from '@material-ui/core/Paper'
import Header from '../Header'
import EditDialog from '../EditDialog'
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'
import BaseTable from '../Table'

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const DEFAULT_SERIALIZE = (t) => t

export default function Page({
  loading,
  childComponent,
  className,
  title = '',
  columns = [],
  data = [],
  idKey,
  name,
  fieldsComponent,
  checkbox,
  actions = {},
}) {
  const { fetchItems, deleteItem, deleteItems, addItem, updateItem,  serialize = DEFAULT_SERIALIZE, deserialize = DEFAULT_SERIALIZE } = actions
  
  const expandable = !!childComponent
  const editable = !!updateItem
  const selectable = !!(deleteItem || deleteItems || checkbox)  
  const addable = !!addItem
  

  const classes = useStyles()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [ selected, setSelected ] = React.useState([])
  const [ expanded, setExpanded ] = React.useState([])

  const [ search, setSearch ] = useState('')
  const [ editedRow, setEditedRow ] = useState(null)
  const rows = useMemo(() => data.map(serialize), [ data, serialize ])

  useEffect(() => {
    if (Array.isArray(fetchItems)) {
      fetchItems.forEach(fetch => {
        dispatch(fetch())
      })
    } else if (fetchItems) {
      dispatch(fetchItems())
    }
  }, [ dispatch, fetchItems ])

  const onDelete = useCallback(async () => {
    try {
      if (deleteItems) {
        await dispatch(deleteItems(selected.join(',')))
      } else {
        await Promise.all(selected.map((id) => dispatch(deleteItem(id))))
      }
      enqueueSnackbar(`${selected.length} ${name}s removed successfully`, { variant: 'success' })
      setSelected([])
      setExpanded([])
    } catch (e) {
      enqueueSnackbar(`failed to remove ${selected.length} ${name}s`, { variant: 'error' })
    }
  }, [ setSelected, dispatch, selected, enqueueSnackbar, deleteItem, deleteItems, name ])

  const onSubmit = useCallback(async (item) => {
    const editMode = !!item[idKey]
    try {
      if (editMode) {
        await dispatch(updateItem(deserialize(item)))
      } else {
        await dispatch(addItem(deserialize(item)))
      }
      enqueueSnackbar(`${capitalize(name)} ${editMode ? 'updated' : 'created'} successfully`, { variant: 'success' })
    } catch (e) {
      console.log(e)
      enqueueSnackbar(`Failed to ${editMode ? 'update' : 'create'} ${name}`, { variant: 'error' })
    }
  }, [ dispatch, deserialize, enqueueSnackbar, idKey, updateItem, addItem, name ])
  
  const onAdd = useCallback(() => setEditedRow({}), [])
  
  return (
    <Fragment>
      {
        fieldsComponent && (
          <EditDialog
            open={!!editedRow}
            name={name}
            idKey={idKey}
            editedRow={editedRow}
            setEditedRow={setEditedRow}
            onSubmit={onSubmit}
            fieldsComponent={fieldsComponent} />
        )
      }

      <div className={clsx(classes.tableRoot, className)}>
        <Paper className={classes.paper} square>
          <Header
            search={search}
            setSearch={setSearch}
            title={title}
            numSelected={selected.length}
            onCheckable={checkbox ? true : false}
            onDelete={selectable && onDelete}
            onAdd={addable && onAdd} />

          <BaseTable
            loading={loading}
            search={search}
            rows={rows}
            selected={selected}
            setSelected={setSelected}
            expanded={expanded}
            setExpanded={setExpanded}
            childComponent={childComponent}
            columns={columns}
            idKey={idKey}
            setEditedRow={setEditedRow}
            expandable={expandable}
            selectable={selectable}
            checkbox={checkbox}
            editable={editable}
            editedRow={editedRow}
          />
        </Paper>
      </div>
    </Fragment>
  )
}
