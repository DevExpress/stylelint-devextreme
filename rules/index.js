const atUseNoPublicWidgets = require('./at-use-no-public-widgets');
const atWithoutDelimiter = require('./no-slash-division');

var exportModules = {
    'at-use-no-public-widgets': atUseNoPublicWidgets,
    'no-slash-division': atWithoutDelimiter
}

module.exports = exportModules;
