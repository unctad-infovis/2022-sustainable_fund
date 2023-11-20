import React, { useState, useEffect, useRef } from 'react';
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

  const appRef = useRef();

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <div className="sub_component">
        <h3>{row.original[8]['Fund Name']}</h3>
        <p>{row.original[8]['Funds Description']}</p>
        <div className="further_info_container">
          {
            [{ title: 'ISIN', id: 'ISIN' }].map(value => (
              <div className="top_column" key={value.id}>
                <span className="label">
                  {value.title}
                  :
                </span>
                {' '}
                <span className="value">{row.original[8][value.id]}</span>
              </div>
            ))
          }
        </div>
        <div className="further_info_container">
          <div className="column column_0">
            <h4>Net climate impact</h4>
            {
              [{ title: 'Cleantech minus fossil fuels', id: 'Net climate impact' }, { title: 'Cleantech in total', id: 'Clean tech' }, { title: 'Fossil Fuels in total', id: 'Fossil fuels' }, { title: 'Share of Coal in Fossil', id: 'Coal' }].map((value, i) => (
                <div className="row" key={value.id}>
                  <div className="label">
                    {value.title}
                  </div>
                  {(i < 4)
                    ? (
                      <div className={(i === 0) ? `value_container value_container_${i} with_bar first` : `value_container value_container_${i} with_bar`}>
                        <div className="bar" style={{ width: `${row.original[8][value.id] * 100}%` }} />
                        {
                          row.original[8][value.id] > 0.8
                            ? (
                              <span className="value" style={{ marginLeft: '1%', color: '#fff' }}>
                                {(i < 4) ? formatNr(roundNr(parseFloat(row.original[8][value.id]) * 100, 2), '.', '%', '', true, true) : formatNr(roundNr(row.original[8][value.id], 1), ',', '%', '')}
                              </span>
                            )
                            : (
                              <span className="value" style={{ marginLeft: `${Math.max(row.original[8][value.id] * 100, 0) + 1}%` }}>
                                {(i < 4) ? formatNr(roundNr(parseFloat(row.original[8][value.id]) * 100, 2), '.', '%', '', true, true) : formatNr(roundNr(row.original[8][value.id], 1), ',', '%', '')}
                              </span>
                            )
                        }
                        <span className="avg">
                          {(i === 0 ? 'Database ' : '')}
                          {`avg ${formatNr(roundNr(row.original[value.id] * 100, 1), '.', '%', '', true, true)}`}
                        </span>
                      </div>
                    )
                    : (
                      <div className="value_container">
                        <span className="value" style={{ fontWeight: 'bold' }}>
                          {formatNr(roundNr(row.original[8][value.id], 1), ',', ' metric tons', '')}
                        </span>
                        {value.title === 'Carbon intensity ⁵ (metric tons/$ million revenue)' && <span className="avg">{`avg ${formatNr(roundNr(row.original[value.id], 1), ',', 'MT', '', true, false)}`}</span>}
                      </div>
                    )}
                </div>
              ))
            }
          </div>
          <div className="column column_1">
            <h4>Sustainable Development Goals</h4>
            {
              [{ title: 'SDG Alignment', id: 'UNCTAD SDG Alignment' }, { title: 'Sensitive sectors ⁴', id: 'UNCTAD Sensitive sectors' }].map((value, i) => (
                <div className="row" key={value.id}>
                  <div className="label">
                    {value.title}
                  </div>
                  <div className={`value_container value_container_${i} with_bar`}>
                    <div className="bar" style={{ width: `${row.original[8][value.id] * 100}%` }} />
                    {
                      row.original[8][value.id] > 0.8
                        ? (
                          <span className="value" style={{ marginLeft: '1%', color: '#fff' }}>
                            {formatNr(roundNr(parseFloat(row.original[8][value.id]) * 100, 2), '.', '%', '', true, true)}
                          </span>
                        )
                        : (
                          <span className="value" style={{ marginLeft: `${row.original[8][value.id] * 100 + 1}%` }}>
                            {formatNr(roundNr(parseFloat(row.original[8][value.id]) * 100, 2), '.', '%', '', true, true)}
                          </span>
                        )
                    }
                    <span className="avg">{`avg ${formatNr(roundNr(row.original[value.id] * 100, 1), '.', '%', '', true, true)}`}</span>
                  </div>
                </div>
              ))
            }
            <br />
            <h4>Sustainability Investment Strategy</h4>
            {
              ['Sustainabilty Theme'].map(value => (
                <div className="row" key={value}>
                  <span className="value">✅</span>
                  {' '}
                  <span className="label">
                    {value}
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    ),
    []
  );

  useEffect(() => {
    getData().then(data => {
      setColumnData([{
        Cell: ({ row }) => expander(row),
        Header: () => null,
        id: 'expander',
        style: { textAlign: 'center' }
      }, {
        accessor: '0',
        Cell: ({ value }) => value,
        Header: 'Fund Provider',
        id: 'fund_provider'
      }, {
        accessor: '1',
        Cell: ({ value }) => formatNr(roundNr(value, 0), ' ', '', ''),
        Header: 'AUM ¹, millions of USD',
        style: { textAlign: 'right' }
      }, {
        accessor: '2',
        Cell: ({ value }) => addAlert(formatNr(roundNr(parseFloat(value) * 100, 1), '.', '', '', true, true), parseFloat(value)),
        Header: 'Financial performance 2020-2021, %',
        sortType: compareNumericString,
        style: { textAlign: 'right' }
      }, {
        accessor: '3',
        Cell: ({ value }) => value,
        Header: 'Region'
      }, {
        accessor: '4',
        Cell: ({ value }) => `${value}/10`,
        Header: 'ESG Rating, Conser ²',
        style: { textAlign: 'center' }
      }, {
        accessor: '5',
        Cell: ({ value }) => ((value !== '') ? value : '–'),
        Header: 'Applied SFDR Article ³',
      }, {
        accessor: '6',
        Cell: ({ value }) => addAlert(formatNr(roundNr(parseFloat(value) * 100, 2), '.', '', '', true, true, value), parseFloat(value)),
        Header: 'Net climate impact, %',
        sortType: compareNumericString,
        style: { textAlign: 'right' }
      }, {
        accessor: '7',
        Cell: ({ value }) => formatNr(roundNr(parseFloat(value) * 100, 2), '.', '', '', true, true),
        Header: 'SDG Alignment ³, %',
        sortType: compareNumericString,
        style: { textAlign: 'right' }
      }]);

      const columns = ['Fund Provider', 'AuM 2022 - amount USD mios', 'Perf 1Y USD', 'Geography', 'ESG Rating', 'SFDR', 'Net climate impact', 'UNCTAD SDG Alignment'];
      const rows = data.map(row => ({
        0: row[columns[0]],
        1: row[columns[1]],
        2: row[columns[2]],
        3: row[columns[3]],
        4: row[columns[4]],
        5: row[columns[5]],
        6: row[columns[6]],
        7: row[columns[7]],
        8: row,
        'AuM 2022 - amount USD mios': data.reduce((a, b) => a + parseFloat(b['AuM 2022 - amount USD mios']), 0) / data.length,
        'Clean tech': data.reduce((a, b) => a + parseFloat(b['Clean tech']), 0) / data.length,
        'Portfolio weighted Co2 Intensity (tCO2/mio Revenues $)': data.reduce((a, b) => a + parseFloat(b['Portfolio weighted Co2 Intensity (tCO2/mio Revenues $)']), 0) / data.length,
        Coal: data.reduce((a, b) => a + parseFloat(b.Coal), 0) / data.length,
        'Fossil fuels': data.reduce((a, b) => a + parseFloat(b['Fossil fuels']), 0) / data.length,
        'Net climate impact': data.reduce((a, b) => a + parseFloat(b['Net climate impact']), 0) / data.length,
        'UNCTAD SDG Alignment': data.reduce((a, b) => a + parseFloat(b['UNCTAD SDG Alignment']), 0) / data.length,
        'UNCTAD Sensitive sectors': data.reduce((a, b) => a + parseFloat(b['UNCTAD Sensitive sectors']), 0) / data.length
      }));
      appRef.current.querySelector('.loading_row').style.display = 'none';
      appRef.current.querySelector('.pagination').style.display = 'block';
      appRef.current.querySelector('.caption').style.display = 'block';
      setRowData(rows);
    });
  }, []);

  return (
    <div className="app" ref={appRef}>
      <Table
        columns={columnData}
        data={rowData}
        renderRowSubComponent={renderRowSubComponent}
      />
      <div className="caption">
        <div>
          <em>Source: </em>
          <span>ESG data & analysis provided by Conser. Other data based on public data sources.</span>
        </div>
        <div>
          <em>Notes: </em>
          <span>
            <sup>1</sup>
            AUM – Assets under management;
            {' '}
            <sup>2</sup>
            Conser&apos;s ESG Consensus rating uses a reverse engineering proprietary methodology to capture the spectrum of ESG opinions on a company or issuer by leading rating companies and key ESG asset managers, and thus to discover and reflect the consensus of the market.
            {' '}
            {/* <sup>3</sup>
            SFDR - Sustainable Finance Disclosure Regulation (European Union only);
            {' '} */}
            <sup>3</sup>
            SDG Alignment is the share of exposure of the fund to the following SDG relevant sectors: water and sanitation, transport infrastructure, telecommunications infrastructure, health, food and agriculture, education, ecosystems/biodiversity and climate change mitigation/renewables;
            {' '}
            <sup>4</sup>
            Sensitive sectors includes weapons, cluster bombs and tobacco.
            {/* {' '}
            <sup>6</sup>
            CO2 Intensity is the carbon intensity of a portfolio measured by metric tons of carbon emissions per million dollars of revenue. */}
          </span>
        </div>
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
