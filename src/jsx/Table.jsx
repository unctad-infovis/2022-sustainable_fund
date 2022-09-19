import React from 'react';
// https://www.npmjs.com/package/react-table
import {
  useTable, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce
} from 'react-table';
import PropTypes from 'prop-types';

function Filter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 200);

  return (
    <span>
      Search:
      {' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}

Filter.propTypes = {
  preGlobalFilteredRows: PropTypes.instanceOf(Array).isRequired,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.instanceOf(Function).isRequired
};
Filter.defaultProps = {
  globalFilter: ''
};

function Table({ columns, data }) {
  // https://akashmittal.com/react-table-learn-filter-sort-pagination-in-10-minutes/
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable({
    columns,
    data,
    initialState: { pageSize: 50, pageIndex: 0, globalFilter: '' }
  }, useGlobalFilter, useSortBy, usePagination);

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
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
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
  data: PropTypes.instanceOf(Array).isRequired
};

export default Table;
