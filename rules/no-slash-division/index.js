const stylelint = require('stylelint');

const ruleName = 'no-slash-division';
const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: "Use 'math.div()' instead of slash division"
});

const enableStyles = [
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

            if(enableStyles.includes(prop)) {
                return;
            }

            stylelint.utils.report({
                ruleName,
                result,
                message: `Style '${prop}' contains slash division. If you want to use division then use 'math.div()'.`,
                node: decl
            });
        });

        return;
    }
}

module.exports.ruleName = ruleName;
module.exports.messages = messages;
