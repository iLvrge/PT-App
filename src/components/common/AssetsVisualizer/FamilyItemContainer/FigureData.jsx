import React, { useState } from 'react'
import Viewer from 'react-viewer'
import useStyles from './styles'
import Loader from '../../Loader'
import useFamilyFigures from '../../../../queries/useFamilyFigures'
import { parseSupplied, isAbsent } from '../../../../queries/parseSupplied'

/**
 * Figures supplied by the parent are used as given; otherwise they are fetched
 * by patent number.
 *
 * The previous version had two effects - one guarded on the supplied data being
 * absent, the other keyed on `number` and unguarded - so supplied figures were
 * fetched over anyway. Only the guarded behaviour is kept. The manual
 * PatenTrackApi.cancelFamilyData() goes with it: keying by number means a
 * superseded request is simply no longer the active query.
 */
const FigureData = ({ data, number, standalone }) => {
  const classes = useStyles()
  const [ visible ] = useState(true)

  const supplied = parseSupplied(data)
  const useSupplied = !isAbsent(supplied)

  const { data: fetched, isFetching } = useFamilyFigures(number, { enabled: !useSupplied })
  const figures = useSupplied ? supplied : (fetched || [])

  if (isFetching) return <Loader />
  return (
    <div className={classes.container}>
      <div className={classes.inlineContainer} id={`container`}></div>
      {
        Array.isArray(figures) && figures.length > 0 && (
          <Viewer
            visible={visible}
            container={standalone === true
              ? document.querySelector('.fullscreenModal #container')
              : document.getElementById('container')}
            images={figures}
            defaultScale={1}
            minScale={1}
            drag={false}
            disableKeyboardSupport={true}
            noClose={true}
            noImgDetails={true}
            scalable={false}
            noResetZoomAfterChange={true}
            disableMouseZoom={true}
          />
        )
      }
    </div>
  )
}

export default FigureData
