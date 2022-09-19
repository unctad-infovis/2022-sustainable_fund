const roundNr = (x, d) => (x ? parseFloat((parseFloat(x).toFixed(d))) : x);

export default roundNr;
