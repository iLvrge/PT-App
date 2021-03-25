import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import useStyles from './styles'
import MaterialTable from 'material-table'
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'

import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons'

import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from '../../../actions/patenTrackActions'

function Documents(props) {
  const classes = useStyles()
  const [ state, setState ] = useState([])
  const [ columns, setColumns ] = useState([
    {
      field: 'file',
      width: '80px',
      title: 'File',
      render: rowData => (
        <a target={'_BLANK'} href={rowData.file} className={classes.open}>
          <i
            className={
              rowData.file
                .toString()
                .toLowerCase()
                .indexOf('.pdf') >= 0
                ? 'fal fa-file-pdf pdf-red'
                : rowData.file
                    .toString()
                    .toLowerCase()
                    .indexOf('.doc') >= 0
                ? 'fal fa-file-word doc-blue'
                : rowData.file
                    .toString()
                    .toLowerCase()
                    .indexOf('.xls') >= 0
                ? 'fal fa-file-spreadsheet excel-green'
                : rowData.file
                    .toString()
                    .toLowerCase()
                    .indexOf('.ppt') >= 0
                ? 'fal fa-presentation ppt-yellow'
                : 'fal fa-file'
            }
          ></i>
        </a>
      ),
      editComponent: () => (
        <div>
          <input id="file" type="file" onChange={onFileChange} />
        </div>
      ),
    },
    { field: 'name', title: 'Name' },
    { field: 'description', title: 'Description' },
  ])
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  }
  const options = {
    paging: false,
    search: false,
    maxBodyHeight: (props.height * 39) / 100,
    addRowPosition: 'first',
    toolbarButtonAlignment: 'left',
  }

  const [ file, setFile ] = useState('')

  const [ message, setMessage ] = useState('')

  const [ open, setOpen ] = useState(false)

  const onFileChange = e => {
    console.log(e, e.target, e.target.files)
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  

  useEffect(() => {

    let mounted = true
    setState({
      columns: columns,      data: [],
    })
    if (props.documentList.length > 0) {
      setState({
        data: props.documentList,
      })
    }

    if (props.update_document_row !== null) {
      props.documentList.map((row, index) => {
        if (row.id === props.update_document_row.id) {
          props.documentList[index] = props.update_document_row
          return false
        }
      })
      console.log('changedRows', props.documentList)
      setState({ ...state, data: props.documentList })
    }
    return () => (mounted = false)
  }, [ columns, props.documentList, props.update_document_row, state ])

  const errorProcess = err => {
    console.log('error', err)
  }

  return (
    <div className={classes.userItemsContainer}>
      <div className={classes.container}>
        <Collapse in={open}>
          <Alert severity="warning">{message}</Alert>
        </Collapse>
        <div
          className={classes.scrollbar}
          style={{ height: (props.height * 39) / 100 }}
        >
          {
            <MaterialTable
              localization={{
                header: {
                  actions: '#',
                },
              }}
              title=""
              icons={tableIcons}
              columns={columns}
              data={state.data}
              options={options}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    console.log('newData', newData)
                    if (file !== '' && file !== null) {
                      let formData = new FormData()
                      Object.entries(newData).map(key => {
                        if (key[0] !== 'tableData') {
                          formData.append(key[0], key[1])
                        }
                      })
                      formData.append('file', file)
                      props.addDocument(formData)
                      setTimeout(() => {
                        resolve()
                        setFile('')
                        setState(prevState => {
                          const data = [ ...prevState.data ]
                          data.push(newData)
                          console.log('onRowAdd', newData)
                          return { ...prevState, data }
                        })
                      }, 600)
                    } else {
                      reject()
                      setMessage('Please select a file')
                      setOpen(true)
                      setTimeout(() => {
                        setOpen(false)
                      }, 3000)
                    }
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise(resolve => {
                    if (oldData) {
                      let formData = new FormData()
                      let editUserID = 0
                      Object.entries(newData).map(key => {
                        if (key[0] !== 'tableData') {
                          if (key[0] === 'id') {
                            editUserID = key[1]
                          } else {
                            formData.append(key[0], key[1])
                          }
                        }
                      })
                      if (editUserID > 0) {
                        if (file !== '' && file !== null) {
                          formData.append('file', file)
                        }
                        props.updateDocument(formData, editUserID)
                        setTimeout(() => {
                          resolve()
                          if (oldData) {
                            setState(prevState => {
                              const data = [ ...prevState.data ]
                              data[data.indexOf(oldData)] = newData
                              console.log('onRowUpdate', newData)
                              return { ...prevState, data }
                            })
                          }
                        }, 600)
                      }
                    }
                  }),
                onRowDelete: oldData =>
                  new Promise(resolve => {
                    if (oldData.id > 0) {
                      props.deleteDocument(oldData.id)
                      setTimeout(() => {
                        resolve()
                        setState(prevState => {
                          const data = [ ...prevState.data ]
                          data.splice(data.indexOf(oldData), 1)
                          console.log('onRowDelete', oldData)
                          return { ...prevState, data }
                        })
                      }, 600)
                    }
                  }),
              }}
            />
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    documentList: state.patenTrack.documentList,
    update_document_row: state.patenTrack.update_document_row,
  }
}

const mapDispatchToProps = {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents)
