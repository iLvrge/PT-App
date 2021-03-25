import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initEnvironment, setCookie } from '../actions/patenTrackActions'
import routes from '../routes'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCookie())
    dispatch(initEnvironment())
  }, [ dispatch ])

  return routes
} 

export default App