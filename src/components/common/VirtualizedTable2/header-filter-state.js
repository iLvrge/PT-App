import React, { useCallback, useMemo, useState } from 'react'
import { Action, Getter, Plugin } from '@devexpress/dx-react-core'

const filterValuesComputed = ({ rows, columns, getCellValue }) => (
  columns.reduce((acc, { name: colName }) => {
    const values = new Set(rows.map(r => getCellValue(r, colName)))
    acc[colName] = Array.from(values)
    return acc
  }, {})
)

const HeaderFilterState = (props) => {
  const [ filters, setFilters ] = useState(props.defaultFilters || [])

  const filterExpression = useMemo(() => ({
    filters,
    operator: 'and'
  }), [ filters ])

  return (
    <Plugin name="HeaderFilterState">
      <Getter name="headerFilters" value={filters} />
      <Getter name="filterExpression" value={filterExpression} />
      <Getter name="columnFilterValues" computed={filterValuesComputed} />
      <Action name="setHeaderFilters" action={setFilters} />
    </Plugin>
  )
}

export default HeaderFilterState
