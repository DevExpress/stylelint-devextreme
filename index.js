const stylelint = require('stylelint');
const rules = require('./rules');

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return stylelint.createPlugin(`devextreme/${ruleName}`, rules[ruleName]);
});

exports.default = rulesPlugins;
