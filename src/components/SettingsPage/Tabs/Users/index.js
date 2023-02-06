import React, {useMemo, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addUser, deleteUser, fetchUsers, updateUser } from '../../../../actions/settingsActions'
import { ROLES, ROLES_INV } from './contants'
import UserForm from './UserForm'
import Page from '../../components/Page'
import Checkbox from '@mui/material/Checkbox'

import { setBreadCrumbs } from  '../../../../actions/patentTrackActions2'

const ID_KEY = 'user_id'
const TITLE = 'Users'
const NAME = 'user'

const ACTIONS = {
  fetchItems: fetchUsers,
  deleteItem: deleteUser,
  addItem: addUser,
  updateItem: updateUser,
  serialize: (user) => ({
    ...user,
    role: ROLES[user.role_id],
  }),
  deserialize: (user) => ({
    ...user,
    role_id: ROLES_INV[user.role],
    role: ROLES_INV[user.role],
  }),
}

const Users = () => {
  const dispatch = useDispatch()
  const { list, loading } = useSelector(state => state.settings.users)

  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Users'))
  }, [ dispatch ])

  const FileRender = useMemo(() => (file) => {  
    return (
      <>
        {
          file != "" ? <img src={file} width={'40'} /> : ''
        }
      </>
    )
  }, [])

  const SlackRender = useMemo(() => (slack, row) => {  
    return (
      <>
        {
          slack !== 0 ? <Checkbox checked={true} onClick={() => {removeFromWorkSpace(row)}}/>  : ''
        }
      </>
    )
  }, [])

  const removeFromWorkSpace = (row) => {
  }

  
  const COLUMNS = [
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'job_title', label: 'Title' },
    { id: 'email_address', label: 'Email' },
    { id: 'logo', label: 'Profile Pic', render: FileRender, alignCenter: true, width: 150 },
    { id: 'telephone', label: 'Telephone' },
    { id: 'role', label: 'Type' },
  ]
  
  return (
    <Page
      loading={loading}
      actions={ACTIONS}
      name={NAME}
      fieldsComponent={UserForm}
      idKey={ID_KEY}
      title={TITLE}
      columns={COLUMNS}
      data={list}
    />
  )
}

export default Users
