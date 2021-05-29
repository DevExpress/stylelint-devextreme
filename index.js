const path = require('path');
const fs = require('fs');
const stylelint = require('stylelint');

const ruleName = 'devextreme/at-use-no-public-widgets';
const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: '@use must not load a public widget'
});

const cwd = process.cwd();
const publicWidgetsCache = {};

const MATH = 'math';
const COLORS = 'colors';
const SIZES = 'sizes';
const MIXINS = 'mixins';
const allowedIncludes = [MATH, COLORS, SIZES, MIXINS];

const INDEX = 'index';

const getPublicWidgetsList = (theme) => {
    if (publicWidgetsCache[theme]) {
        return publicWidgetsCache[theme];
    }

    const indexFileName = path.join(cwd, 'scss', 'widgets', theme, '_index.scss');
    const indexFileContent = fs.readFileSync(indexFileName, 'utf8');

    const result = [];
    const importRegex = /\.\/([\w]*)/g;

    let matches;
    while ((matches = importRegex.exec(indexFileContent)) !== null) {
        result.push(matches[1].toLowerCase());
    }

    publicWidgetsCache[theme] = result;

    return result;
};

const parseAndResolveImport = (importString, fileName) => {
    if (importString === "\"sass:color\"") return { file: COLORS };
    if (importString === "\"sass:math\"") return { file: MATH };

    const relativePath = importString.split('"')[1];

    if (!relativePath) return {};

    const absolutePath = path.resolve(path.dirname(fileName), relativePath);
    const cwdRelativePath = path.relative(cwd, absolutePath);
    const pathParts = cwdRelativePath.split(path.sep);

    const theme = pathParts[2];
    let widget = pathParts[3] ? pathParts[3].toLowerCase() : null;
    let file = pathParts[4] || INDEX;

    if (widget === COLORS || widget === SIZES) {
        file = widget;
        widget = null;
    }

    return {
        theme,
        widget,
        file
    }
}

module.exports = stylelint.createPlugin(ruleName, function (primary) {
    return function (root, result) {
        const validOptions = stylelint.utils.validateOptions(
            result,
            ruleName,
            {
                actual: primary,
                possible: [false, true],
            }
        );

        if (!validOptions) {
            return;
        }

        if (!primary) return;

        if (root.source.lang !== 'scss') {
            return;
        }

        const fileName = root.source.input.file;
        const relativeFileName = path.relative(cwd, fileName);
        const pathParts = relativeFileName.split(path.sep);

        if (pathParts[1] === 'bundles') return;

        const theme = pathParts[2];

        if (theme !== 'material' && theme !== 'generic') {
            // this the path of the source file
            // TODO any base file should not import other base file with styles (mixins only allowed)
            return;
        }

        const isIndexThemeFile = pathParts[3] === '_index.scss';

        if (isIndexThemeFile) {
            return;
        }

        root.nodes.forEach(node => {
            if (node.type !== 'atrule' || node.name !== 'use') {
                return;
            }

            const { theme, widget, file } = parseAndResolveImport(node.params, fileName);

            const isAllowedInclude = file === undefined || allowedIncludes.includes(file);
            const isTheme = theme === 'material' || theme === 'generic';
            if(isAllowedInclude || !isTheme) {
                return;
            }

            const publicWidgets = getPublicWidgetsList(theme);

            if (publicWidgets.includes(widget)) {
                stylelint.utils.report({
                    message: `Public widget '${widget}' is used in the "@use" at-rule directly. Use _colors, _sizes, _mixins instead`,
                    ruleName,
                    result,
                    node,
                    line: node.source.start.line,
                    column: node.source.start.column
                });
            }

        });
    };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
