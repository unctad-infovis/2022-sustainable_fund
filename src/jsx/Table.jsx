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
                  <span>
                    {
                      column.isSorted
                        ? column.isSortedDesc
                          ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                              <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                            </svg>
                          )
                          : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                              {' '}
                              <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                            </svg>
                          )
                        : ''
                    }
                  </span>
                  &nbsp;
                  {column.render('Header')}
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
