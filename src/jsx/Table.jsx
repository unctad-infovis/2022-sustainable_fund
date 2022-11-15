import React, { } from 'react';
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
    initialState: {
      pageSize: 50,
      pageIndex: 0,
      globalFilter: '',
      hiddenColumns: ['5'],
      sortBy: [{ id: 'fund_provider', desc: false }]
    }
  }, useGlobalFilter, useSortBy, useExpanded, usePagination);

  // Render the UI for your table
  return (
    <>
      <table
        {...getTableProps()}
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr className="search_row">
            <th colSpan={100}>
              <Filter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
          <tr className="loading_row">
            <th colSpan={100}>
              <div className="loading">Loading data...</div>
            </th>
          </tr>
          {headerGroups.map((group) => (
            <tr {...group.getHeaderGroupProps()} className="header_row">
              {group.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <span className="header">{column.render('Header')}</span>
                  <span style={{ fontSize: 0 }}>&nbsp;</span>
                  <span className="sort">
                    {
                      column.isSorted
                        ? column.isSortedDesc
                          ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-up" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z" />
                              <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z" />
                            </svg>
                          )
                          : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z" />
                              <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                            </svg>
                          )
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
                <tr {...row.getRowProps()} className="row">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps([{ style: cell.column.style }])}>
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
        <button className="left first" type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          ◀◀
        </button>
        {' '}
        <button className="left" type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
          ◀
        </button>
        {' '}
        <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>
          ▶
        </button>
        {' '}
        <button className="last" type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          ▶▶
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
    </>
  );
}

Table.propTypes = {
  columns: PropTypes.instanceOf(Array).isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  renderRowSubComponent: PropTypes.instanceOf(Function).isRequired
};

export default Table;
