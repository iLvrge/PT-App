import React, { Fragment, useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addDocument, deleteDocument, fetchDocuments } from '../../../../actions/settingsActions'
import { setPDFFile, setPDFViewModal, setPdfTabIndex } from '../../../../actions/patenTrackActions' 
import DocumentForm from './DocumentForm'
import FileViewerDialog from '../../components/FileViewerDialog'
import PdfViewer from '../../../common/PdfViewer'
import { FaFile } from 'react-icons/fa'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Page from '../../components/Page'
import { setBreadCrumbs } from  '../../../../actions/patentTrackActions2'

const ID_KEY = 'document_id'
const TITLE = 'Documents'
const NAME = 'document'

const ACTIONS = {
  fetchItems: fetchDocuments,
  deleteItem: deleteDocument,
  addItem: addDocument,
  // updateItem: updateDocument,
}

const Documents = () => {
  const { list, loading } = useSelector(state => state.settings.documents)
  const dispatch = useDispatch()
  const pdfViewModal = useSelector(state => state.patenTrack2.pdfViewModal)

  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Documents'))
  }, [ dispatch ])


  const FileRender = useMemo(() => (file) => {
    const onClickFile = (src) => (e) => {
      e.stopPropagation()
      //setViewerSrc('http://localhost:3000/assets/images/logos/patentrack_logo.png')
      //setViewerSrc(src)
      dispatch(setPDFFile({ document: src, form: '', agreement: ''}))
      dispatch(setPDFViewModal(true))
      dispatch(setPdfTabIndex(3)) 
    }

    return (
      <Tooltip title={file}>
        <IconButton color={'secondary'} size={'small'} onClick={onClickFile(file)}>
          <FaFile />
        </IconButton>
      </Tooltip>
    )
  }, [])

  const COLUMNS = useMemo(() => [
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
    { id: 'file', label: 'File', render: FileRender, alignCenter: true, width: 150 },
  ], [ FileRender ])

  return (
    <Fragment>
      {/* <FileViewerDialog viewerSrc={viewerSrc} setViewerSrc={setViewerSrc} /> */}
      {
        pdfViewModal &&
        <Modal open={pdfViewModal}>
          <PdfViewer display={'true'}/>
        </Modal>
      }
      <Page
        loading={loading}
        actions={ACTIONS}
        name={NAME}
        fieldsComponent={DocumentForm}
        idKey={ID_KEY}
        title={TITLE}
        columns={COLUMNS}
        data={list}
      />
    </Fragment>
  )
}

export default Documents
