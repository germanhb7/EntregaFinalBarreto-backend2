// En /utils/handlebarsHelpers.js
module.exports = {
  eq: (a, b) => a === b,
  multiply: (a, b) => a * b,
  json: (obj) => JSON.stringify(obj)
};