import React from 'react';
// https://www.npmjs.com/package/react-table
import {
  useTable, useSortBy, usePagination, useGlobalFilter, useExpanded
} from 'react-table';

import PropTypes from 'prop-types';

// Load helpers.
import Filter from './helpers/Filter.jsx';

function Table({ columns, data, renderRowSubComponent }) {
  // https://akashmittal.com/react-table-learn-filter-sort-pagination-in-10-minutes/
  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    preGlobalFilteredRows,
    prepareRow,
    previousPage,
    setGlobalFilter,
    setPageSize,
    state: {
      pageIndex, pageSize, globalFilter
    },
    visibleColumns
  } = useTable({
    columns,
    data,
    initialState: { pageSize: 50, pageIndex: 0, globalFilter: '' }
  }, useGlobalFilter, useSortBy, useExpanded, usePagination);

  // Render the UI for your table
  return (
    <div className="app">
      <table
        {...getTableProps()}
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr className="search">
            <th colSpan={100}>
              <Filter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
          {headerGroups.map((group) => (
            <tr {...group.getHeaderGroupProps()} className="header">
              {group.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {
                      column.isSorted
                        ? column.isSortedDesc
                          ? ' ↑'
                          : ' ↓'
                        : ''
                    }
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps([
                        {
                          style: cell.column.style,
                        }
                      ])}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        {' '}
        <button type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        {' '}
        <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        {' '}
        <button type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        {' '}
        <span>
          Page
          {' '}
          <strong>
            {pageIndex + 1}
            {' '}
            of
            {' '}
            {pageCount}
          </strong>
          {' '}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pages) => (
            <option key={pages} value={pages}>
              Show
              {' '}
              {pages}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.instanceOf(Array).isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  renderRowSubComponent: PropTypes.instanceOf(Function).isRequired
};

export default Table;
