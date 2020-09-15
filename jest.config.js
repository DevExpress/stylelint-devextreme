module.exports = {
    testEnvironment: "node",
    testMatch: [
        "**/*.test.js"
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
}