module.exports = {
  rootDir: './',
  preset: 'react-native',
  setupFiles: ['./__tests__/setup.ts'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 70,
      lines: 80,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
};
