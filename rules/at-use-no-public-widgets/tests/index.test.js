const { lint } = require('stylelint');

const config = {
    plugins: ['./index.js'],
    rules: {
        'devextreme/at-use-no-public-widgets': true
    }
};

it('warns for direct import of public widget (from other widget)', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        files: 'scss/widgets/generic/widget2/_index.scss',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(1);

    const [{ line, column, text }] = warnings;

    expect(text).toBe(
        `Public widget 'widget1' is used in the "@use" at-rule directly. Use _colors, _sizes, _mixins instead`
    );
    expect(line).toBe(13);
    expect(column).toBe(1);
});

it('linter skips theme index files', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        files: 'scss/widgets/generic/_index.scss',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore partial "@use"', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        codeFilename: 'scss/widgets/generic/widget1/_index.scss',
        code: '@use',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore partial "@use " (at-rule and space)', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        codeFilename: 'scss/widgets/generic/widget1/_index.scss',
        code: '@use ',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore partial "@use """ (at-rule and braces)', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        codeFilename: 'scss/widgets/generic/widget1/_index.scss',
        code: '@use ""',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore any files from the "base" folder', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        codeFilename: 'scss/widgets/base/widget1/_index.scss',
        code: '',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore any files from the "bundles" folder', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        codeFilename: 'scss/bundles/dx.light.scss',
        code: '',
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore non-scss code', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        code: 'div {}',
        config,
        syntax: 'less'
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore wrong options', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        code: 'div {}',
        config: {
            plugins: ['./index.js'],
            rules: {
                'devextreme/at-use-no-public-widgets': 'some'
            }
        }
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});

it('ignore with "false" option', async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        code: 'div {}',
        config: {
            plugins: ['./index.js'],
            rules: {
                'devextreme/at-use-no-public-widgets': false
            }
        }
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});
