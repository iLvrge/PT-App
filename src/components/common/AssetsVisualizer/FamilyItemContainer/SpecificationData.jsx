import React from 'react'
import { Typography } from '@mui/material'
import useStyles from './styles'
import Loader from '../../Loader'
import useSpecificationData from '../../../../queries/useSpecificationData'
import { parseSupplied, isAbsent } from '../../../../queries/parseSupplied'

const SpecificationTree = ({ items, className }) => (
  <div className={className}>
    <ul id={`specifications`} className={`filetree treeview`} width='100%'>
      {items.map((child, index) => (
        <li key={`asset-type-${index}`}>
          <span id={`specification_${index}`}>
            <Typography
              variant='body2'
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{
                __html: Object.keys(child).length > 0 && child.text !== undefined ? child.text : child,
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  </div>
)

/** Same guarded-vs-unguarded effect pair as FigureData; only the guard is kept. */
const SpecificationData = ({ data, number }) => {
  const classes = useStyles()

  const supplied = parseSupplied(data)
  const useSupplied = !isAbsent(supplied)

  const { data: fetched, isFetching } = useSpecificationData(number, { enabled: !useSupplied })
  const items = useSupplied ? supplied : (fetched || [])

  if (isFetching) return <Loader />
  if (!Array.isArray(items)) return null
  return <SpecificationTree items={items} className={classes.filetree} />
}

export default SpecificationData
