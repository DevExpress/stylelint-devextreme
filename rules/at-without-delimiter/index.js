const stylelint = require('stylelint');

const ruleName = 'at-without-delimiter';
const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: "style must not contains delimiter '/'"
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

            console.table(decl);

            stylelint.utils.report({
                ruleName,
                result,
                message: `Style '${prop}' contains delimiter '/'. If you want to use division then use 'math.div()'.`,
                node: decl
            });
        });

        return;
    }
}

module.exports.ruleName = ruleName;
module.exports.messages = messages;
