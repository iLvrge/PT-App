import MaterialTable, {MTableToolbar} from 'material-table'
import React, { forwardRef, useRef, useState } from 'react'
import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn, HelpOutline } from '@material-ui/icons'
import Modal from '@material-ui/core/Modal'
import useStyles from './styles'

const TABLE_ICONS = {
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

const OPTIONS = {
  paging: false,
  search: false,
  showTitle: false,
  // addRowPosition: 'first',
  // toolbarButtonAlignment: 'left',
  // toolbar: false,
  headerStyle: { whiteSpace: 'nowrap' },
  rowStyle: () => ({ whiteSpace: 'nowrap', backgroundColor: '#303030' }),
}



const StyledMaterialTable = (props) => {
  const classes = useStyles()
  const tableRef = useRef()
  const [open, setOpen] = useState(false)
  const [help, setHelp] = useState(props.help != undefined ? props.help : false)

  const onHandleHelpOpen = () => {
    setOpen(true)
  }
  
  const onHandleHelpClose = () => {
    setOpen(false)
  }

  
  return (
    <div className={classes.materialTableContainer}>
      <MaterialTable tableRef={tableRef}
        localization={{
          header: {
            actions: '#',
          },
        }}
        icons={TABLE_ICONS}
        options={OPTIONS}
        components={{
          Toolbar: props => (
              <>
                { help === true ? <HelpOutline className={classes.helpButton} onClick={onHandleHelpOpen}/> : ''}
                <MTableToolbar {...props} />
              </> 
          ),
        }}
        
        {...props} />
        {
          props.help === true
          ?
          <Modal
            open={open}
            onClose={onHandleHelpClose}
            aria-labelledby="help-modal-title"
            aria-describedby="help-modal-description"
          >
            <div>
              Modal
            </div>
          </Modal>
          :
          ''
        }        
    </div>
  )
}

export default StyledMaterialTable
