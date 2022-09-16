import React, { useState, useEffect } from 'react';
import '../styles/styles.less';

// Load helpers.
import Table from './Table.jsx';
import { getData } from './helpers/GetData.js';
// import formatNr from './helpers/FormatNr.js';
// import roundNr from './helpers/RoundNr.js';

// const appID = '#app-root-2022-sustainable_fund';

function App() {
  // Data states.
  // const [data, setData] = useState(false);
  const [columnData, setColumnData] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const columns = ['Fund Provider', 'AuM ($ million)', 'Performance', 'Region', 'ESG Rating (Conser)', 'Applied SFDR Article', 'Net climate impact (%)', 'SDG Alignment (%)'];
    getData().then(data => {
      setColumnData(columns.map((column, i) => ({
        accessor: `${i}`, Header: column
      })));

      // console.log(columns.map((column, i) => ({ [i]: column })));
      // console.log({ 0: 'value', 1: 'value' });
      const rows = data.map(row => ({
        0: row[columns[0]],
        1: row[columns[1]],
        2: row[columns[2]],
        3: row[columns[3]],
        4: row[columns[4]],
        5: row[columns[5]],
        6: row[columns[6]],
        7: row[columns[7]]
      }));

      setRowData(rows);
    });
  }, []);

  return (
    <div className="app">
      <Table columns={columnData} data={rowData} />
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
