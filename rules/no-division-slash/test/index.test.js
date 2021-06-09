const { lint } = require('stylelint');

const config = {
    plugins: ['./index.js'],
    rules: {
        'devextreme/no-division-slash': true
    }
};

it('warns use delimiter', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        files: 'scss/widgets/base/_widget2.scss',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(1);

    const [{ line, text }] = warnings;

    expect(text).toBe(
        "Style 'margin' contains a division slash '/'. Use 'math.div()' for division instead."
    );
    expect(line).toBe(6);
});

it('ignore wrong options', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        code: 'div {}',
        config: {
            plugins: ['./index.js'],
            rules: {
                'devextreme/no-division-slash': 'none'
            }
        }
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});
