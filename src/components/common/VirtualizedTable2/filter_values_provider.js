import React from 'react'
import { Plugin, Template, TemplateConnector, TemplatePlaceholder } from '@devexpress/dx-react-core'
import { Table, TableHeaderRow } from '@devexpress/dx-react-grid'

const isFilterTableCell = (tableRow, tableColumn) =>
  tableRow.type === TableHeaderRow.ROW_TYPE &&
  tableColumn.type === Table.COLUMN_TYPE

export const FilterValuesProvider = React.memo(() => (
  <Plugin name="FilterValuesProvider">
    <Template
      name="tableCell"
      predicate={({ tableRow, tableColumn }) =>
        isFilterTableCell(tableRow, tableColumn)
      }
    >
      {params => (
        <TemplateConnector>
          {({ columnFilterValues, headerFilters }, { setHeaderFilters }) => {
            return (
              <TemplatePlaceholder
                params={{
                  ...params,
                  columnFilterValues,
                  headerFilters,
                  setHeaderFilters,
                }}
              />
            )
          }}
        </TemplateConnector>
      )}
    </Template>
  </Plugin>
))
