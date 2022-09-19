const formatNr = (x, separator = ',', unit = '', prefix = '', addComma = false, addPlus = false, original_value = undefined) => {
  if (original_value === undefined) {
    original_value = x;
  }
  let extra = '';
  if ((addPlus === true && x > 0) || (addPlus === true && original_value > 0)) {
    extra = '+';
  } else if ((addPlus === true && x === 0) || (addPlus === true && original_value === 0)) {
    extra = '±';
  }
  if (x < 0 || original_value < 0) {
    extra = '-';
  }
  x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator).replace(/-/g, '');
  if (addComma === true && x.indexOf('.') === -1) {
    x += '.0';
  }
  return x === '' ? '-' : extra + prefix + x + unit;
};
export default formatNr;
