import React from 'react';
import {
  useAsyncDebounce
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

export default Filter;
