// Load helpers.
import CSVtoJSON from './CSVtoJSON.js';

export const getData = () => fetch((window.location.href.includes('gsfo.org')) ? 'https://storage.unctad.org/2022-sustainable_fund/assets/data/sustainability_fund - data.csv' : './assets/data/sustainability_fund - data.csv')
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.text();
  })
  .then(body => CSVtoJSON(body));

export default getData;
