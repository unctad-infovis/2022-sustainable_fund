import React, { useState, useEffect } from 'react';
import '../styles/styles.less';

// Load helpers.
import Table from './Table.jsx';
import { getData } from './helpers/GetData.js';
import formatNr from './helpers/FormatNr.js';
import roundNr from './helpers/RoundNr.js';

// const appID = '#app-root-2022-sustainable_fund';

function addAlert(text, value) {
  return (value < 0) ? <span className="alert">{text}</span> : text;
}

function expander(row) {
  return (
    <span {...row.getToggleRowExpandedProps()}>
      {row.isExpanded ? '▼' : '▶'}
    </span>
  );
}

function compareNumericString(rowA, rowB, id, desc) {
  let a = Number.parseFloat(rowA.values[id]);
  let b = Number.parseFloat(rowB.values[id]);
  if (Number.isNaN(a)) { // Blanks and non-numeric strings to bottom
    a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
    b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

function App() {
  // Data states.
  // const [data, setData] = useState(false);
  const [columnData, setColumnData] = useState([]);
  const [rowData, setRowData] = useState([]);

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <>
        <div className="sub_component_row">
          <span className="label">Fund name: </span>
          {' '}
          <span className="value">{row.original[8]['Fund Name']}</span>
        </div>
        <div className="sub_component_row">
          <span className="label">ISIN: </span>
          {' '}
          <span className="value">{row.original[8].ISIN}</span>
        </div>
        <div className="sub_component_row">
          <span className="label">LPID: </span>
          {' '}
          <span className="value">{row.original[8].LPID}</span>
        </div>
        <div className="sub_component_row">
          <div className="label">Funds Description: </div>
          {' '}
          <p className="value">{row.original[8]['Funds Description']}</p>
        </div>
      </>
    ),
    []
  );

  useEffect(() => {
    getData().then(data => {
      setColumnData([{
        Header: () => null,
        id: 'expander',
        Cell: ({ row }) => expander(row),
      }, {
        accessor: '0',
        Cell: ({ value }) => value,
        Header: 'Fund Provider'
      }, {
        accessor: '1',
        Cell: ({ value }) => formatNr(roundNr(value, 1), ',', 'M', '$'),
        Header: 'AuM',
        style: { textAlign: 'right' }
      }, {
        accessor: '2',
        Cell: ({ value }) => addAlert(formatNr(roundNr(parseFloat(value) * 100, 1), '.', '%', '', true, true), parseFloat(value)),
        Header: 'PERF 2021 USD',
        sortType: compareNumericString,
        style: { textAlign: 'right' }
      }, {
        accessor: '3',
        Cell: ({ value }) => value,
        Header: 'Region'
      }, {
        accessor: '4',
        Cell: ({ value }) => value,
        Header: 'ESG Rating (Conser)',
        style: { textAlign: 'center' }
      }, {
        accessor: '5',
        Cell: ({ value }) => ((value !== '') ? value : '–'),
        Header: 'Applied SFDR Article',
      }, {
        accessor: '6',
        Cell: ({ value }) => addAlert(formatNr(roundNr(parseFloat(value) * 100, 1), '.', '%', '', true, true, value), parseFloat(value)),
        Header: 'Net climate impact',
        sortType: compareNumericString,
        style: { textAlign: 'right' }
      }, {
        accessor: '7',
        Cell: ({ value }) => formatNr(roundNr(parseFloat(value) * 100, 1), '.', '%', '', true, true),
        Header: 'SDG Alignment',
        sortType: compareNumericString,
        style: { textAlign: 'right' }
      }]);

      const columns = ['Fund Provider', 'AuM ($ million)', 'PERF 2021 USD', 'Region', 'ESG Rating (Conser)', 'Applied SFDR Article', 'Net climate impact (%)', 'SDG Alignment (%)'];
      const rows = data.map(row => ({
        0: row[columns[0]],
        1: row[columns[1]],
        2: row[columns[2]],
        3: row[columns[3]],
        4: row[columns[4]],
        5: row[columns[5]],
        6: row[columns[6]],
        7: row[columns[7]],
        8: row
      }));

      setRowData(rows);
    });
  }, []);

  return (
    <div className="app">
      <Table
        columns={columnData}
        data={rowData}
        renderRowSubComponent={renderRowSubComponent}
      />
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
