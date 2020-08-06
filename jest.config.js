module.exports = {
    testEnvironment: "node",
    testMatch: [
        "**/*.test.js"
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 100,
            lines: 95,
            statements: 90
        }
    }
}