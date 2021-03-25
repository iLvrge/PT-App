import React, { useCallback } from 'react'
import Paper from '@material-ui/core/Paper'
import { DragDropProvider, Grid, TableColumnReordering, TableHeaderRow, TableSelection, VirtualTable } from '@devexpress/dx-react-grid-material-ui'
import { FilteringState, IntegratedFiltering, IntegratedSorting, SelectionState, SortingState } from '@devexpress/dx-react-grid'
import _last from 'lodash/last'
import { FilterValuesProvider } from './filter_values_provider'
import HeaderFilterState from './header-filter-state'
import HeaderCell from './HeadCell'

const getRowId = row => row.id

export default function VirtualizedTable2({ rows, columns, selected, setSelected, multiSelection }) {
  const onSelectionChange = useCallback((selection) => {
    if (multiSelection) {
      setSelected(selection)
    } else {
      setSelected(selection.length ? [ _last(selection) ] : selection)
    }
  }, [ setSelected, multiSelection ])

  return (
    <Paper>
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      >
        <HeaderFilterState
          defaultFilters={[]}
        />

        <DragDropProvider />
        <SortingState defaultSorting={[]} />
        <IntegratedSorting />

        <SelectionState
          selection={selected}
          onSelectionChange={onSelectionChange}
        />

        <FilteringState defaultFilters={[]} />

        <IntegratedFiltering />

        <VirtualTable containerComponent={({ children }) => <div>{children}</div>}/>

        <TableHeaderRow showSortingControls draggingEnabled cellComponent={HeaderCell} />

        <TableColumnReordering defaultOrder={columns.map(({ name }) => name)} />

        <TableSelection
          selectByRowClick
          showSelectionColumn={false}
          highlightRow />
        <FilterValuesProvider />
      </Grid>
    </Paper>
  )
};
