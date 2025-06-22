export default {
  rootDir: './',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['./tests/setupTests.js'],
  transform: {},
   moduleNameMapper: {
    "^@/controllers/(.*)$": "<rootDir>/controllers/$1",
    "^@/routes/(.*)$": "<rootDir>/routes/$1",
    "^@/middleware/(.*)$": "<rootDir>/middleware/$1",
  },
};
