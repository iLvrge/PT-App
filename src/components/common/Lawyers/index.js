import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import useStyles from './styles'
import MaterialTable from 'material-table'
import PerfectScrollbar from 'react-perfect-scrollbar'
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
  getLawyers,
  addLawyer,
  updateLawyer,
  deleteLawyer,
} from '../../../actions/patenTrackActions'

function Lawyers(props) {
  const classes = useStyles()
  const [ state, setState ] = useState([])
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

  useEffect(() => {
    const columns = [
      { field: 'first_name', title: 'First Name' },
      { field: 'last_name', title: 'Last Name' },
      { field: 'firm_name', title: 'Firm Name' },
      { field: 'email_address', title: 'Email' },
      { field: 'telephone', title: 'Telephone' },
      { field: 'telephone1', title: 'Telephone1' },
    ]
    let data = []

    if (props.lawyerList.length > 0) {
      data = props.lawyerList
    }
    setState({
      columns: columns,
      data: data,
    })
  }, [ props.lawyerList ])

  const errorProcess = err => {
    console.log('error', err)
  }

  return (
    <div className={classes.userItemsContainer}>
      <div className={classes.container}>
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
              columns={state.columns}
              data={state.data}
              options={options}
              editable={{
                onRowAdd: newData =>
                  new Promise(resolve => {
                    let formData = new FormData()
                    Object.entries(newData).map(key => {
                      if (key[0] !== 'tableData') {
                        formData.append(key[0], key[1])
                      }
                    })
                    props.addLawyer(formData).catch(err => {
                      errorProcess({ ...err }.response)
                    })
                    setTimeout(() => {
                      resolve()
                      setState(prevState => {
                        const data = [ ...prevState.data ]
                        data.push(newData)
                        console.log('onRowAdd', newData)
                        return { ...prevState, data }
                      })
                    }, 600)
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
                        props.updateLawyer(formData, editUserID).catch(err => {
                          errorProcess({ ...err }.response)
                        })
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
                      props.deleteLawyer(oldData.id).catch(err => {
                        errorProcess({ ...err }.response)
                      })
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
    lawyerList: state.patenTrack.lawyerList,
  }
}

const mapDispatchToProps = {
  getLawyers,
  addLawyer,
  updateLawyer,
  deleteLawyer,
}

export default connect(mapStateToProps, mapDispatchToProps)(Lawyers)
