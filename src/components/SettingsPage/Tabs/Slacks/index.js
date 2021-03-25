import React, {useMemo, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'



import { setBreadCrumbs } from  '../../../../actions/patentTrackActions2'

const Slacks = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(setBreadCrumbs('Settings > Slacks'))
  }, [ dispatch ])

  
  return (
    <>
    </>
  )
}

export default Slacks
