import { Dialog, DialogContent } from '../../../../ui/Dialog'
import MaterialTable, {MTableToolbar} from '@material-table/core'
import React, { forwardRef, useRef, useState } from 'react'
import AddBox from '@mui/icons-material/AddBox'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import Check from '@mui/icons-material/Check'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import Clear from '@mui/icons-material/Clear'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/Edit'
import FilterList from '@mui/icons-material/FilterList'
import FirstPage from '@mui/icons-material/FirstPage'
import LastPage from '@mui/icons-material/LastPage'
import Remove from '@mui/icons-material/Remove'
import SaveAlt from '@mui/icons-material/SaveAlt'
import Search from '@mui/icons-material/Search'
import ViewColumn from '@mui/icons-material/ViewColumn'
import HelpOutline from '@mui/icons-material/HelpOutline'

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
    <div className={"[&_.MuiToolbar-root]:min-h-0 [&_.MuiToolbar-root]:bg-[#303030] [&_.MuiPaper-elevation2]:shadow-none"}>
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
                { help === true ? <HelpOutline className={"absolute right-[45px] top-[13px] z-[1] h-5 w-5 cursor-pointer"} onClick={onHandleHelpOpen}/> : ''}
                <MTableToolbar {...props} />
              </> 
          ),
        }}
        
        {...props} />
        {
          props.help === true
          ?
          <Dialog open={open} onOpenChange={(next) => { if (!next) onHandleHelpClose() }}>
            <DialogContent title="Company Address" />
          </Dialog>
          :
          ''
        }        
    </div>
  )
}

export default StyledMaterialTable
