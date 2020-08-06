const { lint } = require("stylelint");

const config = {
    plugins: ["./index.js"],
    rules: {
        "devextreme/only-variables-in-use": [true]
    }
};

it("warns for direct import of public widget (from other widget)", async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        files: "scss/widgets/generic/widget2/_index.scss",
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(1);

    const [{ line, column, text }] = warnings;

    expect(text).toBe(
        `Public widget 'widget1' is used in the "@use" at-rule directly. Use _colors, _sizes, _mixins instead`
    );
    expect(line).toBe(12);
    expect(column).toBe(1);
});

it("linter skips theme index files", async () => {
    const {
        results: [{ warnings, parseErrors }]
    } = await lint({
        files: "scss/widgets/generic/_index.scss",
        config
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
});
