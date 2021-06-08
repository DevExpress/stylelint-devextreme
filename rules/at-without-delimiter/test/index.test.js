const { lint } = require('stylelint');

const config = {
    plugins: ['./index.js'],
    rules: {
        'devextreme/at-without-delimiter': true
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

    console.table(warnings);

    expect(text).toBe(
        "Style 'margin' contains delimiter '/'. If you want to use division then use 'math.div()'."
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
                'devextreme/at-without-delimiter': 'none'
            }
        }
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});
