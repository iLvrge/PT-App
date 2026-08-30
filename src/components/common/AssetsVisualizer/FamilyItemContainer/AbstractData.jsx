import React from 'react'
import { useSelector } from 'react-redux'
import Typography from '@mui/material/Typography'

import Loader from '../../Loader'
import useAbstractData from '../../../../queries/useAbstractData'

const hasText = (value) => value != null && value.toString().trim() !== ''

/**
 * When the parent already supplies an abstract, that is used and no request is
 * made. Otherwise it is fetched by patent number.
 *
 * The previous version had two effects: one that fetched only when `data` was
 * empty, and a second keyed on `number` that fetched unconditionally on mount -
 * so a supplied abstract was still overwritten by a request. Only the first
 * behaviour is kept, which is what the guard in the first effect intended.
 */
const AbstractData = ({ data, number }) => {
  const familyDataRetrieved = useSelector((state) => state.patenTrack.familyDataRetrieved)

  const useSuppliedData = hasText(data)
  const { data: fetched, isFetching } = useAbstractData(number, {
    enabled: familyDataRetrieved === true && !useSuppliedData,
  })

  if (isFetching) return <Loader />
  return <Typography variant="body2">{useSuppliedData ? data : (fetched || '')}</Typography>
}

export default AbstractData
