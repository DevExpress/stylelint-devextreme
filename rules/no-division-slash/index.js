const stylelint = require('stylelint');

const ruleName = 'no-division-slash';
const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: "Use 'math.div()' instead of a division slash"
});

const enableProperties = [
    'grid-area',
    'grid-row',
    'grid-column'
];

module.exports = function(primary) {
    return function (root, result) {
        const validOptions = stylelint.utils.validateOptions(
            result,
            ruleName,
            {
                actual: primary,
                possible: [false, true]
            }
        );

        if(!validOptions) {
            return;
        }

        root.walkDecls(function(decl) {
            const { prop, value } = decl;
            if(!value.includes(' / ')) {
                return;
            }

            if(enableProperties.includes(prop)) {
                return;
            }

            stylelint.utils.report({
                ruleName,
                result,
                message: `Style '${prop}' contains a division slash '/'. Use 'math.div()' for division instead.`,
                node: decl
            });
        });

        return;
    }
}

module.exports.ruleName = ruleName;
module.exports.messages = messages;
